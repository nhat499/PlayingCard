import { useDroppable } from "@dnd-kit/core";
import ItemStack from "./Stack";
import Card from "./Card";
import { socket } from "../socket/Socket";
import { useEffect, useState } from "react";
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
    itemDragging: boolean;
    boardPosition: {
        x: number;
        y: number;
    }
    setBoardPosition: (value: BoardProps["boardPosition"]) => void;
};

const Board = ({ items, setItems, size, boardPosition, setBoardPosition, itemDragging }: BoardProps) => {
    const { setNodeRef } = useDroppable({
        id: gameObj.BOARD,
    });

    // const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
    const [cursorPosBefore, setCursorPosBefore] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // socket events
    useEffect(() => {
        socket.on("FlipCard", ({ board }) => {
            setItems(board);
        });

        socket.on("LockCard", ({ board }) => {
            setItems(board);
        });

        socket.on("ShuffleStack", ({ board }) => {
            setItems(board);
        });

        socket.on("FlipStack", ({ board }) => {
            setItems(board);
        });

        return () => {
            socket.off("FlipCard");
            socket.off("ShuffleStack");
            socket.off("FlipStack");
            socket.off("LockCard");
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (itemDragging) return;
        setCursorPosBefore({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - cursorPosBefore.x;
        const deltaY = e.clientY - cursorPosBefore.y;

        setBoardPosition({
            x: boardPosition.x + deltaX,
            y: boardPosition.y + deltaY,
        });

        // Update the cursor position for next move calculation
        setCursorPosBefore({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                minHeight: `${size.height}px`,
                minWidth: `${size.width}px`,
                border: "5px solid #a7c7dc",
                overflow: "hidden",
                // backgroundColor: "#e6f7ff",
                borderRadius: "12px",
                cursor: isDragging ? "grabbing" : "grab",
                position: "relative",

            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the area
        >
            <div

                style={{
                    position: "absolute",
                    minHeight: `${size.height}px`,
                    minWidth: `${size.width}px`,
                    background: 'url("https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60")',
                    backgroundRepeat: "round",
                    left: `${boardPosition.x}px`, // Apply left position to move the board
                    top: `${boardPosition.y}px`, // Apply top position to move the board
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
                            }}
                        >
                            {item.id.startsWith(gameObj.ITEM) && (
                                <Card key={key} card={item as Item} disableOptions={false} />
                            )}
                            {item.id.startsWith(gameObj.STACK) && (
                                <ItemStack key={key} stack={item as Stack} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Board;
