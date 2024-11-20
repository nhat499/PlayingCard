import { Item } from "../../../server/src/interfaces/gameStateInterface";

type HandButtonProps = {
    setHandItem: (value: React.SetStateAction<{
        [key: string]: Item;
    }>) => void
}

const HandButton = ({ setHandItem }: HandButtonProps) => {
    return <div style={{
        position: "absolute",
        paddingLeft: "10px",
        // margin: "0px",
        // top: "borderBotLeft",
        // bottom: "bottom",
        // top: 0,
        display: 'flex',
        gap: "5px"
    }}>
        <button
            style={{
                backgroundColor: "lightblue",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
            onClick={() => {
                setHandItem((prevHand) => {
                    const newHand = Object.fromEntries(
                        Object.entries(prevHand).map(([key, value]) => [
                            key,
                            { ...value, isHidden: !value.isHidden },
                        ])
                    );
                    return newHand;
                })

            }}>flip all</button>
        <button
            style={{
                backgroundColor: "lightblue",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
            onClick={() => {
                setHandItem((prevHand) => {

                    const newHand = Object.entries(prevHand).map(([key, value], index) => {
                        return [
                            key,
                            { ...value, top: 10, left: index * 20 }
                        ]
                    });
                    return Object.fromEntries(newHand);
                });
            }}
        >spread all</button>
    </div >
}

export default HandButton;