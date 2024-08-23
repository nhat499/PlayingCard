export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  roomId: ({ roomId, name, socketId, roomLeader }: IUser) => void;
  error: ({ message }: { message: string }) => void;

  // put myself in room
  // let other people in room knows i Join
  SomeOneJoin: ({ name, socketId }: { name: string; socketId: string }) => void;

  // send current players
  CurrentPlayers: ({ players }: { players: IUser[] }) => void;

  // server let non roomleader knows to start the game
  StartGame: ({ roomId, players }) => void;
}

export interface ClientToServerEvents {
  JoinRoom: ({ name, roomId }: { name: string; roomId }) => void;

  // create, join room and send room, name of the player,
  CreateRoom: ({ name }: { name: string }) => void;
  // send list of players in the room
  CurrentPlayers: ({ players, to }) => void;

  // room leader let room know the game has started
  StartGame: ({ roomId, players }) => void;
}

export interface IUser {
  roomId: string;
  name;
  socketId;
  roomLeader?: boolean;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
