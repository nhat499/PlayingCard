import { useState } from 'react';

type DiceProps = {
    sides?: number;  // Optional: defaults to 6
};

const Dice = ({ sides = 6 }: DiceProps) => {
    const [roll, setRoll] = useState<number>(6);


    return (
        <button
            onClick={(e) => {

                const result = Math.floor(Math.random() * sides) + 1;

                setRoll(result);

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
                transition: "ease-in 2s"
            }}>
            {roll ? String.fromCodePoint(9855 + roll) : ""}
        </button>
    );
};


export default Dice;
