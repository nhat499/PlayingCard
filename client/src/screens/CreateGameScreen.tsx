import { useEffect, useState } from "react";
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

        socket.on("LoadPresetBoard", ({ board }) => {
            setBoardStateValue(
                JSON.stringify(board, undefined, 4)
            );
        })

        // start game
        socket.on("StartGame", ({ roomId, gameState }) => {
            setGameStates(gameState);
            navigate("/game/" + roomId);
        });

        // socket.emit()
        return () => {
            socket.off("SomeOneJoin");
            socket.off("StartGame");
            socket.off("LoadPresetBoard");
        };
    });

    useEffect(() => {
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("user", JSON.stringify(user));
    }, [roomId, user]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "20px",
            }}
        >

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
            }}>
                <button onClick={() => {
                    socket.emit("LoadPresetBoard", { number: 0, player: user })
                }}>regular</button>

                <button onClick={() => {
                    socket.emit("LoadPresetBoard", { number: 1, player: user })
                }}>catan</button>

            </div>

            <div style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                gridTemplateColumns: "4fr 1fr",

                gap: "20px",
            }}>
                <Configuration
                    players={gameStates.players}
                    settingValue={settingValue}
                    setSettingValue={setSettingValue}
                    boardState={boardStateValue}
                    setBoardState={setBoardStateValue}
                    isRoomLeader={user.roomLeader}
                    startGame={() => {
                        if (!user.roomLeader) return;
                        const setting: Room["setting"] = JSON.parse(settingValue);
                        const boardState: Room["board"] =
                            JSON.parse(boardStateValue);
                        socket.emit("StartGame", {
                            roomId,
                            boardState: boardState,
                            setting: setting,
                        });
                    }}
                />
                {/* <PlayerIconList players={gameStates.players} /> */}
            </div>
        </div>
    );
};

export default CreateGameScreen;
