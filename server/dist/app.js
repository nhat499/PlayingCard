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
const regularDeck_1 = __importDefault(require("./presetGame/regularDeck"));
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
const gameStates = {};
io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
    socket.on("CreateRoom", ({ name }) => {
        const roomId = (0, nanoid_esm_1.default)(5);
        console.log("on create room:", name, roomId);
        socket.join(roomId);
        const playerOne = {
            hand: {},
            name,
            roomId: roomId,
            socketId: socket.id,
            roomLeader: true
        };
        gameStates[roomId] = {
            board: { [`${regularDeck_1.default.id}`]: regularDeck_1.default },
            players: [playerOne],
            setting: {
                window: {
                    width: 1300,
                    height: 800,
                },
            },
        };
        socket.emit("JoinRoom", playerOne, gameStates[roomId]);
    });
    socket.on("JoinRoom", (_a) => __awaiter(void 0, [_a], void 0, function* ({ hand, name, roomId, roomLeader }) {
        if (!gameStates[roomId]) {
            socket.emit("error", { message: "wrong room" });
            return;
        }
        const player = {
            hand: {},
            name,
            roomId,
            roomLeader: false
        };
        gameStates[roomId].players.push(player);
        // i join room
        yield socket.join(roomId);
        socket.emit("JoinRoom", player, gameStates[roomId]);
        // const clients = io.sockets.adapter.rooms.get(roomId);
        // console.log("i am all Socket:", clients);
        // let everyone know I join
        socket.broadcast
            .to(roomId)
            .emit("SomeOneJoin", gameStates[roomId].players);
    }));
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
//# sourceMappingURL=app.js.map