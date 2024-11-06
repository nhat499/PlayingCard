import { useEffect, useState } from "react";
import DefaultScreen from "../components/DefaultScreen";
import { socket } from "../socket/Socket";
import { Navigate, useNavigate } from "react-router-dom";
import useUser from "../atom/userAtom";

const SigninScreen = () => {
    const [name, setName] = useState<string>("");

    const { user, setUser } = useUser();

    const [roomId, setRoomId] = useState<string>("");
    const navigate = useNavigate();

    const [buttonDisable, setButtonDisable] = useState(false);

    useEffect(() => {
        socket.on("roomId", ({ roomId, name, socketId, roomLeader }) => {
            setUser({ name, socketId, roomLeader });
            navigate("/room/" + roomId);
        });

        socket.on("error", ({ message }) => {
            console.log("error mesage:", message);
            setButtonDisable(false);
        });
    }, [navigate, setButtonDisable, setUser]);

    return (
        <DefaultScreen>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    maxWidth: "400px",
                    margin: "0 auto",
                    padding: "20px",
                    backgroundColor: "#f1f3f5",
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
                            backgroundColor: name === "" || buttonDisable ? "#d6d6d6" : "#007bff",
                            color: "white",
                            cursor: name === "" || buttonDisable ? "not-allowed" : "pointer",
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
                            socket.emit("JoinRoom", { name, roomId });
                            setButtonDisable(true);
                        }}
                        style={{
                            flex: "1",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: roomId === "" || name === "" || buttonDisable ? "#d6d6d6" : "#28a745",
                            color: "white",
                            cursor: roomId === "" || name === "" || buttonDisable ? "not-allowed" : "pointer",
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
