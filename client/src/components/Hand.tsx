import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import {
    gameObj,
    Item,
    Player,
} from "../../../server/src/interfaces/gameStateInterface";

export type HandProps = {
    cards: Player["hand"];
};

const Hand = ({ cards }: HandProps) => {
    const { setNodeRef } = useDroppable({
        id: gameObj.HAND,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                backgroundColor: "#e6f7ff", // Subtle blue background for distinction
                borderRadius: "8px", // Rounded corners for a cohesive design
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)", // Soft shadow for subtle depth
                display: "flex",
                minHeight: "100px",
                border: "5px solid #a7c7dc", // Light border to frame the board
            }}
        >
            {Object.entries(cards).map(([, item]) => (
                <div
                    key={item.id}
                    style={{
                        position: "relative",
                        top: item.top,
                        left: item.left,
                    }}
                >
                    {item.id.startsWith(gameObj.ITEM) && (
                        <Card card={item as Item} disableOptions={false} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Hand;
