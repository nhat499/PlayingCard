import { useEffect, useState } from "react";
import DefaultScreen from "../components/DefaultScreen";
import Setting from "../components/Setting";
import { socket } from "../socket/Socket";
import useUser, { Iuser } from "../atom/userAtom";
import PlayerIcon from "../components/PlayerIcon";
import { useNavigate, useParams } from "react-router-dom";
import { BoardProps } from "../components/Board";
import { BOARD } from "./GameScreen";
import { CardProps } from "../components/Card";

const Suite = ["spade", "club", "diamond", "heart"];

const createRegularDeckObject = () => {
    const object: CardProps["card"][] = [];
    for (let i = 1; i <= 10; i++) {
        for (const s of Suite) {
            const card: CardProps["card"] = {
                sides: 4,
                rotate: 0,
                color: "white",
                id: `card${i}${s}`,
                name: `${i} ${s}`,
                parent: "stack1",
                zIndex: 1,
                width: 40,
                height: 55,
                top: 0,
                left: 0,
                disabled: false,
                isHidden: false,
            };
            object.push(card);
        }
    }
    for (const s of Suite) {
        const card: CardProps["card"] = {
            sides: 4,
            rotate: 0,
            color: "white",
            id: `card${"jack"}${s}`,
            name: `${"jack"} ${s}`,
            parent: "stack1",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        };
        object.push(card);
    }
    for (const s of Suite) {
        const card: CardProps["card"] = {
            sides: 4,
            rotate: 0,
            color: "white",
            id: `card${"queen"}${s}`,
            name: `${"queen"} ${s}`,
            parent: "stack1",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        };
        object.push(card);
    }
    for (const s of Suite) {
        const card: CardProps["card"] = {
            sides: 4,
            rotate: 0,
            color: "white",
            id: `card${"king"}${s}`,
            name: `${"king"} ${s}`,
            parent: "stack1",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        };
        object.push(card);
    }

    return object;
};

type ISetting = {
    [BOARD]: BoardProps["items"];
    window: {
        width: number;
        height: number;
    };
};

const setting: ISetting = {
    [BOARD]: {
        stack1: {
            id: "stack1",
            name: "stack1",
            parent: BOARD,
            data: [...createRegularDeckObject()],
            rotate: 0,
            zIndex: 1,
            width: 50,
            height: 70,
            top: 50,
            left: 50,
            disabled: false,
            isHidden: false,
        },
    },
    window: {
        width: 1300,
        height: 700,
    },
};

const CreateGameScreen = () => {
    const { user } = useUser();
    if (!user) throw Error("User Not Found");
    const [players, setPlayers] = useState<Iuser[]>([user]);
    const navigate = useNavigate();
    const { roomId } = useParams();

    const [settingValue, setSettingValue] = useState<string>(
        JSON.stringify(setting, undefined, 2)
    );

    useEffect(() => {
        socket.on("SomeOneJoin", ({ name, socketId }) => {
            socket.emit("SomeOneJoin2", players);
            const newPlayers: Iuser[] = [...players, { name, socketId }];
            setPlayers(newPlayers);
            // let new player know who is in the room
            if (user.roomLeader) {
                socket.emit("CurrentPlayers", {
                    players: newPlayers,
                    to: socketId,
                });
            }
        });

        // get previous players
        socket.on("CurrentPlayers", ({ players }) => {
            setPlayers(players);
        });

        // start game
        socket.on("StartGame", ({ roomId, players, setting }) => {
            navigate("/game/" + roomId, { state: setting });
        });

        // socket.emit()
    }, [navigate, players, user.roomLeader]);

    return (
        <DefaultScreen>
            <div
                style={{
                    display: "flex",
                    gap: "30px",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "5px",
                    }}
                >
                    {players.map((player) => (
                        <PlayerIcon
                            key={player.socketId}
                            name={player.name}
                            socketId={player.socketId}
                        />
                    ))}
                </div>
                <Setting
                    settingValue={settingValue}
                    setSettingValue={setSettingValue}
                    startGame={() => {
                        if (!user.roomLeader) return;

                        socket.emit("StartGame", {
                            roomId,
                            players,
                            setting: JSON.parse(settingValue),
                        });

                        navigate("/game/" + roomId);
                    }}
                />
            </div>
        </DefaultScreen>
    );
};

export default CreateGameScreen;
