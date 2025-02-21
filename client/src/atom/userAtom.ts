import { atom, useAtom } from "jotai";
import {
    Player,
    Room,
} from "../../../server/src/interfaces/gameStateInterface";

export const userAtom = atom<Player>();

export function useUser() {
    const [user, setUser] = useAtom(userAtom);
    return { user, setUser };
}

export const gameStateAtom = atom<Room>();

export function useGameState() {
    const [gameStates, setGameStates] = useAtom(gameStateAtom);
    return { gameStates, setGameStates };
}

export const boardScaleAtom = atom<number>(1);

export function useBoardScale() {
    const [boardScale, setBoardScale] = useAtom(boardScaleAtom);
    return { boardScale, setBoardScale };
}

export const itemAction = atom<boolean>(false);

export function useItemAction() {
    const [isItemAction, setIsItemAction] = useAtom(itemAction);
    return { isItemAction, setIsItemAction };
}
