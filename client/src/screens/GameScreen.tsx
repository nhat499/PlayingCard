import { useEffect, useState } from "react";
import Board, { BoardProps } from "../components/Board";
import Hand from "../components/Hand";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import { DraggableProps } from "../components/Draggable";
import { socket } from "../socket/Socket";
import { useLocation, useParams } from "react-router-dom";
import AddItemPopup from "../components/AddItemPopup";
import { CardProps } from "../components/Card";
import { StackProps } from "../components/Stack";
import ChatBox from "../components/ChatBox";
import { useGameState } from "../atom/userAtom";
import { Room } from "../../../server/src/interfaces/gameStateInterface";

export const BOARD = "Board";
export const HAND = "Hand";

function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(2);
    const { roomId } = useParams();
    const { gameStates, setGameStates } = useGameState();
    if (!gameStates) {
        return <>error</>
    }
    console.log("i am gameStates:", gameStates);
    // const { state } = useLocation();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [boardItem, setBoardItem] = useState<Room["board"]>(gameStates.board);
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>([]);
    // const [boardSize, setBoardSize] = useState({
    //     width: gameStates.setting.window.width,
    //     height: gameStates.setting.window.height,
    // });
    const [openAddItemPopup, setOpenAddItemPopup] = useState<boolean>(false);

    function handleDragEnd(event: DragEndEvent) {
        // setIsDragging(false);
        const { active, over, delta, activatorEvent, collisions } = event;
        const item = active.data.current as CardProps["card"] | undefined;
        if (!item) return;
        // if (over && over.id === item.id) {
        //     // drag over itself
        //     return;
        // }
        if (over && over.id === BOARD) {
            const newBoardItems = { ...boardItem };
            let updateItem = newBoardItems[item.id];
            const previousParent = item.parent;
            // if item is already on the board;
            if (updateItem) {
                updateItem.left += delta.x;
                updateItem.top += delta.y;
            } else {
                // item is not already on the board;
                // updateItem.left = 10;
                // updateItem.top = 10;
                updateItem = { ...item };
                updateItem.top = 300;
                updateItem.left = 200;
            }
            updateItem.parent = BOARD;
            socket.emit("DropOnBoard", {
                item: updateItem,
                roomId,
                boardItem: newBoardItems,
            });

            if (previousParent === HAND) {
                const newHanditem = handItem.filter(
                    (curr) => curr.id !== item.id
                );
                setHandItem(newHanditem);
            } else if (previousParent.startsWith("stack")) {
                socket.emit("DropFromStack", {
                    item: item,
                    roomId,
                    stackId: item.parent,
                });
                // previousParent is a stack
                // remove item from stack
                // add to board
            }
        } else if (over && over.id === HAND && !item.id.startsWith("stack")) {
            // delete from broad
            if (item.parent === BOARD) {
                socket.emit("DropFromBoard", {
                    item: item,
                    roomId,
                    boardItem: boardItem,
                });
            } else if (item.parent.startsWith("stack")) {
                // delete from stack
                socket.emit("DropFromStack", {
                    item: item,
                    roomId,
                    stackId: item.parent,
                });
            }
            // setBoardItem((currItem) => {
            //     delete currItem[item.id];
            //     return currItem;
            // });
            // add to hand
            setHandItem((currHandItem) => {
                // check if exists
                const index = currHandItem.findIndex(
                    (curr) => curr.id === item.id
                );
                // item.left =
                //     activatorEvent.target?.getBoundingClientRect().left -
                //     over.rect.left;

                // item.top =
                //     activatorEvent.target?.getBoundingClientRect().top -
                //     over.rect.top;

                item.parent = HAND;
                if (index === -1) {
                    // else add
                    item.left = 10;
                    item.top = 10;
                    currHandItem.push(item);
                } else {
                    item.left += delta.x;
                    item.top += delta.y;
                    currHandItem[index] = { ...item };
                }
                return currHandItem;
            });
        } else if (over && over.id) {
            // drop over some object/stack

            // socket.emit("AddToStack", {
            //     item: item,
            //     roomId,
            //     stackId: over.id,
            // });
            if (over.id.toString().startsWith("stack")) {
                // setBoardItem((currItem) => {
                //     const stackItem = structuredClone(currItem[over.id]);
                //     if (stackItem.data) {
                //         stackItem.data.push(item);
                //     } else {
                //         stackItem.data = [item];
                //     }
                //     currItem[over.id] = stackItem;
                //     return { ...currItem };
                // });

                socket.emit("AddToStack", {
                    item: item,
                    roomId,
                    stackId: over.id,
                });
                if (item.parent === BOARD) {
                    socket.emit("DropFromBoard", {
                        item: item,
                        roomId,
                        boardItem: boardItem,
                    });
                }
                if (item.parent === HAND) {
                    const newHanditem = handItem.filter(
                        (curr) => curr.id !== item.id
                    );
                    setHandItem(newHanditem);
                }
            }
        }
    }

    function handleDragStart(event: DragStartEvent) {
        // setIsDragging(true);
        const { active } = event;
        const item = active.data.current as CardProps["card"] | undefined;
        if (!item) return;

        if (
            boardItem[item.id] &&
            item.zIndex < highestZIndex &&
            !item.id.startsWith("stack")
        ) {
            item.zIndex = highestZIndex;
            setBoardItem((currBoardItem) => {
                currBoardItem[item.id] = item;
                return { ...currBoardItem };
            });
            setHighestZIndex(highestZIndex + 1);
        }
    }

    function handleDragMove(event: DragMoveEvent) {
        const updateItem = { ...event.active.data.current };
        if (updateItem && event.over?.id === "Board") {
            updateItem.transform = `translate3d(${event.delta.x}px, ${event.delta.y}px, 0)`;
            socket.emit("OnBoardDrag", {
                item: updateItem,
                roomId,
                boardItem: boardItem,
            });
        }
    }

    useEffect(() => {
        socket.on("DropOnBoard", ({ item, roomId, boardItem }) => {
            console.log("client recived drop");
            setBoardItem((currBoardItem) => {
                item.transform = undefined;
                currBoardItem[item.id] = item;
                return { ...currBoardItem };
            });
        });

        socket.on("DropFromBoard", ({ item, roomId, boardItem }) => {
            setBoardItem((currItem) => {
                delete currItem[item.id];
                return { ...currItem };
            });
        });

        socket.on("OnBoardDrag", ({ item, roomId, boardItem }) => {
            setBoardItem((currItem) => {
                currItem[item.id] = item;
                return { ...currItem };
            });
        });

        socket.on("AddToStack", ({ item, roomId, stackId }) => {
            setBoardItem((currItem) => {
                const stackItem = structuredClone(
                    currItem[stackId]
                ) as StackProps["stack"];
                const stackArr = stackItem.data;
                item.parent = stackId;
                if (stackArr && stackArr.length > 0) {
                    if (stackArr[stackArr.length - 1].id !== item.id) {
                        stackItem.data.push(item);
                    }
                } else {
                    stackItem.data = [item];
                }
                currItem[stackId] = stackItem;
                return { ...currItem };
            });
        });

        socket.on("DropFromStack", ({ item, roomId, stackId }) => {
            setBoardItem((currItem) => {
                const stackItem = structuredClone(
                    currItem[stackId]
                ) as StackProps["stack"];
                const stackArr = stackItem.data;
                if (stackArr && stackArr.length > 0) {
                    if (stackArr[stackArr.length - 1].id === item.id) {
                        stackArr.pop();
                    }
                }
                currItem[stackId] = stackItem;
                return { ...currItem };
            });
        });

        return () => {
            console.log("disconnection?");
            socket.off("DropFromStack");
            socket.off("AddToStack");
            socket.off("OnBoardDrag");
            socket.off("DropFromBoard");
            socket.off("DropOnBoard");
        };
    }, []);

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
        >
            <div
                style={{
                    // display: "flex",
                    // flexDirection: "column",
                    // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    // alignItems: "flex-end",
                    // justifyContent: "center",
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr",
                    gap: "10px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "10px", // Increased gap for better spacing
                        borderRadius: "12px", // Rounded corners for a modern touch
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                        overflow: "hidden"
                    }}
                >
                    <Board
                        size={gameStates.setting.window}
                        items={boardItem}
                        setItems={setBoardItem}
                        isDragging={isDragging}
                    />


                    <Hand
                        cards={handItem}
                        setItems={setHandItem}
                    />

                </div>

                <div
                    style={{
                        // width: "100%",
                        // maxHeight: "parent",
                        backgroundColor: "#e6f7ff", // Soft light blue
                        border: "5px solid #a7c7dc", // Light border to frame the board
                        borderRadius: "12px", // Rounded corners for a modern touch
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                        // overflow: "hidden"
                    }}
                >
                    <AddItemPopup
                        open={openAddItemPopup}
                        setOpen={setOpenAddItemPopup}
                        setBoardItem={setBoardItem}
                    />
                    {!openAddItemPopup &&
                        <button
                            style={{
                                padding: "8px 16px",
                                margin: "20px",
                                // width: "70%",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                                boxShadow: "0 2px 5px rgba(0, 123, 255, 0.2)",
                                transition: "background-color 0.2s",
                            }}
                            onClick={() => setOpenAddItemPopup(true)}>
                            Add Item
                        </button>}

                    <ChatBox />
                </div>

            </div>

        </DndContext >
    );
}

export default GameScreen;
