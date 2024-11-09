import { useDroppable } from "@dnd-kit/core";
import ItemStack, { StackProps } from "./Stack";
import Card, { CardProps } from "./Card";
import { socket } from "../socket/Socket";
import { useEffect } from "react";
import {
    gameObj,
    Item,
    Room,
    Stack,
} from "../../../server/src/interfaces/gameStateInterface";

export type BoardProps = {
    items: Room["board"];
    setItems: React.Dispatch<React.SetStateAction<Room["board"]>>;
    size: Room["setting"]["window"];
};

const Board = ({ items, setItems, size }: BoardProps) => {
    const { setNodeRef } = useDroppable({
        id: gameObj.BOARD,
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
                height: `${size.height}px`,
                backgroundColor: "#e6f7ff", // Light gradient for a modern touch
                borderRadius: "12px", // Rounded corners for a softer look
                padding: "10px",
                border: "5px solid #a7c7dc", // Light border to frame the board
                // overflow: "hidden",
            }}
        >
            {Object.entries(items).map(([key, item]) => {
                return (
                    <div
                        key={key}
                        style={{
                            position: "absolute",
                            zIndex: item.zIndex,
                            top: item.top,
                            left: item.left,
                            // transform: isDragging ? "scale(1.05)" : "scale(1)", // Slight scaling effect when dragging
                            transition:
                                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Smooth transitions
                            // boxShadow: isDragging ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none", // Shadow effect during drag
                        }}
                    >
                        {item.id.startsWith(gameObj.ITEM) && (
                            <Card
                                key={key}
                                card={item as Item}
                                setAttribute={(id, key, value) =>
                                    setItems((currItems) => {
                                        currItems[id][key] = value;
                                        return currItems;
                                    })
                                }
                            />
                        )}
                        {item.id.startsWith(gameObj.STACK) && (
                            <ItemStack
                                key={key}
                                stack={item as Stack}
                                setAttribute={(id, key, value) =>
                                    setItems((currItems) => {
                                        currItems[id][key] = value;
                                        return currItems;
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
