import {
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import Draggable, { DraggableProps } from "./Draggable";
import { useDroppable } from "@dnd-kit/core";

export type HandProps = {
    cards: DraggableProps["item"][];
    setItems: (value: React.SetStateAction<DraggableProps["item"][]>) => void;
};

const Hand = ({ cards, setItems }: HandProps) => {
    const { setNodeRef } = useDroppable({
        id: "Hand",
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                // border: "1px solid lightblue",
                // position: "relative",
                backgroundColor: "lightblue",
                display: "flex",
                minWidth: "70%",
                minHeight: "100px",
                // padding: "5px",
                // display: "flex",
                // gap: "5px"
            }}
        >
            {cards.map((card) => (
                <div
                    key={card.id}
                    style={{
                        position: "relative",

                        top: card.top ?? 0,
                        left: card.left ?? 0,
                    }}
                >
                    <Draggable
                        item={card}
                        setAttribute={(id, key, value) =>
                            setItems((currItems) => {
                                const index = currItems.findIndex(
                                    (curr) => curr.id === id
                                );
                                currItems[index][key] = value;
                                return currItems;
                            })
                        }
                    />
                </div>
            ))}
        </div>
    );
};

export default Hand;
