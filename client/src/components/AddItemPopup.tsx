import { Polygon } from "@html-polygon/react";
import { useState } from "react";
import { CardProps } from "./Card";
import { StackProps } from "./Stack";
import { socket } from "../socket/Socket";
import { useParams } from "react-router-dom";

type AddItemPopupProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    setBoardItem: React.Dispatch<
        React.SetStateAction<{
            [key: string]: CardProps["card"] | StackProps["stack"];
        }>
    >;
};

const baseItem: CardProps["card"] = {
    color: "white",
    disabled: false,
    height: 100,
    id: "cardNew",
    isHidden: false,
    rotate: 0,
    left: 0,
    top: 0,
    name: "test",
    parent: "Board",
    width: 100,
    zIndex: 0,
    sides: 4,
};

const AddItemPopup = ({ open, setOpen, setBoardItem }: AddItemPopupProps) => {
    const { roomId } = useParams();
    const [newItemString, setNewItemString] = useState<string>(
        JSON.stringify(baseItem, null, 2)
    );

    let newItem: CardProps["card"] | undefined;
    try {
        newItem = JSON.parse(newItemString) ?? {};
    } catch (err) {}

    return (
        <dialog open={open} style={{ top: 50 }}>
            <div style={{ display: "flex", gap: "15px" }}>
                <textarea
                    style={{
                        border: "1px solid black",
                        resize: "none",
                        height: "300px",
                    }}
                    value={newItemString}
                    onChange={(e) => {
                        setNewItemString(e.target.value);
                    }}
                />
                <div
                    style={{
                        minWidth: "100px",
                        minHeight: "100px",
                    }}
                >
                    {newItem && (
                        <Polygon
                            sides={newItem.sides ?? 4}
                            borderColor="black"
                            borderWidth={1}
                            stable
                            rotate={newItem.rotate ?? 0}
                            style={{
                                width: `${newItem.width ?? 0}px`,
                                height: `${newItem.height ?? 0}px`,
                                backgroundColor: newItem.color ?? "white",
                                textAlign: "center",
                            }}
                        >
                            {newItem.name}
                        </Polygon>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={() => {
                            if (newItem) {
                                console.log("test");
                                socket.emit("DropOnBoard", {
                                    item: {
                                        ...newItem,
                                        id: "card" + newItem.id,
                                    },
                                    roomId,
                                    boardItem: {},
                                });
                            }
                        }}
                    >
                        add
                    </button>
                    <button onClick={() => setOpen(false)}>close</button>
                </div>
            </div>
        </dialog>
    );
};

export default AddItemPopup;
