const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});
io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
//# sourceMappingURL=app.js.map