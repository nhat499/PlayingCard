import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces/socketInterface";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import nanoid from 'nanoid-esm';


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
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("CreateRoom", ({ name }) => {
        const roomId: string = nanoid(5);
        console.log("on create room:", name, roomId);
        socket.join(roomId);
        socket.emit("roomId", { roomId });
    })

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
    })
})


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});