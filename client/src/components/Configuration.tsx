import { Player } from "../../../server/src/interfaces/gameStateInterface";
import PlayerIconList from "./PlayerIconList";

export type ConfigurationProps = {
    settingValue: string;
    setSettingValue: (value: string) => void;
    startGame: () => void;
    isRoomLeader: boolean;
    boardState: string;
    setBoardState: (value: string) => void;
    players: Player[]
};

const Configuration = ({
    settingValue,
    setSettingValue,
    boardState,
    setBoardState,
    startGame,
    isRoomLeader,
    players,
}: ConfigurationProps) => {



    return (
        <div
            autoFocus
            style={{
                top: "10%",
                minWidth: "400px",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "30px",
                }}
            >
                <textarea
                    style={{
                        resize: "none",
                        minWidth: "400px",
                        minHeight: "300px",
                        fontSize: "16px",
                        border: "none",
                    }}
                    disabled={!isRoomLeader}
                    value={boardState}
                    onChange={(e) => {
                        setBoardState(e.target.value);
                    }}
                />

                <textarea
                    style={{
                        resize: "none",
                        minWidth: "400px",
                        minHeight: "300px",
                        fontSize: "16px",
                        border: "none",
                    }}
                    disabled={!isRoomLeader}
                    value={settingValue}
                    onChange={(e) => {
                        setSettingValue(e.target.value);
                    }}
                />
                <PlayerIconList players={players} />
            </div>
            {isRoomLeader &&
                <button
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        width: "300px",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#004bff")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#007bff")
                    }
                    onClick={startGame}>Start game</button>}
        </div>
    );
};

export default Configuration;
