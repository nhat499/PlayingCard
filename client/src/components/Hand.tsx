import { DraggableProps } from "./Draggable";
import { useDroppable } from "@dnd-kit/core";
import { BoardProps } from "./Board";
import Card, { CardProps } from "./Card";

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
                padding: "10px", // Padding for spacing
                backgroundColor: "#e6f7ff", // Subtle blue background for distinction
                borderRadius: "8px", // Rounded corners for a cohesive design
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)", // Soft shadow for subtle depth
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100px",
                border: "5px solid #a7c7dc", // Light border to frame the board
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
