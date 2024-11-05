import { useDroppable } from "@dnd-kit/core";
import Stack, { StackProps } from "./Stack";
import Card, { CardProps } from "./Card";
import { socket } from "../socket/Socket";
import { useEffect } from "react";

export type BoardProps = {
    items: { [key: string]: CardProps["card"] | StackProps["stack"] };
    setItems: React.Dispatch<React.SetStateAction<{
        [key: string]: CardProps["card"] | StackProps["stack"]
    }>>;
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
                width: "100%",
                display: "flex",
                height: `${size.height}px`,
                backgroundColor: "lightblue", // Light blue background
                borderRadius: "8px", // Rounded corners
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                overflow: "hidden", // Hide overflow to keep items contained
                padding: "10px", // Add padding for better spacing
            }}
        >
            {Object.entries(items).map(([key, item]) => (
                <div
                    key={key}
                    style={{
                        position: "absolute", // Changed to absolute for better placement
                        zIndex: item.zIndex,
                        top: item.top,
                        left: item.left,
                        transition: "transform 0.2s ease", // Smooth transition for movement
                    }}
                >
                    {item.id.startsWith("card") && (
                        <Card
                            card={item as CardProps["card"]}
                            setAttribute={(id, key, value) =>
                                setItems((currItems) => {
                                    currItems[id][key] = value;
                                    return currItems;
                                })
                            }
                        />
                    )}
                    {item.id.startsWith("stack") && (
                        <Stack
                            stack={item as StackProps["stack"]}
                            setAttribute={(id, key, value) =>
                                setItems((currItems) => {
                                    currItems[id][key] = value;
                                    return currItems;
                                })
                            }
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Board;
