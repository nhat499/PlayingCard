import { useDroppable } from "@dnd-kit/core";
import Draggable, { DraggableProps, item } from "./Draggable";
import {
    TransformWrapper,
    TransformComponent,
    useTransformContext,
} from "react-zoom-pan-pinch";
import Stack, { StackProps } from "./Stack";
import Card, { CardProps } from "./Card";
import { socket } from "../socket/Socket";
import { useEffect } from "react";

export type BoardProps = {
    items: { [key: string]: CardProps["card"] | StackProps["stack"] };
    setItems: (value: BoardProps["items"]) => void;
    isDragging: boolean;
    size: { width: number; height: number };
};

const Board = ({ items, setItems, isDragging, size }: BoardProps) => {
    const { setNodeRef } = useDroppable({
        id: "Board",
    });

    const setAttribute = (
        id: string,
        key: string,
        value: string | number | boolean
    ) => {
        setItems((currItems) => {
            currItems[id][key] = value;
            return { ...currItems };
        });
    };

    useEffect(() => {
        socket.on("FlipCard", ({ roomId, itemId, value }) => {
            setAttribute(itemId, "isHidden", value);
        });

        socket.on("ShuffleStack", ({ roomId, stackId, stackData }) => {
            setAttribute(stackId, "data", stackData);
        });

        socket.on("FlipStack", ({ roomId, stackId, stackData }) => {
            setAttribute(stackId, "data", stackData);
        });
    }, []);

    return (
        <div
            ref={setNodeRef}
            style={{
                position: "relative",
                width: `100%`,
                display: "flex",
                height: `${size.height}px`,
                // border: "1px solid gray",
                backgroundColor: "lightblue",
            }}
        >
            {Object.entries(items).map(([key, item], index) => {
                return (
                    <div
                        key={key}
                        style={{
                            position: "relative",
                            // border: "1px solid red",
                            // width: "fit-content",
                            zIndex: item.zIndex,
                            top: item.top,
                            left: item.left,
                        }}
                    >
                        {item.id.startsWith("card") && (
                            <Card
                                key={key}
                                card={item as CardProps["card"]}
                                setAttribute={(id, key, value) =>
                                    setItems((currItems) => {
                                        currItems[id][key] = value;
                                        return { ...currItems };
                                    })
                                }
                            />
                        )}
                        {item.id.startsWith("stack") && (
                            <Stack
                                key={key}
                                stack={item as StackProps["stack"]}
                                setAttribute={(id, key, value) =>
                                    setItems((currItems) => {
                                        currItems[id][key] = value;
                                        return { ...currItems };
                                    })
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Board;
