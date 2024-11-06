import { useDroppable } from "@dnd-kit/core";
import Draggable, { item } from "./Draggable";
import { useState } from "react";
import { socket } from "../socket/Socket";
import DraggableOptions from "./DraggableOptions";
import { useParams } from "react-router-dom";
import Card, { CardProps } from "./Card";

export type StackProps = {
    stack: item & { data: CardProps["card"][]; width: number; height: number };
    setAttribute: (
        itemId: string,
        key: string,
        value: string | number | boolean | item[]
    ) => void;
};

function shuffle(array: CardProps["card"][]) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function flipAll(array: CardProps["card"][], isHidden: boolean) {
    for (const item of array) {
        item.isHidden = isHidden;
    }
}

const Stack = ({ stack }: StackProps) => {
    const { setNodeRef: setDropRef } = useDroppable({
        id: stack.id,
    });
    const { roomId } = useParams();
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                cursor: "pointer",
                // width: stack.width, // Add some spacing around the stack
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                setOpenDialog(true);
            }}
        >
            {/* Context Menu (Draggable Options) */}
            <DraggableOptions
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                zIndex={stack.zIndex + 1}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                        onClick={() => {
                            shuffle(stack.data);
                            socket.emit("ShuffleStack", {
                                roomId,
                                stackId: stack.id,
                                stackData: stack.data,
                            });
                            setOpenDialog(false);
                        }}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                    >
                        Shuffle
                    </button>

                    <button
                        onClick={() => {
                            if (stack.data.length < 1) return;
                            flipAll(stack.data, !stack.data[0].isHidden);
                            socket.emit("FlipStack", {
                                roomId,
                                stackId: stack.id,
                                stackData: stack.data,
                            });
                            setOpenDialog(false);
                        }}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                    >
                        Flip
                    </button>
                </div>
            </DraggableOptions>

            {/* Draggable Stack */}
            <Draggable
                item={{ ...stack }}
                Children={(isDragging) => (
                    <div
                        style={{
                            position: "relative",
                            border: "2px solid #007bff",
                            paddingTop: "5px",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.2s ease",
                            opacity: isDragging ? 0.6 : 1,
                        }}
                    >
                        <div
                            ref={!isDragging ? setDropRef : undefined}
                            style={{
                                width: stack.width + 20,
                                height: stack.height + 30,
                                position: "relative",
                                // display: "flex",
                                // alignItems: "center",
                                // justifyContent: "center",
                            }}
                        >
                            {stack.data?.map((item) => {
                                return (
                                    <Card
                                        key={item.id}
                                        card={item}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default Stack;
