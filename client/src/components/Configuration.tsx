export type ConfigurationProps = {
    settingValue: string;
    setSettingValue: (value: string) => void;
    startGame: () => void;
    isRoomLeader: boolean;
    boardState: string;
    setBoardState: (value: string) => void;
};

const Configuration = ({
    settingValue,
    setSettingValue,
    boardState,
    setBoardState,
    startGame,
    isRoomLeader,
}: ConfigurationProps) => {
    return (
        <div
            autoFocus
            style={{
                // position: "absolute",
                top: "10%",
                minWidth: "400px",
                minHeight: "600px",
                display: "flex",
                flexDirection: "column",
                gap: 20
                // zIndex: 1
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
                        minHeight: "600px",
                        fontSize: "16px",
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
                        minHeight: "600px",
                        fontSize: "16px",
                    }}
                    disabled={!isRoomLeader}
                    value={settingValue}
                    onChange={(e) => {
                        setSettingValue(e.target.value);
                    }}
                />
            </div>
            {isRoomLeader &&
                <button
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
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
