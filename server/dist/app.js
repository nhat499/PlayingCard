"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const nanoid_esm_1 = __importDefault(require("nanoid-esm"));
// const express = require('express');
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
    socket.on("CreateRoom", ({ name }) => {
        const roomId = (0, nanoid_esm_1.default)(5);
        console.log("on create room:", name, roomId);
        socket.join(roomId);
        socket.emit("roomId", {
            roomId,
            name,
            socketId: socket.id,
            roomLeader: true,
        });
    });
    socket.on("JoinRoom", (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, roomId }) {
        const listOfRooms = io.of("/").adapter.rooms;
        if (!listOfRooms.get(roomId)) {
            socket.emit("error", { message: "wrong room" });
            return;
        }
        // i join room
        yield socket.join(roomId);
        socket.emit("roomId", { roomId, socketId: socket.id, name });
        // const clients = io.sockets.adapter.rooms.get(roomId);
        // console.log("i am all Socket:", clients);
        // let everyone know I join
        socket.broadcast
            .to(roomId)
            .emit("SomeOneJoin", { name, socketId: socket.id });
        // console.log("i am a:", a);
    }));
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
        // io.emit("DropOnBoard", { item, roomId, boardItem });
    });
    socket.on("DropOnHand", ({ item, roomId, boardItem }) => {
        // socket.broadcast.to(roomId).emit("DropOnBoard", { item, roomId });\
        console.log("i am roomId:", roomId);
        io.in(roomId).emit("DropOnHand", { item, roomId, boardItem });
        // io.emit("DropOnBoard", { item, roomId, boardItem });
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
//# sourceMappingURL=app.js.map