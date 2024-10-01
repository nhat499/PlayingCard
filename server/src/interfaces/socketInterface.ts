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

  // let all(including myself) know drop a card on the board
  DropOnBoard: ({ item, roomId, boardItem }: IDragDropItem) => void;

  // let all(include myself) people know I took an item on the board
  DropOnHand: ({ item, roomId, boardItem }: IDragDropItem) => void;

  // let other know i am dragging
  OnBoardDrag: ({ item, roomId, boardItem }: IDragDropItem) => void;
}

export interface ClientToServerEvents {
  JoinRoom: ({ name, roomId }: { name: string; roomId }) => void;

  // create, join room and send room, name of the player,
  CreateRoom: ({ name }: { name: string }) => void;
  // send list of players in the room
  CurrentPlayers: ({ players, to }) => void;

  // room leader let room know the game has started
  StartGame: ({ roomId, players }) => void;

  // a user drop a item on the board
  DropOnBoard: ({ item, roomId }: IDragDropItem) => void;

  // a user took an item
  DropOnHand: ({ item, roomId, boardItem }: IDragDropItem) => void;

  // a user is dragging
  OnBoardDrag: ({ item, roomId, boardItem }: IDragDropItem) => void;
}

export interface IDragDropItem {
  item: {
    id: string;
    name: string;
    zIndex: number;
    top: number;
    left: number;
    width: number;
    height: number;
    disabled: boolean;
    isHidden: boolean;
  };
  boardItem: { [key: string]: IDragDropItem["item"] };
  roomId: string;
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
