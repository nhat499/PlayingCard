import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from "../../../server/src/interfaces/socketInterface"
// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3000';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
    autoConnect: false
});