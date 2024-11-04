import { useState } from "react";
import Draggable, { item } from "./Draggable";
import DraggableOptions from "./DraggableOptions";
import { socket } from "../socket/Socket";
import { useParams } from "react-router-dom";
import { Polygon } from "@html-polygon/react";

export type CardProps = {
    card: item & {
        color: string;
        width: number;
        height: number;
        isHidden: boolean;
        sides: number;
    };
    setAttribute?: (
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
            {setAttribute && (
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
            )}
            <Draggable
                item={{
                    ...card,
                }}
                Children={(isDragging) => (
                    <Polygon
                        sides={card.sides}
                        rotate={card.rotate}
                        borderColor="black"
                        borderWidth={1}
                        stable
                        style={{
                            width: `${card.width + 20}px`,
                            height: `${card.height + 30}px`,
                            backgroundColor: card.color ?? "white",
                            textAlign: "center",
                        }}
                    >
                        {card.isHidden ? "hidden" : card.name}
                    </Polygon>
                )}
            />
        </div>
    );
};

export default Card;
