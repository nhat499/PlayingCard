export type SettingProps = {
    settingValue: string;
    setSettingValue: (value: string) => void;
    startGame: () => void;
};

const Setting = ({
    settingValue,
    setSettingValue,
    startGame,
}: SettingProps) => {
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
