import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const SocketTest = () => {
    socket.connect();

    const sendMessage = () => {

    }

    return <div>
        <button>ok</button>
        <input></input>
    </div>
}

export default SocketTest;