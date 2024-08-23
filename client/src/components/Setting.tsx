import { useState } from "react";
import { DraggableProps } from "./Draggable";

export type SettingProps = {
    itemData: { [key: string]: DraggableProps["item"][] };
    startGame: () => void;
};

const Setting = ({ itemData, startGame }: SettingProps) => {
    const [settingValue, setSettingValue] = useState<string>(
        JSON.stringify(itemData, undefined, 2)
    );
    return (
        <div
            autoFocus
            style={{
                // position: "absolute",
                top: "10%",
                minWidth: "400px",
                minHeight: "600px",
                // zIndex: 1
            }}
        >
            <div
                style={{
                    backgroundColor: "whitesmoke",
                }}
            >
                <textarea
                    style={{
                        border: "none",
                        resize: "none",
                        minWidth: "400px",
                        minHeight: "600px",
                    }}
                    value={settingValue}
                    onChange={(e) => {
                        setSettingValue(e.target.value);
                    }}
                ></textarea>
            </div>
            <button onClick={startGame}>Start game</button>
        </div>
    );
};

export default Setting;
