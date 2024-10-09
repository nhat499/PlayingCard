import { useEffect, useState } from "react";
import Board, { BoardProps } from "../components/Board";
import Hand from "../components/Hand";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import { DraggableProps, item } from "../components/Draggable";
import { socket } from "../socket/Socket";
import { useLocation, useParams } from "react-router-dom";

export const BOARD = "Board";
export const HAND = "Hand";

const Suite = ["spade", "club", "diamond", "heart"];

const createRegularDeckObject = () => {
    const object: item[] = [];
    for (let i = 1; i <= 10; i++) {
        for (const s of Suite) {
            const card: item = {
                id: `card${i}${s}`,
                name: `${i} ${s}`,
                parent: "stack1",
                zIndex: 1,
                width: 40,
                height: 55,
                top: 0,
                left: 0,
                disabled: false,
                isHidden: false,
            };
            object.push(card);
        }
    }
    for (const s of Suite) {
        const card: item = {
            id: `card${"jack"}${s}`,
            name: `${"jack"} ${s}`,
            parent: "stack1",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        };
        object.push(card);
    }
    for (const s of Suite) {
        const card: item = {
            id: `card${"queen"}${s}`,
            name: `${"queen"} ${s}`,
            parent: "stack1",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        };
        object.push(card);
    }
    for (const s of Suite) {
        const card: item = {
            id: `card${"king"}${s}`,
            name: `${"king"} ${s}`,
            parent: "stack1",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
        };
        object.push(card);
    }

    return object;
};

function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(2);
    const { roomId } = useParams();
    const { state } = useLocation();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    console.log("i a state:", state);
    const [boardItem, setBoardItem] = useState<BoardProps["items"]>({});
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>([]);

    function handleDragEnd(event: DragEndEvent) {
        // setIsDragging(false);
        console.log("i am drag end event:", event);
        const { active, over, delta, activatorEvent, collisions } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        // if (over && over.id === item.id) {
        //     // drag over itself
        //     return;
        // }
        if (over && over.id === BOARD) {
            // setBoardItem((currItem) => {
            //     if (currItem[item.id]) {
            //         item.left += delta.x;
            //         // item.left = over.rect.left
            //         // item.left = active.data.current?.left + delta.x
            //         // item.left = activatorEvent.target?.getBoundingClientRect().left -
            //         //     over.rect.left;
            //         item.top += delta.y;
            //         // item.top = active.data.current?.top + delta.y
            //         // item.top = activatorEvent.target?.getBoundingClientRect().top -
            //         //     over.rect.top;
            //     } else {
            //         console.log("i am in else drop");
            //         item.left = 10;
            //         item.top = 500;
            //     }
            //     currItem[item.id] = item;

            //     return currItem;

            // });
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
                console.log("i drop on board from stack");
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
                console.log("adding to stack");

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
        console.log("i am drag start event:", event);
        const item = active.data.current as DraggableProps["item"] | undefined;
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
        if (state) {
            console.log("i a state:", state);
            setBoardItem(state);
        }
    }, [state]);

    useEffect(() => {
        socket.on("DropOnBoard", ({ item, roomId, boardItem }) => {
            console.log("drop on board", roomId);
            setBoardItem((currBoardItem) => {
                item.transform = undefined;
                currBoardItem[item.id] = item;

                return { ...currBoardItem };
            });
        });

        socket.on("DropFromBoard", ({ item, roomId, boardItem }) => {
            console.log("DropFromBoard", roomId);
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
                const stackItem = structuredClone(currItem[stackId]);
                const stackArr = stackItem.data;
                item.parent = stackId;
                if (stackArr && stackArr.length > 0) {
                    if (stackArr[stackArr.length - 1].id !== item.id) {
                        console.log("i am pushing");
                        stackItem.data.push(item);
                    }
                } else {
                    stackItem.data = [item];
                }
                currItem[stackId] = stackItem;
                return { ...currItem };
            });
        });

        socket.on("DropFromStack2", ({ item, roomId, stackId }) => {
            console.log("i am popping1");
            setBoardItem((currItem) => {
                const stackItem = structuredClone(currItem[stackId]);
                const stackArr = stackItem.data as item[];
                if (stackArr && stackArr.length > 0) {
                    console.log("i am popping");
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
            // socket.disconnect();
        };
    }, []);

    return (
        // <div
        //     style={{
        //         width: "100%",
        //         height: "100%",
        //         // overflow: "hidden"
        //     }}
        // >
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={(a) => {
                console.log("i am a", a);
            }}
        >
            <div
                style={{
                    // width: 100,
                    // height: 100,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    overflow: "hidden",
                    // border: "1px solid black",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        // border: "1px solid black",
                        width: "100%",
                        height: "70%",
                    }}
                >
                    <div
                        style={{
                            width: "10%",
                            border: "1px solid black",
                        }}
                    ></div>
                    <Board
                        items={boardItem}
                        setItems={setBoardItem}
                        isDragging={isDragging}
                    />
                    <div
                        style={{
                            width: "10%",
                            border: "1px solid black",
                        }}
                    ></div>
                </div>
                <Hand cards={handItem} setItems={setHandItem}></Hand>
            </div>
        </DndContext>
        // </div>
    );
}

export default GameScreen;
