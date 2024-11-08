export type GameStates = { [key: string]: Room };

export enum gameObj {
    BOARD = "BOARD",
    ITEM = "ITEM",
    HAND = "HAND",
    STACK = "STACK"
}

export type Setting = {
    window: { width: number, height: number }
}

export type Room = {
    players: Player[];
    board: { [key: string]: Item | Stack };
    setting: Setting;
}

export type Stack = DragItem & {
    data: Item[];
    width: number;
    height: number
}

export type Item = DragItem & {
    color: string;
    width: number;
    height: number;
    isHidden: boolean;
    sides: number;
}

export type DragItem = {
    id: string;
    name: string;
    zIndex: number;
    top: number;
    left: number;
    rotate: number;
    disabled: boolean;
    parent: string;
    transform?: string;
}

export type Player = {
    socketId?: string;
    roomId: string;
    name: string;
    roomLeader: boolean,
    hand: { [key: string]: Item }
}