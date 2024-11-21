import { useDroppable } from "@dnd-kit/core";
import Draggable, { item } from "./Draggable";
import { useState } from "react";
import { socket } from "../socket/Socket";
import DraggableOptions from "./DraggableOptions";
import { useParams } from "react-router-dom";
import { CardProps } from "./Card";

export type StackProps = {
    stack: item & { data: CardProps["card"][]; width: number; height: number };
    setAttribute: (
        itemId: string,
        key: string,
        value: string | number | boolean | item[]
    ) => void;
};

// export interface StackItem extends item {
//     data: item[];
// }

function shuffle(array: item[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}

function flipAll(array: item[], isHidden: boolean) {
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
            onContextMenu={(e) => {
                e.preventDefault();
                setOpenDialog(true);
            }}
        >
            <DraggableOptions
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                zIndex={stack.zIndex + 1}
            >
                <button
                    onClick={() => {
                        shuffle(stack.data);
                        // setAttribute(stack.id, "data", stack.data);
                        socket.emit("ShuffleStack", {
                            roomId,
                            stackId: stack.id,
                            stackData: stack.data,
                        });
                        setOpenDialog(false);
                    }}
                >
                    shuffle
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
                >
                    flip
                </button>
            </DraggableOptions>
            <Draggable
                item={{
                    ...stack,
                }}
                Children={(isDragging) => (
                    <>
                        stack
                        <div
                            ref={!isDragging ? setDropRef : undefined}
                            style={{
                                width: stack.width,
                                height: stack.height,
                                display: "flex",
                            }}
                        >
                            {stack.data?.map((item) => {
                                return (
                                    <Draggable
                                        key={item.id}
                                        item={item}
                                        Children={() => (
                                            <div
                                                style={{
                                                    border: "1px solid black",
                                                    width: item.width,
                                                    height: item.height,
                                                }}
                                            >
                                                {item.isHidden
                                                    ? "hidden"
                                                    : item.name}
                                            </div>
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            />
        </div>
    );
};

export default Stack;
