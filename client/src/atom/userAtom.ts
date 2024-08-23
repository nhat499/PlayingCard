import { atom, useAtom } from "jotai";

export interface Iuser {
    name: string;
    socketId: string;
    roomLeader?: boolean;
}

export const userAtom = atom<Iuser | undefined>();

export default function useUser() {
    const [user, setUser] = useAtom(userAtom);

    return { user, setUser };
}
