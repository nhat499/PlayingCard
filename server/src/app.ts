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
import { gameObj, GameStates, Player } from "./interfaces/gameStateInterface";
import regularDeck from "./presetGame/regularDeck";
import {
  flipAll,
  removeFromBoard,
  removeFromHand,
  removeFromStack,
  shuffle,
} from "./stateFunction";
import path from "path";
import dotenv from "dotenv"
dotenv.config();
// const express = require('express');
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
const app = express();
const server = http.createServer(app);

app.use(cors(
  // { origin: "*" }
  { origin: ["http://localhost:3000", process.env.ORIGIN] }
));

// // Serve static files from the React app
app.use(express.static(path.join(__dirname, './../../client/dist')));
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  // cors: { origin: ["http://localhost:5173"] },
  // cors: { origin: "*" }
  // cors: { origin: ["https://3270-71-231-24-229.ngrok-free.app", "https://myapp.loca.lt", "http://localhost:3000"] },
  cors: { origin: ["http://localhost:5173", "http://localhost:3000", process.env.ORIGIN] },
  // path: "/api/socket.io", // Match client path here
  transports: ["websocket", "polling"]
});

const gameStates: GameStates = {};

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  socket.on("CreateRoom", ({ name }) => {
    const roomId: string = nanoid(5);
    console.log("on create room:", name, roomId);
    socket.join(roomId);
    const playerOne: Player = {
      hand: {},
      name,
      roomId: roomId,
      socketId: socket.id,
      roomLeader: true,
    };

    gameStates[roomId] = {
      board: { [`${regularDeck.id}`]: regularDeck },
      players: [playerOne],
      setting: {
        window: {
          width: 1300,
          height: 700,
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

    // const clients = io.sockets.adapter.rooms.get(roomId);
    // console.log("i am all Socket:", clients);

    // let everyone know I join
    socket.broadcast.to(roomId).emit("SomeOneJoin", gameStates[roomId].players);
  });

  // let other know the roomLeader has started the game
  socket.on("StartGame", ({ roomId, boardState, setting }) => {
    // socket.broadcast.to(roomId).emit("StartGame", { roomId, players, boardData });
    gameStates[roomId].board = boardState;
    if (setting) {
      gameStates[roomId].setting = setting;
    }

    io.in(roomId).emit("StartGame", { roomId, gameState: gameStates[roomId] });
  });

  socket.on("DropOnBoard", ({ item, player }) => {
    const roomId = player.roomId;
    const itemParent = gameStates[roomId].board[item.parent];
    if (item.parent.startsWith(gameObj.STACK) && "data" in itemParent) {
      // remove from stack
      if (!removeFromStack({ gameStates, item, roomId })) return;
      // io.in(roomId).emit("RemoveFromStack", { player, stack: itemParent })
    } else if (!("data" in item) && item.parent.startsWith(gameObj.HAND)) {
      // remove from hand
      removeFromHand({ gameStates, item, player, roomId });
      socket.emit("RemoveFromHand", { item });
    }

    // here
    // add to board
    item.parent = gameObj.BOARD;
    gameStates[roomId].board[item.id] = item;

    io.in(roomId).emit("BoardUpdate", {
      board: gameStates[roomId].board,
      item,
      player,
      message: `Drop ${item.name} on Board`,
    });
    if ("data" in item) {
      io.in(roomId).emit("Message", {
        player,
        message: `Drop ${item.name} on Board`,
      });
    } else {
      io.in(roomId).emit("Message", {
        player,
        message: `Drop ${item.isHidden ? "hidden" : item.name} on Board`,
      });
    }
  });

  socket.on("DropOnHand", ({ item, player }) => {
    const roomId = player.roomId;
    if ("data" in item) {
      // item is a stack, do nothing;
      return;
    }

    if (item.parent === gameObj.BOARD) {
      // remove from board
      if (!removeFromBoard({ gameStates, item, roomId })) return;
    } else if (item.parent.startsWith(gameObj.STACK)) {
      // remove from stacks
      if (!removeFromStack({ gameStates, item, roomId })) return;
    }

    item.parent = gameObj.HAND;
    item.top = 0;
    item.left = 0;
    const players = gameStates[roomId].players;
    const index = players.findIndex(
      (curr) => curr.socketId === player.socketId
    );
    players[index].hand[item.id] = item;

    // update board state for every in room
    io.in(roomId).emit("BoardUpdate", {
      board: gameStates[roomId].board,
      item: item,
      player,
      message: ``,
    });

    // add to sender's hand
    socket.emit("AddToHand", { item, player });

    io.in(roomId).emit("Message", {
      player,
      message: `Add ${item.isHidden ? "hidden" : item.name} to Hand`,
    });
  });

  socket.on("DropOnStack", ({ item, player, stackId }) => {
    // send all in room
    const roomId = player.roomId;

    // removes
    if (item.parent === gameObj.HAND) {
      // remove from hand
      removeFromHand({ gameStates, item, player, roomId });
      socket.emit("RemoveFromHand", { item });
    } else if (item.parent === gameObj.BOARD) {
      // remove from board
      if (!removeFromBoard({ gameStates, item, roomId })) return;
    } else {
      // from another stack
      return;
    }

    // add to stack
    const stack = gameStates[roomId].board[stackId];
    if (stack && "data" in stack) {
      item.parent = stack.id;
      stack.data.push(item);
    }

    io.in(roomId).emit("BoardUpdate", {
      board: gameStates[roomId].board,
      item,
      player,
      message: ``,
    });

    // io.in(roomId).emit("Message", {
    //   player,
    //   message: `Drop ${item.name} on Stack ${stackId}`,
    // });
  });

  socket.on("SendMessage", ({ player, message }) => {
    const roomId = player.roomId;
    io.in(roomId).emit("Message", { player, message });
  });

  socket.on("FlipCard", ({ player, item }) => {
    const roomId = player.roomId;
    if (item.parent === gameObj.BOARD) {
      item.isHidden = !item.isHidden;
      gameStates[roomId].board[item.id] = item;

      io.in(roomId).emit("FlipCard", {
        player,
        board: gameStates[roomId].board,
      });

      io.in(roomId).emit("Message", { player, message: "flip card" });
    }
  });

  socket.on("LockCard", ({ player, item }) => {
    const roomId = player.roomId;
    if (item.parent === gameObj.BOARD) {

      item.disabled = !item.disabled;
      gameStates[roomId].board[item.id] = item;

      io.in(roomId).emit("LockCard", {
        player,
        board: gameStates[roomId].board,
      });

      io.in(roomId).emit("Message", { player, message: "lock card" });
    }
  });

  socket.on("ShuffleStack", ({ player, stack }) => {
    const roomId = player.roomId;

    const gameStack = gameStates[roomId].board[stack.id];
    if ("data" in gameStack) {
      shuffle(gameStack.data);
    } else {
      return;
    }

    io.in(roomId).emit("ShuffleStack", {
      player,
      board: gameStates[roomId].board,
    });
    io.emit("Message", { player, message: "shuffle stack" });
  });

  socket.on("FlipStack", ({ player, stack }) => {
    const roomId = player.roomId;
    const gameStack = gameStates[roomId].board[stack.id];
    if ("data" in gameStack) {
      flipAll(gameStack.data, !gameStack.data[0].isHidden);
    } else {
      return;
    }

    io.in(roomId).emit("FlipStack", {
      player,
      board: gameStates[roomId].board,
    });

    io.emit("Message", { player, message: "flip stack" });
  });

  // // test another aciton while i am dragging
  // let update = false;

  socket.on("OnBoardDrag", ({ item, player }) => {
    // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });
    const roomId = player.roomId;
    socket.broadcast
      .to(roomId)
      .emit("OnBoardDrag", { item, player });

    // test another aciton while i am dragging
    // if (!update) {
    //   update = true;
    //   setTimeout(() => {
    //     console.log("board updates");
    //     io.in(roomId).emit("BoardUpdate", {
    //       board: gameStates[roomId].board,
    //       item,
    //       player,
    //       message: `Drop ${item.name} on Board`,
    //     });

    //   }, 5000)
    // }
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

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// // list socketid
// for (var socketid in io.sockets.sockets) {}
//  OR
// Object.keys(io.sockets.sockets).forEach((socketid) => {});
