"use strict";
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
        origin: "http://localhost:5173"
    }
});
io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
    socket.on("CreateRoom", ({ name }) => {
        const roomId = (0, nanoid_esm_1.default)(5);
        console.log("on create room:", name, roomId);
        socket.join(roomId);
        socket.emit("roomId", { roomId });
    });
    socket.on("JoinRoom", ({ name, roomId }) => {
        const listOfRooms = io.of("/").adapter.rooms;
        console.log("i am listof room:", listOfRooms);
        console.log("room", listOfRooms.get(roomId));
        if (!listOfRooms.get(roomId)) {
            socket.emit("error", { message: "wrong room" });
            return;
        }
        socket.emit("roomId", { roomId });
        // console.log("i am a:", a);
    });
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
//# sourceMappingURL=app.js.map