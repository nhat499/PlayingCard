import { useEffect, useState } from "react";
import DefaultScreen from "../components/DefaultScreen";
import Configuration from "../components/Configuration";
import { socket } from "../socket/Socket";
import { useGameState, useUser } from "../atom/userAtom";
import { useNavigate, useParams } from "react-router-dom";
import PlayerIconList from "../components/PlayerIconList";
import { Room } from "../../../server/src/interfaces/gameStateInterface";

const CreateGameScreen = () => {
    const { user } = useUser();
    const { roomId } = useParams();
    const { gameStates, setGameStates } = useGameState();
    if (!user || !gameStates || !roomId)
        throw Error("User || Game States Not found");
    const navigate = useNavigate();

    const [settingValue, setSettingValue] = useState<string>(
        JSON.stringify(gameStates.setting, undefined, 4)
    );

    const [boardStateValue, setBoardStateValue] = useState<string>(
        JSON.stringify(gameStates.board, undefined, 4)
    );

    useEffect(() => {
        socket.on("SomeOneJoin", (players) => {
            setGameStates((prevState) => {
                if (!prevState) return prevState;
                else
                    return {
                        ...prevState,
                        players,
                    };
            });
        });

        // start game
        socket.on("StartGame", ({ roomId, gameState }) => {
            setGameStates(gameState);
            navigate("/game/" + roomId, { state: gameState.setting });
        });

        // const storedRoomId = localStorage.getItem("roomId");
        // const localUser = localStorage.getItem("user");
        // const storedUser = localUser && JSON.parse(localUser);
        // if (storedRoomId && storedUser) {
        //     socket.emit("RejoinRoom", { roomId: storedRoomId, user: storedUser });
        // }

        // socket.emit()
        return () => {
            socket.off("SomeOneJoin");
            socket.off("CurrentPlayers");
            socket.off("StartGame");
            // socket.off("RejoinRoom");
        };
    });

    useEffect(() => {
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("user", JSON.stringify(user));
    }, [roomId, user]);

    return (
        <DefaultScreen>
            <div
                style={{
                    display: "flex",
                    gap: "30px",
                }}
            >
                <PlayerIconList players={gameStates.players} />
                <Configuration
                    settingValue={settingValue}
                    setSettingValue={setSettingValue}
                    boardState={boardStateValue}
                    setBoardState={setBoardStateValue}
                    isRoomLeader={user.roomLeader}
                    startGame={() => {
                        if (!user.roomLeader) return;
                        const setting: Room["setting"] =
                            JSON.parse(settingValue);
                        const boardState: Room["board"] =
                            JSON.parse(boardStateValue);
                        socket.emit("StartGame", {
                            roomId,
                            boardState: boardState,
                            setting: setting,
                        });

                        navigate("/game/" + roomId);
                    }}
                />
            </div>
        </DefaultScreen>
    );
};

export default CreateGameScreen;
