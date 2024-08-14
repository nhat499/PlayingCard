import { useState } from "react";
import Board, { BoardProps } from "./Board";
import Hand, { HandProps } from "./Hand";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableProps } from "./Draggable";

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

    const [boardItem, setBoardItem] = useState<BoardProps["items"]>({});
    const [handItem, setHandItem] = useState<DraggableProps["item"][]>(cards);


    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta, activatorEvent, collisions } = event;

        console.log("i am activatorEvent", event);
        console.log(activatorEvent.target.getBoundingClientRect().left, activatorEvent.target.getBoundingClientRect().top);
        console.log(over.rect.left, over.rect.top)
        if (!(over && over.id === 'droppable')) return;



        const item: DraggableProps["item"] | undefined = active.data.current
        if (!item) return;
        setBoardItem((currItem) => {
            item.left = activatorEvent.target.getBoundingClientRect().left - over.rect.left;
            item.top = activatorEvent.target.getBoundingClientRect().top - over.rect.top;
            currItem[item.id] = item;
            return currItem;
        });
        const newHanditem = handItem.filter((curr) => curr.id !== item.id);
        setHandItem(newHanditem);
    }

    return (
        <DndContext
            onDragEnd={handleDragEnd}
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
