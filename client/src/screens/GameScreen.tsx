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
import { useParams } from "react-router-dom";

function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(1);
    const { roomId } = useParams();

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [boardItem, setBoardItem] = useState<BoardProps["items"]>({
        "3": {
            id: "3",
            name: "card3",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
            isDragging: false,
        },
        "4": {
            id: "4",
            name: "card4",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
            isDragging: false,
        },
        "5": {
            id: "5",
            name: "card5",
            zIndex: 1,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false,
            isDragging: false,
        },
    });
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>([]);

    function handleDragEnd(event: DragEndEvent) {
        // setIsDragging(false);
        const { active, over, delta, activatorEvent, collisions } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        if (over && over.id === "Board") {
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
            console.log("dropped");
            socket.emit("DropOnBoard", {
                item: updateItem,
                roomId,
                boardItem: newBoardItems,
            });

            const newHanditem = handItem.filter((curr) => curr.id !== item.id);
            setHandItem(newHanditem);
        } else if (over && over.id === "Hand") {
            // delete from broad
            socket.emit("DropOnHand", {
                item: item,
                roomId,
                boardItem: boardItem,
            });
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

                if (index === -1) {
                    // else add
                    item.left = 10;
                    item.top = 10;
                    currHandItem.push(item);
                } else {
                    item.left += delta.x;
                    item.top += delta.y;
                    currHandItem[index] = item;
                }
                return currHandItem;
            });
        }
    }

    function handleDragStart(event: DragStartEvent) {
        // setIsDragging(true);
        const { active } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        if (item.zIndex < highestZIndex) {
            item.zIndex = highestZIndex;
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
        console.log("i am updateItem:", updateItem);
    }

    useEffect(() => {
        socket.on("DropOnBoard", ({ item, roomId, boardItem }) => {
            console.log("drop on board", roomId);
            setBoardItem((currBoardItem) => {
                currBoardItem[item.id] = item;

                return { ...currBoardItem };
            });
        });

        socket.on("DropOnHand", ({ item, roomId, boardItem }) => {
            console.log("drop on hand", roomId);
            setBoardItem((currItem) => {
                delete currItem[item.id];
                return { ...currItem };
            });
        });

        socket.on("OnBoardDrag", ({ item, roomId, boardItem }) => {
            console.log("onboard dragging", roomId);
            setBoardItem((currItem) => {
                currItem[item.id] = item;
                return { ...currItem };
            });
        });
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
                    >
                        test
                    </div>
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
