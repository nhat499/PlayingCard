import { useEffect, useState } from "react";
import Board, { BoardProps } from "../components/Board";
import Hand from "../components/Hand";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DraggableProps } from "../components/Draggable";
import { socket } from "../socket/Socket";
import { useParams } from "react-router-dom";

function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(1);
    const { roomId } = useParams();

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [boardItem, setBoardItem] = useState<BoardProps["items"]>({
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
        },
    });
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>([]);

    function handleDragEnd(event: DragEndEvent) {
        console.log("i am event:", event);
        setIsDragging(false);
        const { active, over, delta, activatorEvent, collisions } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        if (over && over.id === "Board") {
            setBoardItem((currItem) => {
                item.left =
                    activatorEvent.target?.getBoundingClientRect().left -
                    over.rect.left;
                item.top =
                    activatorEvent.target?.getBoundingClientRect().top -
                    over.rect.top;
                currItem[item.id] = item;
                return currItem;
            });
            const newHanditem = handItem.filter((curr) => curr.id !== item.id);
            setHandItem(newHanditem);

            socket.emit("DropOnBoard", { item, roomId });
        } else if (over && over.id === "Hand") {
            // delete from broad
            setBoardItem((currItem) => {
                delete currItem[item.id];
                return currItem;
            });
            // add to hand
            setHandItem((currHandItem) => {
                // check if exists
                const index = currHandItem.findIndex(
                    (curr) => curr.id === item.id
                );
                if (index === -1) {
                    // else add
                    currHandItem.push(item);
                } else {
                    currHandItem[index] = item;
                }
                return currHandItem;
            });
        }
    }

    function handleDragStart(event: DragStartEvent) {
        setIsDragging(true);
        const { active } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        if (item.zIndex < highestZIndex) {
            item.zIndex = highestZIndex;
            setHighestZIndex(highestZIndex + 1);
        }
    }

    useEffect(() => {
        socket.on("DropOnBoard", ({ item, roomId }) => {
            setBoardItem((currItem) => {
                currItem[item.id] = item;
                return currItem;
            });
        });
    }, []);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <DndContext
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}

                // onDragMove={(event) => {
                //     // if (event.delta.x > 20 || event.delta.y > 20)
                //     //     console.log("I am mvoing:", event);
                // }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        border: "1px solid black",
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
                            }}
                        >
                            test
                        </div>
                    </div>
                    <Hand cards={handItem} setItems={setHandItem}></Hand>
                </div>
            </DndContext>
        </div>
    );
}

export default GameScreen;
