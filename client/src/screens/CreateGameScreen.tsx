import { useEffect, useState } from "react";
import DefaultScreen from "../components/DefaultScreen";
import Setting, { SettingProps } from "../components/Setting";
import { socket } from "../socket/Socket";
import useUser, { Iuser } from "../atom/userAtom";
import PlayerIcon from "../components/PlayerIcon";
import { useNavigate, useParams } from "react-router-dom";

const defaultOne: SettingProps["itemData"] = {
    cards: [
        {
            id: "1",
            name: "card1",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        },
        {
            id: "2",
            name: "card2",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        },
        {
            id: "3",
            name: "card3",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        },
        {
            id: "4",
            name: "card4",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        },
    ],
};

const CreateGameScreen = () => {
    const { user } = useUser();
    if (!user) throw Error("User Not Found");
    const [players, setPlayers] = useState<Iuser[]>([user]);
    const navigate = useNavigate();
    const { roomId } = useParams();

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
        socket.on("StartGame", ({ roomId, players }) => {
            navigate("/game/" + roomId);
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
                    itemData={defaultOne}
                    startGame={() => {
                        if (!user.roomLeader) return;

                        socket.emit("StartGame", { roomId, players });

                        navigate("/game/" + roomId);
                    }}
                />
            </div>
        </DefaultScreen>
    );
};

export default CreateGameScreen;
