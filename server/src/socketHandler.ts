import { Server, Socket } from "socket.io";
import { GameStates } from "./interfaces/gameStateInterface"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces/socketInterface";

class SocketHandler {
    gameStates: GameStates;
    io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    constructor(gameStatesObject: GameStates) {
        this.gameStates = gameStatesObject;
    }

    JoinRoom: ServerToClientEvents["JoinRoom"] = ({ }) => { };
    error: ServerToClientEvents["error"] = () => { };
    SomeOneJoin: ServerToClientEvents["SomeOneJoin"] = () => { };
    StartGame: ServerToClientEvents["StartGame"] = () => { };
    BoardUpdate: ServerToClientEvents["BoardUpdate"] = () => { };
    AddToHand: ServerToClientEvents["AddToHand"] = () => { };
    Message: ServerToClientEvents["Message"] = () => { };
    RemoveFromHand: ServerToClientEvents["RemoveFromHand"] = () => { };
    OnBoardDrag: ServerToClientEvents["OnBoardDrag"] = () => { };
    AddToStack: ServerToClientEvents["AddToStack"] = () => { };
    ShuffleStack: ServerToClientEvents["ShuffleStack"] = () => { };
    FlipStack: ServerToClientEvents["FlipStack"] = () => { };
    FlipCard: ServerToClientEvents["FlipCard"] = () => { };
    LockCard: ServerToClientEvents["LockCard"] = () => { };
    ReceiveItem: ServerToClientEvents["ReceiveItem"] = () => { };
}

export default SocketHandler;