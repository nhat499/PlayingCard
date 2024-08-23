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
            <input
                value={name}
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
            />
            <input
                value={roomId}
                placeholder="room id"
                onChange={(e) => setRoomId(e.target.value)}
            />

            <div
                style={{
                    display: "flex",
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
                >
                    create room
                </button>
                <button
                    disabled={roomId === "" || name === "" || buttonDisable}
                    onClick={() => {
                        socket.connect();
                        socket.emit("JoinRoom", { name, roomId });
                        setButtonDisable(true);
                    }}
                >
                    Join room
                </button>
            </div>
        </DefaultScreen>
    );
};

export default SigninScreen;
