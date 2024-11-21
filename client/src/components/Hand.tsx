import {
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import Draggable, { DraggableProps } from "./Draggable";
import { useDroppable } from "@dnd-kit/core";
import { BoardProps } from "./Board";
import Card, { CardProps } from "./Card";

export type HandProps = {
    cards: DraggableProps["item"][];
    setItems: (value: React.SetStateAction<DraggableProps["item"][]>) => void;
    boardSize: BoardProps["size"];
};

const Hand = ({ cards, setItems, boardSize }: HandProps) => {
    const { setNodeRef } = useDroppable({
        id: "Hand",
    });
    console.log("i am hand cards", cards);
    return (
        <div
            ref={setNodeRef}
            style={{
                // border: "1px solid lightblue",
                // position: "relative",
                backgroundColor: "lightblue",
                display: "flex",
                minWidth: `${boardSize.width}px`,
                minHeight: "100px",
                // padding: "5px",
                // display: "flex",
                // gap: "5px"
            }}
        >
            {cards.map((item) => (
                <div
                    key={item.id}
                    style={{
                        position: "relative",

                        top: item.top ?? 0,
                        left: item.left ?? 0,
                    }}
                >
                    {item.id.startsWith("card") && (
                        <Card
                            card={item as CardProps["card"]}
                            setAttribute={(id, key, value) =>
                                setItems((currItems) => {
                                    currItems[id][key] = value;
                                    return currItems;
                                })
                            }
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Hand;
