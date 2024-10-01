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

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  socket.on("CreateRoom", ({ name }) => {
    const roomId: string = nanoid(5);
    console.log("on create room:", name, roomId);
    socket.join(roomId);
    socket.emit("roomId", {
      roomId,
      name,
      socketId: socket.id,
      roomLeader: true,
    });
  });

  socket.on("JoinRoom", async ({ name, roomId }) => {
    const listOfRooms = io.of("/").adapter.rooms;
    if (!listOfRooms.get(roomId)) {
      socket.emit("error", { message: "wrong room" });
      return;
    }

    // i join room
    await socket.join(roomId);
    socket.emit("roomId", { roomId, socketId: socket.id, name });

    // const clients = io.sockets.adapter.rooms.get(roomId);
    // console.log("i am all Socket:", clients);

    // let everyone know I join
    socket.broadcast
      .to(roomId)
      .emit("SomeOneJoin", { name, socketId: socket.id });

    // console.log("i am a:", a);
  });

  // sent list of current players
  socket.on("CurrentPlayers", ({ players, to }) => {
    socket.to(to).emit("CurrentPlayers", { players });
  });

  // let other know the roomLeader has started the game
  socket.on("StartGame", ({ roomId, players }) => {
    socket.broadcast.to(roomId).emit("StartGame", { roomId, players });
  });

  socket.on("DropOnBoard", ({ item, roomId, boardItem }) => {
    // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });\
    console.log("i am roomId:", roomId);
    io.in(roomId).emit("DropOnBoard", { item, roomId, boardItem });
  });

  socket.on("DropOnHand", ({ item, roomId, boardItem }) => {
    // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });\
    console.log("i am roomId:", roomId);
    io.in(roomId).emit("DropOnHand", { item, roomId, boardItem });
  });

  socket.on("OnBoardDrag", ({ item, roomId, boardItem }) => {
    // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });\
    console.log("i am item:", item.top, item.left);
    socket.broadcast
      .to(roomId)
      .emit("OnBoardDrag", { item, roomId, boardItem });
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
