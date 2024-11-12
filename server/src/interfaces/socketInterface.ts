import { Item, Player, Room, Stack } from "./gameStateInterface";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  JoinRoom: (player: Player, gameState: Room) => void;
  error: ({ message }: { message: string }) => void;

  // put myself in room
  // let other people in room knows i Join
  SomeOneJoin: (player: Player[]) => void;

  // server let non roomleader knows to start the game
  StartGame: ({
    roomId,
    gameState,
  }: {
    roomId: string;
    gameState: Room;
  }) => void;

  // let all(including myself) board has been changed
  BoardUpdate: ({
    board,
    item,
    player,
    message,
  }: EveryOneMoveItemAction) => void;

  AddToHand: ({ item, player }: { item: Item; player: Player }) => void;

  Message: ({ message, player }: { message: string; player: Player }) => void;

  RemoveFromHand: ({ item }: { item: Item }) => void;

  // let other know i am dragging
  OnBoardDrag: ({ item, player }: { item: Item | Stack, player: Player }) => void;

  // let other know I add to a stack
  AddToStack: ({ item, roomId, stackId }: MoveItem) => void;

  // let other know i shuffle stack
  ShuffleStack: ({
    player,
    board,
  }: {
    player: Player;
    board: Room["board"];
  }) => void;

  // let other know i flip stack
  FlipStack: ({
    player,
    board,
  }: {
    player: Player;
    board: Room["board"];
  }) => void;

  // let other know i flip a Card
  FlipCard: ({
    player,
    board,
  }: {
    player: Player;
    board: Room["board"];
  }) => void;

  LockCard: ({
    player,
    board,
  }: {
    player: Player;
    board: Room["board"];
  }) => void;
}

export interface ClientToServerEvents {
  JoinRoom: (player: Player) => void;

  // create, join room and send room, name of the player,
  CreateRoom: ({ name }: { name: string }) => void;

  // room leader let room know the game has started
  StartGame: ({
    roomId,
    boardState,
    setting,
  }: {
    roomId: string;
    boardState: Room["board"];
    setting: Room["setting"];
  }) => void;

  // a user drop a item on the board
  DropOnBoard: ({ item, player }: MoveItemAction) => void;

  // a user took a card
  DropOnHand: ({ item, player }: MoveItemAction) => void;

  // a user drop an item on a stack
  DropOnStack: ({ item, player, stackId }: MoveItemOnStack) => void;

  // a user is dragging
  OnBoardDrag: ({ item, player }: { item: Item | Stack, player: Player }) => void;

  SendMessage: ({
    message,
    player,
  }: {
    message: string;
    player: Player;
  }) => void;

  //////////NOT YET WORK ON/////////

  // a user shuffle a stack
  ShuffleStack: ({ player, stack }: { player: Player; stack: Stack }) => void;

  // a user flip a stack
  FlipStack: ({ player, stack }: { player: Player; stack: Stack }) => void;

  // a user flip a Card
  FlipCard: ({ player, item }: { player: Player; item: Item }) => void;

  LockCard: ({ player, item }: { player: Player; item: Item }) => void;
}

export type MoveItemAction = {
  item: Item | Stack;
  player: Player;
};

export type MoveItemOnStack = {
  item: Item;
  player: Player;
  stackId: string;
};

// socket Actions
export type EveryOneMoveItemAction = {
  item: Item | Stack;
  board: Room["board"];
  player: Player;
  message: string;
};

export interface MoveItem {
  item: IDragDropItem["item"];
  roomId: string;
  stackId: string;
}

export interface IDragDropItem {
  item: {
    id: string;
    name: string;
    data: IDragDropItem["item"];
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

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
