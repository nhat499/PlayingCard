import { Server, Socket } from "socket.io";
import { gameObj, GameStates, Player } from "./interfaces/gameStateInterface"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces/socketInterface";
import { flipAll, removeFromBoard, removeFromHand, removeFromStack, shuffle } from "./stateFunction";

type HandlerParams<T extends keyof ClientToServerEvents> = {
    data: Parameters<ClientToServerEvents[T]>[0];
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    callback?: () => void;
};

type QueueEvent<T extends keyof ClientToServerEvents = keyof ClientToServerEvents> = {
    type: T; // Specific type
    data: Parameters<ClientToServerEvents[T]>[0]; // Data corresponding to the type
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    callback?: () => void; // Optional callback
};


class SocketHandler {
    gameStates: GameStates;
    // POTENTIALLY UPDATE TO USE LINKLIST FOR constant pop()
    eventQueue: QueueEvent[];
    isProcessing: boolean;
    io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

    constructor(
        gameStatesObject: GameStates,
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {

        this.gameStates = gameStatesObject;
        this.eventQueue = [];
        this.isProcessing = false;
        this.io = io;
    }


    addEventToQueue = ({ type, data, socket }: QueueEvent) => {
        this.eventQueue.push({
            socket,
            type,
            data,
            callback: () => {
                this.isProcessing = false;
                this.processQueue();
            }
        });

        this.processQueue();
    };


    processQueue() {
        if (this.isProcessing || this.eventQueue.length === 0) return;

        this.isProcessing = true;
        const event = this.eventQueue.shift();

        // Handle each event type here
        switch (event.type) {
            // CreateRoom
            // JoinRoom
            // StartGame
            case "DropOnBoard":
                console.log("i am event", event.data);
                this.DropOnBoard({
                    data: event.data as QueueEvent<"DropOnBoard">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            case "DropOnHand":
                this.DropOnHand({
                    data: event.data as QueueEvent<"DropOnHand">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            case "DropOnStack":
                this.DropOnStack({
                    data: event.data as QueueEvent<"DropOnStack">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            case "SendMessage":
                this.SendMessage({
                    data: event.data as QueueEvent<"SendMessage">["data"],
                    callback: event.callback,
                    socket: event.socket
                });
                break;
            case "FlipCard":
                this.FlipCard({
                    data: event.data as QueueEvent<"FlipCard">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            case "LockCard":
                this.LockCard({
                    data: event.data as QueueEvent<"LockCard">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            case "ShuffleStack":
                this.ShuffleStack({
                    data: event.data as QueueEvent<"ShuffleStack">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            case "DealItem":
                this.DealItem({
                    data: event.data as QueueEvent<"DealItem">["data"],
                    socket: event.socket,
                    callback: event.callback,
                });
                break;
            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }
    }

    JoinRoom = ({ data, socket, callback }: HandlerParams<"JoinRoom">) => { };
    CreateRoom = ({ data, socket, callback }: HandlerParams<"CreateRoom">) => { };
    StartGame = ({ data, socket, callback }: HandlerParams<"StartGame">) => { };
    OnBoardDrag = ({ data, socket, callback }: HandlerParams<"OnBoardDrag">) => {
        const { } = data;

        if (callback) callback();
    };


    DropOnBoard = ({ data, socket, callback }: HandlerParams<"DropOnBoard">) => {
        const { item, player } = data;
        const roomId = player.roomId;
        const itemParent = this.gameStates[roomId].board[item.parent];
        if (item.parent.startsWith(gameObj.STACK) && "data" in itemParent) {
            // remove from stack
            if (!removeFromStack({ gameStates: this.gameStates, item, roomId })) return;
            // io.in(roomId).emit("RemoveFromStack", { player, stack: itemParent })
        } else if (!("data" in item) && item.parent.startsWith(gameObj.HAND)) {
            // remove from hand
            removeFromHand({ gameStates: this.gameStates, item, player, roomId });
            socket.emit("RemoveFromHand", { item });
        }

        // here
        // add to board
        item.parent = gameObj.BOARD;
        this.gameStates[roomId].board[item.id] = item;

        this.io.in(roomId).emit("BoardUpdate", {
            board: this.gameStates[roomId].board,
            item,
            player,
            message: `Drop ${item.name} on Board`,
        });
        if ("data" in item) {
            this.io.in(roomId).emit("Message", {
                player,
                message: `Drop ${item.name} on Board`,
            });
        } else {
            this.io.in(roomId).emit("Message", {
                player,
                message: `Drop ${item.isHidden ? "hidden" : item.name} on Board`,
            });
        }
        if (callback) callback();
    };

    DropOnHand = ({ data, socket, callback }: HandlerParams<"DropOnHand">) => {
        const { item, player } = data;
        const roomId = player.roomId;
        if ("data" in item) {
            // item is a stack, do nothing;
            return;
        }

        if (item.parent === gameObj.BOARD) {
            // remove from board
            if (!removeFromBoard({ gameStates: this.gameStates, item, roomId })) return;
        } else if (item.parent.startsWith(gameObj.STACK)) {
            // remove from stacks
            if (!removeFromStack({ gameStates: this.gameStates, item, roomId })) return;
        }

        item.parent = gameObj.HAND;
        item.top = 0;
        item.left = 0;
        const players = this.gameStates[roomId].players;
        const index = players.findIndex(
            (curr) => curr.socketId === player.socketId
        );
        players[index].hand[item.id] = item;

        // update board state for every in room
        this.io.in(roomId).emit("BoardUpdate", {
            board: this.gameStates[roomId].board,
            item: item,
            player,
            message: ``,
        });

        // add to sender's hand
        socket.emit("AddToHand", { item, player });

        this.io.in(roomId).emit("Message", {
            player,
            message: `Add ${item.isHidden ? "hidden" : item.name} to Hand`,
        });
        if (callback) callback();
    };

    DropOnStack = ({ data, socket, callback }: HandlerParams<"DropOnStack">) => {
        const { item, player, stackId } = data;
        // send all in room
        const roomId = player.roomId;

        // removes
        if (item.parent === gameObj.HAND) {
            // remove from hand
            removeFromHand({ gameStates: this.gameStates, item, player, roomId });
            socket.emit("RemoveFromHand", { item });
        } else if (item.parent === gameObj.BOARD) {
            // remove from board
            if (!removeFromBoard({ gameStates: this.gameStates, item, roomId })) return;
        } else {
            // from another stack
            return;
        }

        // add to stack
        const stack = this.gameStates[roomId].board[stackId];
        if (stack && "data" in stack) {
            item.parent = stack.id;
            stack.data.push(item);
        }

        this.io.in(roomId).emit("BoardUpdate", {
            board: this.gameStates[roomId].board,
            item,
            player,
            message: ``,
        });

        this.io.in(roomId).emit("Message", {
            player,
            message: `Drop ${item.name} on Stack ${stack.name}`,
        });
        if (callback) callback();
    };
    SendMessage = ({ data, callback, socket }: HandlerParams<"SendMessage">) => {
        const { player, message } = data;
        const roomId = player.roomId;
        this.io.in(roomId).emit("Message", { player, message });
        if (callback) callback();
    };
    FlipCard = ({ data, socket, callback }: HandlerParams<"FlipCard">) => {
        const { player, item } = data;
        const roomId = player.roomId;
        if (item.parent === gameObj.BOARD) {
            item.isHidden = !item.isHidden;
            this.gameStates[roomId].board[item.id] = item;

            this.io.in(roomId).emit("FlipCard", {
                player,
                board: this.gameStates[roomId].board,
            });

            this.io.in(roomId).emit("Message", { player, message: "flip card" });
        };

        if (callback) callback();
    };
    LockCard = ({ data, socket, callback }: HandlerParams<"LockCard">) => {
        const { player, item } = data;
        const roomId = player.roomId;
        // could make this check out side?
        if (item.parent === gameObj.BOARD) {
            item.disabled = !item.disabled;
            this.gameStates[roomId].board[item.id] = item;

            this.io.in(roomId).emit("LockCard", {
                player,
                board: this.gameStates[roomId].board,
            });

            this.io.in(roomId).emit("Message", { player, message: "lock card" });
        }
        if (callback) callback();
    };
    ShuffleStack = ({ data, socket, callback }: HandlerParams<"ShuffleStack">) => {
        const { player, stack } = data;
        const roomId = player.roomId;

        const gameStack = this.gameStates[roomId].board[stack.id];
        if ("data" in gameStack) {
            shuffle(gameStack.data);
        } else {
            return;
        }

        this.io.in(roomId).emit("ShuffleStack", {
            player,
            board: this.gameStates[roomId].board,
        });
        this.io.emit("Message", { player, message: "shuffle stack" });
        if (callback) callback();
    };
    FlipStack = ({ data, socket, callback }: HandlerParams<"FlipStack">) => {
        const { player, stack } = data;
        const roomId = player.roomId;
        const gameStack = this.gameStates[roomId].board[stack.id];
        if ("data" in gameStack) {
            flipAll(gameStack.data, !gameStack.data[0].isHidden);
        } else {
            return;
        }

        this.io.in(roomId).emit("FlipStack", {
            player,
            board: this.gameStates[roomId].board,
        });

        this.io.emit("Message", { player, message: "flip stack" });
        if (callback) callback();
    };
    DealItem = ({ data, socket, callback }: HandlerParams<"DealItem">) => {
        const { player, stack, amount } = data;
        const roomId = player.roomId;
        const gameStack = this.gameStates[roomId].board[stack.id];

        // if stack is an item, do nothing
        if (!("data" in gameStack)) return;
        // not enough card in stack
        if (gameStack.data.length - amount * this.gameStates[roomId].players.length < 0)
            return;

        for (const currPlayer of this.gameStates[roomId].players) {
            const newItems: Player["hand"] = {};
            for (let i = 0; i < amount; i++) {
                const newItem = gameStack.data.pop();
                newItem.parent = gameObj.HAND;
                newItems[newItem.id] = newItem;
                currPlayer.hand[newItem.id] = newItem;
            }
            // send list of item to player's hand
            this.io.to(currPlayer.socketId).emit("ReceiveItem", { newItems });
        }
        this.io.in(roomId).emit("BoardUpdate", {
            board: this.gameStates[roomId].board,
            item: gameStack,
            message: "",
            player: player,
        });
        socket.broadcast
            .to(roomId)
            .emit("Message", { player, message: `dealt ${amount} item to everyone` });
        if (callback) callback();
    };
}

export default SocketHandler;