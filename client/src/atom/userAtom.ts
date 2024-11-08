import { atom, useAtom } from "jotai";
import { GameStates, Player, Room } from "../../../server/src/interfaces/gameStateInterface";
// export interface Iuser {
//     name: string;
//     socketId: string;
//     roomLeader?: boolean;
// }

export const userAtom = atom<Player | undefined>();

export function useUser() {
    const [user, setUser] = useAtom(userAtom);
    return { user, setUser };
}


export const gameStateAtom = atom<Room>();

export function useGameState() {
    const [gameStates, setGameStates] = useAtom(gameStateAtom);
    return { gameStates, setGameStates };
}