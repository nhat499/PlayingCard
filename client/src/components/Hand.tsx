import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import Draggable, { DraggableProps } from "./Draggable";
import { useDroppable } from '@dnd-kit/core';

export type HandProps = {
    cards: DraggableProps["item"][];
    setItems: (value: React.SetStateAction<DraggableProps["item"][]>) => void
}

const Hand = ({ cards, setItems }: HandProps) => {
    const { setNodeRef } = useDroppable({
        id: 'Hand',
    });


    return (
        <div
            ref={setNodeRef}
            style={{
                border: "1px solid lightblue",
                backgroundColor: "lightcyan",
                minWidth: "500px",
                minHeight: "50px",
                padding: "5px",
                display: "flex",
                gap: "5px"
            }}>
            {cards.map(card => <Draggable key={card.id} item={card}
                setAttribute={(id, key, value) => setItems(currItems => {
                    const index = currItems.findIndex((curr) => curr.id === id);
                    currItems[index][key] = value;
                    return currItems;
                })}
            />)}
        </div>
    )
}

export default Hand;