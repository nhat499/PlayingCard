import { useEffect, useState } from "react";
import { socket } from "../socket/Socket";
import { useUser } from "../atom/userAtom";

const Dice = () => {
    const [roll, setRoll] = useState<number>(6);
    const { user } = useUser();
    if (!user) {
        throw "User Not Found";
    }
    useEffect(() => {
        socket.on("RollDice", ({ roll }) => {
            setRoll(roll);
        });

        return () => {
            socket.off("RollDice");
        };
    });
    return (
        <button
            onClick={() => {
                // const result = Math.floor(Math.random() * sides) + 1;
                socket.emit("RollDice", { player: user });
                // setRoll(result);
            }}
            style={{
                display: "flex",
                border: "none",
                justifyContent: "center",
                alignItems: "center",
                width: "100px",
                height: "100px",
                color: "black",
                fontSize: "150px",
                cursor: "pointer",
                background: "none",
                transition: "ease-in 2s",
            }}
        >
            {roll ? String.fromCodePoint(9855 + roll) : ""}
        </button>
    );
};

export default Dice;
