import { useState } from "react";
import Board, { BoardProps } from "./Board";
import Hand, { HandProps } from "./Hand";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, PointerSensor, useSensor, useSensors, DragOverEvent, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { DraggableProps } from "./DraggableItem";

const cards: DraggableProps["item"][] = [
    {
        id: "1",
        name: "card1",
        width: 40,
        height: 55,
        top: 0,
        left: 0
    },
    {
        id: "2",
        name: "card2",
        width: 40,
        height: 55,
        top: 0,
        left: 0
    },
    {
        id: "3",
        name: "card3",
        width: 40,
        height: 55,
        top: 0,
        left: 0
    },
    {
        id: "4",
        name: "card4",
        width: 40,
        height: 55,
        top: 0,
        left: 0
    }
]



function GameScreen() {

    const [boardItem, setBoardItem] = useState<BoardProps["items"]>({
        "5": {
            id: "5",
            name: "card5",
            width: 40,
            height: 55,
            top: 0,
            left: 0
        }
    });
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>(cards);


    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta, activatorEvent, collisions } = event;
        const item: DraggableProps["item"] | undefined = active.data.current
        if (!item) return;
        if (over && over.id === 'Board') {
            setBoardItem((currItem) => {
                item.left = activatorEvent.target.getBoundingClientRect().left - over.rect.left;
                item.top = activatorEvent.target.getBoundingClientRect().top - over.rect.top;
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
                const a = currHandItem.find((curr) => curr.id === item.id)
                if (!a) {
                    // else add
                    currHandItem.push(item);
                }
                return currHandItem;
            })
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { activatorEvent, active, collisions, delta, over } = event;
        if (!over) return;

        console.log("i am dragOver:", active, over);

    }


    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            collisionDetection={(args) => {
                // only detect if point is in contatiner
                const pointerCollisions = pointerWithin(args);
                if (pointerCollisions.length > 0) {
                    return pointerCollisions;
                }
                return []
            }}
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
                <Board items={boardItem} />
                <Hand cards={handItem}></Hand>
            </div>
        </DndContext >
    );
}

export default GameScreen;
