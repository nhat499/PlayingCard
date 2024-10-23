import { Polygon } from "@html-polygon/react";
import Draggable, { item } from "./Draggable";
import { useState } from "react";

type AddItemPopupProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
};

const AddItemPopup = ({ open, setOpen }: AddItemPopupProps) => {
    const [item, setItem] = useState<item>({
        disabled: false,
        // height: 100,
        id: "test",
        // isHidden: false,
        left: 0,
        top: 0,
        name: "test",
        parent: "create",
        // width: 100,
        zIndex: 0,
    });

    return (
        <dialog open={open} style={{ top: 50 }}>
            <div style={{ display: "flex", gap: "15px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <button>shape</button>
                    <button>card</button>
                    <button>stack</button>
                </div>

                <Polygon
                    sides={5}
                    borderColor="black"
                    rotate={0}
                    borderWidth={"10px"}
                    style={{
                        width: "100px",
                        height: "100px",
                        color: "red",
                        // stroke: "black",
                        // border: "50px solid black",
                        opacity: "70%",
                        backgroundColor: "green",
                    }}
                >
                    {/* test */}
                </Polygon>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        gap: "10px",
                    }}
                >
                    <button>add</button>
                    <button onClick={() => setOpen(false)}>close</button>
                </div>
            </div>
        </dialog>
    );
};

export default AddItemPopup;
