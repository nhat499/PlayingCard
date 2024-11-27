// import { Polygon } from "@html-polygon/react";
import { useState } from "react";
import { socket } from "../socket/Socket";
import {
    gameObj,
    Item,
    Stack,
} from "../../../server/src/interfaces/gameStateInterface";
import { useUser } from "../atom/userAtom";
import Polygon from "./Polygon";

const baseItem: Item | Stack = {
    sides: 4,
    color: "white",
    width: 100,
    height: 100,
    name: "test",
    id: "cardNew",
    isHidden: false,
    left: 0,
    top: 0,
    zIndex: 0,
    rotate: 0,
    disabled: false,
    parent: gameObj.BOARD,
};

const AddItemPopup = () => {
    const { user } = useUser();
    if (!user) {
        throw Error("User Not found");
    }
    const [newItemString, setNewItemString] = useState<string>(
        JSON.stringify(baseItem, null, 2)
    );

    let newItem: Item | undefined;
    try {
        newItem = JSON.parse(newItemString) ?? undefined;
    } catch (err) {
        // does nothing
    }

    return (
        <div
            style={{
                borderRadius: "10px",
                padding: "20px",
                overflowAnchor: "auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    flexDirection: "column",
                }}
            >
                <textarea
                    style={{
                        border: "1px solid #ced4da",
                        borderRadius: "8px",
                        padding: "10px",
                        resize: "vertical",
                        flex: "1",
                        minHeight: "300px",
                        fontFamily: "monospace",
                        outline: "none",
                    }}
                    value={newItemString}
                    onChange={(e) => {
                        setNewItemString(e.target.value);
                    }}
                />
                <div
                    style={{
                        border: "1px solid #ced4da",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}
                >
                    <div>
                        {newItem && (
                            <Polygon
                                isDisabled={true}
                                sides={newItem.sides ?? 4}
                                rotate={newItem.rotate ?? 0}
                                height={newItem.height}
                                width={newItem.width}
                                color={newItem.color}
                            >
                                {newItem.name}
                            </Polygon>
                        )}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                        }}
                    >
                        <button
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                                boxShadow: "0 2px 5px rgba(0, 123, 255, 0.2)",
                                transition: "background-color 0.2s",
                            }}
                            onClick={() => {
                                if (newItem) {
                                    socket.emit("DropOnBoard", {
                                        item: {
                                            ...newItem,
                                            id: `${gameObj.ITEM}-${newItem.id}`,
                                        },
                                        player: user,
                                    });
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemPopup;
