import { useEffect, useState } from "react";
import Draggable, { item } from "./Draggable";
import DraggableOptions from "./DraggableOptions";
import { socket } from "../socket/Socket";
import { useParams } from "react-router-dom";

export type CardProps = {
    card: item & { width: number; height: number; isHidden: boolean };
    // data: item[];
    setAttribute: (
        itemId: string,
        key: string,
        value: string | number | boolean
    ) => void;
};

const Card = ({ card, setAttribute }: CardProps) => {
    const { roomId } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                setOpenDialog(true);
            }}
        >
            <DraggableOptions
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                zIndex={card.zIndex + 1}
                // setAttribute={setAttribute}
            >
                <button
                    onClick={(e) => {
                        setAttribute(card.id, "disabled", !card.disabled);

                        setOpenDialog(false);
                    }}
                >
                    {card.disabled ? "unlock" : "lock"}
                </button>
                <button
                    onClick={(e) => {
                        // setAttribute(card.id, "isHidden", !card.isHidden);
                        socket.emit("FlipCard", {
                            roomId,
                            itemId: card.id,
                            value: !card.isHidden,
                        });
                        setOpenDialog(false);
                    }}
                >
                    flip
                </button>
            </DraggableOptions>
            <Draggable
                item={{
                    ...card,
                }}
                Children={(isDragging) => (
                    <div
                        style={{
                            width: `${card.width}px`,
                            height: `${card.height}px`,
                            border: "1px solid black",
                            transform: `rotate(${card.rotate}deg)`,
                        }}
                    >
                        <div
                            style={{
                                transform: `rotate(-${card.rotate}deg)`,
                            }}
                        >
                            {card.isHidden ? "hidden" : card.name}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default Card;
