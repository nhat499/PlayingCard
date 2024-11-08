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

// const express = require('express');
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:5173",
  },
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
      roomLeader: true
    }

    gameStates[roomId] = {
      board: { [`${regularDeck.id}`]: regularDeck },
      players: [playerOne],
      setting: {
        window: {
          width: 1300,
          height: 800,
        },
      },
    }
    socket.emit("JoinRoom", playerOne, gameStates[roomId]);
  });

  socket.on("JoinRoom", async ({ hand, name, roomId, roomLeader }) => {
    if (!gameStates[roomId]) {
      socket.emit("error", { message: "wrong room" });
      return;
    }
    const player: Player = {
      hand: {},
      name,
      roomId,
      roomLeader: false
    }
    gameStates[roomId].players.push(player);
    // i join room
    await socket.join(roomId);
    socket.emit("JoinRoom", player, gameStates[roomId]);

    // const clients = io.sockets.adapter.rooms.get(roomId);
    // console.log("i am all Socket:", clients);

    // let everyone know I join
    socket.broadcast
      .to(roomId)
      .emit("SomeOneJoin", gameStates[roomId].players);
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

  socket.on("DropOnBoard", ({ item, roomId, boardItem }) => {
    // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });\
    console.log("dropping on board");
    io.in(roomId).emit("DropOnBoard", { item, roomId, boardItem });
  });

  socket.on("DropFromBoard", ({ item, roomId, boardItem }) => {
    // send all in room
    io.in(roomId).emit("DropFromBoard", { item, roomId, boardItem });
  });

  socket.on("OnBoardDrag", ({ item, roomId, boardItem }) => {
    // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });
    socket.broadcast
      .to(roomId)
      .emit("OnBoardDrag", { item, roomId, boardItem });
  });

  socket.on("AddToStack", ({ item, roomId, stackId }) => {
    // send all in room
    io.in(roomId).emit("AddToStack", { item, roomId, stackId });
  });

  socket.on("DropFromStack", ({ item, roomId, stackId }) => {
    // send all in room
    io.in(roomId).emit("DropFromStack", { item, roomId, stackId });
  });

  socket.on("ShuffleStack", ({ roomId, stackId, stackData }) => {
    io.in(roomId).emit("ShuffleStack", { roomId, stackId, stackData });
  });

  socket.on("FlipStack", ({ roomId, stackId, stackData }) => {
    io.in(roomId).emit("FlipStack", { roomId, stackId, stackData });
  });

  socket.on("FlipCard", ({ roomId, itemId, value }) => {
    io.in(roomId).emit("FlipCard", { roomId, itemId, value });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
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
