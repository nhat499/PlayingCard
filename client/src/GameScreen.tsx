import { useState } from "react";
import Board, { BoardProps } from "./Board";
import Hand, { HandProps } from "./Hand";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, PointerSensor, useSensor, useSensors, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { DraggableProps } from "./Draggable";

const cards: DraggableProps["item"][] = [
    {
        id: "1",
        name: "card1",
        zIndex: 0,
        width: 40,
        height: 55,
        top: 0,
        left: 0,
        disabled: false,
        isHidden: false
    },
    {
        id: "2",
        name: "card2",
        zIndex: 0,
        width: 40,
        height: 55,
        top: 0,
        left: 0,
        disabled: false,
        isHidden: false
    },
    {
        id: "3",
        name: "card3",
        zIndex: 0,
        width: 40,
        height: 55,
        top: 0,
        left: 0,
        disabled: false,
        isHidden: false
    },
    {
        id: "4",
        name: "card4",
        zIndex: 0,
        width: 40,
        height: 55,
        top: 0,
        left: 0,
        disabled: false,
        isHidden: false
    }
]



function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(1);
    const [boardItem, setBoardItem] = useState<BoardProps["items"]>({
        "5": {
            id: "5",
            name: "card5",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0
        }
    });
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>(cards);


    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta, activatorEvent, collisions } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        if (over && over.id === 'Board') {
            setBoardItem((currItem) => {
                item.left = activatorEvent.target?.getBoundingClientRect().left - over.rect.left;
                item.top = activatorEvent.target?.getBoundingClientRect().top - over.rect.top;
                currItem[item.id] = item;
                return currItem;
            });
            const newHanditem = handItem.filter((curr) => curr.id !== item.id);
            setHandItem(newHanditem);
        } else if (over && over.id === "Hand") {
            console.log("over Hand", event);
            // delete from broad
            setBoardItem((currItem) => {
                delete currItem[item.id];
                return currItem;
            })
            // add to hand
            setHandItem((currHandItem) => {
                // check if exists
                const index = currHandItem.findIndex((curr) => curr.id === item.id)
                if (index === -1) {
                    // else add
                    currHandItem.push(item);
                } else {
                    currHandItem[index] = item;
                }
                return currHandItem;
            })
        }
    }

    function handleDragStart(event: DragStartEvent) {
        console.log("on drag start:");
        const { active } = event;
        const item = active.data.current as DraggableProps["item"] | undefined;
        if (!item) return;
        if (item.zIndex < highestZIndex) {
            item.zIndex = highestZIndex;
            setHighestZIndex(highestZIndex + 1);
        }

    }


    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                border: "1px solid black"
            }}>
                <Board items={boardItem} setItems={setBoardItem} />
                <Hand cards={handItem} setItems={setHandItem}></Hand>
            </div>
        </DndContext >
    );
}

export default GameScreen;
