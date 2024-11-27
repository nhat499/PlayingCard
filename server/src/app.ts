import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./interfaces/socketInterface";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import nanoid from "nanoid-esm";
import { GameStates, Player } from "./interfaces/gameStateInterface";
import path from "path";
import dotenv from "dotenv";
import SocketHandler from "./socketHandler";
import regularDeck from "./presetGame/regularDeck.json";
import catan from "./presetGame/catan.json";
dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: ["http://localhost:3000", process.env.ORIGIN] }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./../../client/dist")));

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.ORIGIN,
    ],
  },
  transports: ["websocket", "polling"],
});

const gameStates: GameStates = {};
const PresetBoard = [regularDeck, catan];
const SH = new SocketHandler(gameStates, io, PresetBoard);

io.on("connection", (socket) => {
  console.log("i am socket", socket.handshake.query);

  socket.on("CreateRoom", async ({ name }) => {
    const roomId: string = nanoid(5);
    socket.join(roomId);
    const playerOne: Player = {
      hand: {},
      name,
      roomId: roomId,
      socketId: socket.id,
      roomLeader: true,
    };
    // const importBoard: Room["board"] = (
    //   await import("./presetGame/regularDeck.json")
    // ).default;
    gameStates[roomId] = {
      board: {},
      players: [playerOne],
      maxZIndex: 1,
      setting: {
        window: {
          width: 700,
          height: 500,
        },
      },
    };
    socket.emit("JoinRoom", playerOne, gameStates[roomId]);
  });
  socket.on("JoinRoom", async ({ name, roomId }) => {
    if (!gameStates[roomId]) {
      socket.emit("error", { message: "wrong room" });
      return;
    }
    const player: Player = {
      hand: {},
      name,
      roomId,
      roomLeader: false,
      socketId: socket.id,
    };
    gameStates[roomId].players.push(player);
    // i join room
    await socket.join(roomId);
    socket.emit("JoinRoom", player, gameStates[roomId]);

    // let everyone know I join
    socket.broadcast.to(roomId).emit("SomeOneJoin", gameStates[roomId].players);
  });
  socket.on("StartGame", ({ roomId, boardState, setting }) => {
    // socket.broadcast.to(roomId).emit("StartGame", { roomId, players, boardData });
    gameStates[roomId].board = boardState;
    if (setting) {
      gameStates[roomId].setting = setting;
    }

    io.in(roomId).emit("StartGame", { roomId, gameState: gameStates[roomId] });
  });

  socket.on("RequestRoomStates", ({ roomId, player }) => {
    // room no longer exists
    // update to error later
    if (!gameStates[roomId]) return;

    socket.join(roomId);
    // cant have same name, future bug , but for now okay
    const index = gameStates[roomId].players.findIndex(
      (currPlayer) => (currPlayer.name = player.name)
    );
    gameStates[roomId].players[index].socketId = socket.id;
    socket.emit("RequestStates", { roomState: gameStates[roomId] });
  });

  socket.on("LoadPresetBoard", (data) => {
    SH.addEventToQueue({
      type: "LoadPresetBoard",
      data,
      socket,
    });
  });
  socket.on("DropOnBoard", (data) => {
    SH.addEventToQueue({
      type: "DropOnBoard",
      data,
      socket,
    });
  });

  socket.on("DropOnHand", (data) => {
    SH.addEventToQueue({
      type: "DropOnHand",
      socket,
      data,
    });
  });

  socket.on("DropOnStack", (data) => {
    SH.addEventToQueue({
      type: "DropOnStack",
      socket,
      data,
    });
  });

  socket.on("SendMessage", (data) => {
    SH.SendMessage({ data, socket });
  });

  socket.on("FlipCard", (data) => {
    SH.addEventToQueue({ type: "FlipCard", data, socket });
  });

  socket.on("LockCard", (data) => {
    SH.addEventToQueue({
      type: "LockCard",
      data,
      socket,
    });
  });

  socket.on("ShuffleStack", (data) => {
    SH.addEventToQueue({
      type: "ShuffleStack",
      data,
      socket,
    });
  });

  socket.on("FlipStack", (data) => {
    SH.addEventToQueue({
      data,
      type: "FlipStack",
      socket,
    });
  });

  socket.on("OnBoardDrag", ({ item, player }) => {
    const roomId = player.roomId;
    item.disabled = true;
    if ("data" in item) {
      item.data = [];
    }
    socket.broadcast.to(roomId).emit("OnBoardDrag", { item, player });
  });

  // socket.on("DragFromStack", ({ item, player }) => {
  //   const roomId = player.roomId;
  //   item.disabled = true;
  //   item.name = "...Dragging";

  //   const stack = gameStates[roomId].board[item.parent] as Stack;
  //   if (stack.data[stack.data.length - 1].id === item.id) {
  //     socket.broadcast.to(roomId).emit("DragFromStack", {
  //       item,
  //       stackData: stack.data.slice(0, -1),
  //       player,
  //     });
  //   }
  // });

  socket.on("RollDice", (data) => {
    SH.RollDice({
      data,
      socket,
    });
  });

  socket.on("DealItem", (data) => {
    SH.addEventToQueue({
      type: "DealItem",
      data,
      socket,
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "a user disconnected");
    // io.sockets.emit('user disconnected');
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000");
});
// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid // not yourselves
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// // list socketid
// for (var socketid in io.sockets.sockets) {}
//  OR
// Object.keys(io.sockets.sockets).forEach((socketid) => {});
