import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import Draggable, { DraggableProps } from "./DraggableItem";
import { useDroppable } from '@dnd-kit/core';
import SortableItem from "./SortableItem";

export type HandProps = {
    cards: DraggableProps["item"][]
}

const Hand = ({ cards }: HandProps) => {
    const { setNodeRef } = useDroppable({
        id: 'Hand',
        data: cards
    });


    return (
        <div
            ref={setNodeRef}
            style={{
                border: "1px solid black",
                padding: "0px 5px 0px 5px",
                display: "flex",
                minWidth: "400px",
                gap: "5px"
            }}>
            <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
                {cards.map(card => <SortableItem key={card.id} item={card} />)}
            </SortableContext>
        </div>
    )
}

export default Hand;