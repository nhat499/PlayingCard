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
import { useItemAction } from "../atom/userAtom";
import { handleExport } from "../util";

export type BoardProps = {
    items: Room["board"];
    setItems: React.Dispatch<React.SetStateAction<Room["board"]>>;
    size: Room["setting"]["window"];
    // itemDragging: boolean;
    boardPosition: {
        x: number;
        y: number;
    };
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
    // itemDragging,
    boardScale,
    setBoardScale,
}: BoardProps) => {
    const { setNodeRef } = useDroppable({
        id: gameObj.BOARD,
    });
    const { isItemAction } = useItemAction();
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
    });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isItemAction) return;
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
            style={
                {
                    // position: "relative",
                    // display: "flex",
                }
            }
        >
            <button
                style={{
                    display: "flex",
                    justifySelf: "flex-end",
                    marginRight: "10px",
                    top: "",
                    backgroundColor: "lightblue",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                }}
                onClick={() => handleExport(JSON.stringify(items))}
            >
                export
            </button>
            <div
                ref={setNodeRef}
                style={{
                    minHeight: `${size.height}px`,
                    minWidth: `${size.width}px`,
                    border: "5px solid #a7c7dc",
                    ...(!isItemAction ? { overflow: "hidden" } : {}),
                    backgroundColor: "#e6f7ff",
                    borderRadius: "12px",
                    cursor: isDragging ? "grabbing" : "grab",
                    position: "relative",
                    marginBottom: "10px",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={(e) => {
                    if (e.deltaY > 0) {
                        // zoom out
                        setBoardScale((prevBoardScale) => {
                            return prevBoardScale - 0.03;
                        });
                    } else {
                        // zoom in
                        setBoardScale((prevBoardScale) => {
                            return prevBoardScale + 0.03;
                        });
                    }
                }}
            >
                <div
                    style={{
                        position: "relative",
                        minHeight: `${size.height}px`,
                        minWidth: `${size.width}px`,
                        // background: 'url("https://img.freepik.com/premium-vector/abstract-signs-pattern-white-background-vector-illustration_716882-534.jpg?semt=ais_hybrid")',
                        // backgroundRepeat: "repeat",
                        // backgroundSize: "300px 300px",
                        left: `${boardPosition.x}px`,
                        top: `${boardPosition.y}px`,
                        transform: `scale(${boardScale},${boardScale})`,
                        transformOrigin: "top left",
                    }}
                >
                    {Object.entries(items).map(([key, item]) => {
                        return "data" in item ? (
                            <ItemStack key={key} stack={item as Stack} />
                        ) : (
                            <Card
                                key={key}
                                card={item as Item}
                                disableOptions={false}
                            />
                        );

                        // <div
                        //     key={key}
                        //     style={{
                        //         position: "absolute",
                        //         zIndex: item.zIndex,
                        //         top: item.top,
                        //         left: item.left,
                        //     }}
                        // >
                        //     {item.id.startsWith(gameObj.ITEM) && (
                        //         <Card
                        //             key={key}
                        //             card={item as Item}
                        //             disableOptions={false}
                        //         />
                        //     )}
                        //     {item.id.startsWith(gameObj.STACK) && (
                        //         <ItemStack
                        //             key={key}
                        //             stack={item as Stack}
                        //         />
                        //     )}
                        // </div>
                    })}
                    {/* Context Menu (Draggable Options) */}
                    {/* <DraggableOptions
                        openDialog={true}
                        setOpenDialog={() => {}}
                        zIndex={0}
                        // zIndex={gameStates?.maxZIndex ?? stack.zIndex + 1}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <button
                                // onClick={() => {
                                //     if (stack.data.length < 1) return;
                                //     // flipAll(stack.data, !stack.data[0].isHidden);
                                //     // socket.emit("FlipStack", {
                                //     //     roomId,
                                //     //     stackId: stack.id,
                                //     //     stackData: stack.data,
                                //     // });

                                //     socket.emit("DealItem", {
                                //         player: user,
                                //         amount: 1,
                                //         stack,
                                //     });
                                //     setOpenDialog(false);
                                // }}
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
                                Deal
                            </button>
                            <button
                                // onClick={() => {
                                //     socket.emit("ShuffleStack", {
                                //         player: user,
                                //         stack,
                                //     });
                                //     setOpenDialog(false);
                                // }}
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
                                // onClick={() => {
                                //     if (stack.data.length < 1) return;
                                //     // flipAll(stack.data, !stack.data[0].isHidden);
                                //     // socket.emit("FlipStack", {
                                //     //     roomId,
                                //     //     stackId: stack.id,
                                //     //     stackData: stack.data,
                                //     // });

                                //     socket.emit("FlipStack", {
                                //         player: user,
                                //         stack,
                                //     });
                                //     setOpenDialog(false);
                                // }}
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
                    </DraggableOptions> */}
                </div>
            </div>
        </div>
    );
};

export default Board;
