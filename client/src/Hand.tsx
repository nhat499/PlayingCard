import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import Draggable, { DraggableProps } from "./Draggable";
import { useDroppable } from '@dnd-kit/core';

export type HandProps = {
    cards: DraggableProps["item"][]
}

const Hand = ({ cards }: HandProps) => {
    const { setNodeRef } = useDroppable({
        id: 'Hand',
    });


    return (
        <div
            ref={setNodeRef}
            style={{
                border: "1px solid black",
                padding: "0px 5px 0px 5px",
                display: "flex",
                gap: "5px"
            }}>
            <SortableContext items={cards}>
                {cards.map(card => <Draggable key={card.id} item={card} />)}
            </SortableContext>
        </div>
    )
}

export default Hand;