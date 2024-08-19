export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    roomId: ({ roomId }: { roomId: string }) => void;
    error: ({ message }: { message: string }) => void;
}

export interface ClientToServerEvents {
    JoinRoom: ({ name, roomId }: { name: string, roomId }) => void;
    CreateRoom: ({ name }: { name: string }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}