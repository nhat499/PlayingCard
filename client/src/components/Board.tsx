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
    boardScale: number;
    setBoardScale: React.Dispatch<React.SetStateAction<number>>;
};

const Board = ({
    items,
    setItems,
    size,
    boardPosition,
    setBoardPosition,
    itemDragging,
    boardScale,
    setBoardScale
}: BoardProps) => {
    const { setNodeRef } = useDroppable({
        id: gameObj.BOARD,
    });

    // const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
    // const [boardScale, setBoardScale] = useState(1);;
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
                backgroundColor: "#e6f7ff",
                borderRadius: "12px",
                cursor: isDragging ? "grabbing" : "grab",
                position: "relative",

            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={(e) => {
                console.log(e.deltaY);
                if (e.deltaY > 0) {
                    // zoom out
                    setBoardScale((prevBoardScale) => {
                        return prevBoardScale - 0.03;
                    })
                } else {
                    // zoom in
                    setBoardScale((prevBoardScale) => {
                        return prevBoardScale + 0.03;
                    })
                }
            }}
        >
            <div

                style={{
                    position: "absolute",
                    minHeight: `${size.height}px`,
                    minWidth: `${size.width}px`,
                    background: 'url("https://cdn.dribbble.com/userupload/7866706/file/original-69236f9a34a5cdc9c59d8dc64cdbeb5a.png?resize=1600x1200")',
                    backgroundRepeat: "round",
                    left: `${boardPosition.x}px`, // Apply left position to move the board
                    top: `${boardPosition.y}px`, // Apply top position to move the board
                    // transition: "",
                    transform: `scale(${boardScale},${boardScale})`,
                    transformOrigin: "center center"
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
