import { useEffect, useState } from "react";
import DefaultScreen from "../components/DefaultScreen";
import { socket } from "../socket/Socket";
import { useNavigate } from "react-router-dom";
import { useGameState, useUser } from "../atom/userAtom";
import { Player } from "../../../server/src/interfaces/gameStateInterface";

const SigninScreen = () => {
    const [name, setName] = useState<string>("");

    const { setUser } = useUser();
    const { setGameStates } = useGameState();

    const [roomId, setRoomId] = useState<string>("");
    const navigate = useNavigate();

    const [buttonDisable, setButtonDisable] = useState(false);

    useEffect(() => {
        socket.on(
            "JoinRoom",
            ({ hand, name, roomId, roomLeader, socketId }, gameState) => {
                setUser({ name, socketId, roomLeader, hand, roomId });
                setGameStates(gameState);
                navigate("/room/" + roomId);
            }
        );

        socket.on("error", ({ message }) => {
            console.log("error mesage:", message);
            setButtonDisable(false);
        });

        return () => {
            socket.off("JoinRoom");
            socket.off("error");
        };
    });

    return (
        <DefaultScreen>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    maxWidth: "400px",
                    margin: "0 auto",
                    padding: "40px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
            >
                <input
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ced4da",
                        outline: "none",
                        fontSize: "16px",
                        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                />
                <input
                    value={roomId}
                    placeholder="Room ID"
                    onChange={(e) => setRoomId(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ced4da",
                        outline: "none",
                        fontSize: "16px",
                        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                    }}
                >
                    <button
                        disabled={name === "" || buttonDisable}
                        onClick={() => {
                            socket.connect();
                            socket.emit("CreateRoom", { name });
                            setButtonDisable(true);
                        }}
                        style={{
                            flex: "1",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor:
                                name === "" || buttonDisable
                                    ? "#d6d6d6"
                                    : "#007bff",
                            color: "white",
                            cursor:
                                name === "" || buttonDisable
                                    ? "not-allowed"
                                    : "pointer",
                            boxShadow: "0 2px 5px rgba(0, 123, 255, 0.2)",
                            transition: "background-color 0.2s",
                        }}
                    >
                        Create Room
                    </button>
                    <button
                        disabled={roomId === "" || name === "" || buttonDisable}
                        onClick={() => {
                            socket.connect();
                            const player: Player = {
                                hand: {}, // doesnt matter
                                name,
                                roomId,
                                roomLeader: false, // doesnt matter
                            };
                            socket.emit("JoinRoom", player);
                            setButtonDisable(true);
                        }}
                        style={{
                            flex: "1",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor:
                                roomId === "" || name === "" || buttonDisable
                                    ? "#d6d6d6"
                                    : "#28a745",
                            color: "white",
                            cursor:
                                roomId === "" || name === "" || buttonDisable
                                    ? "not-allowed"
                                    : "pointer",
                            boxShadow: "0 2px 5px rgba(40, 167, 69, 0.2)",
                            transition: "background-color 0.2s",
                        }}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </DefaultScreen>
    );
};

export default SigninScreen;
