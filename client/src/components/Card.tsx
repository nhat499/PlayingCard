import { useState } from "react";
import Draggable, { item } from "./Draggable";
import DraggableOptions from "./DraggableOptions";
import { socket } from "../socket/Socket";
// import { Polygon } from "@html-polygon/react";
import { useUser } from "../atom/userAtom";
import { gameObj } from "../../../server/src/interfaces/gameStateInterface";
import Polygon from "./Polygon";

export type CardProps = {
    card: item & {
        color: string;
        width: number;
        height: number;
        isHidden: boolean;
        sides: number;
    };
    disableOptions: boolean;
};

const Card = ({ card, disableOptions }: CardProps) => {
    const { user } = useUser();
    const [openDialog, setOpenDialog] = useState(false);
    if (!user) {
        throw Error("user not found");
    }
    return (
        <div
            style={{
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                marginBottom: "10px", // Add spacing between cards
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                setOpenDialog(true);
            }}
        >
            {!disableOptions && (
                <DraggableOptions
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    zIndex={card.zIndex + 1}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => {
                                socket.emit("LockCard", {
                                    player: user,
                                    item: card,
                                });
                                setOpenDialog(false);
                            }}
                        >
                            {card.disabled ? "unlock" : "lock"}
                        </button>
                        <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => {
                                if (card.parent === gameObj.BOARD) {
                                    socket.emit("FlipCard", {
                                        player: user,
                                        item: card,
                                    });
                                }
                                card.isHidden = !card.isHidden;
                                setOpenDialog(false);
                            }}
                        >
                            flip
                        </button>
                        <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "bisque",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => {
                                // socket.emit("LockCard", {
                                //     player: user,
                                //     item: card,
                                // });
                                // setOpenDialog(false);
                            }}
                        >
                            rotate
                        </button>
                    </div>
                </DraggableOptions>
            )}
            <Draggable
                item={{
                    ...card,
                }}
                Children={() => (
                    <Polygon
                        height={card.height}
                        sides={card.sides}
                        width={card.width}
                        rotate={card.rotate}
                        color={card.color}
                    >
                        <div
                            style={{
                                wordWrap: "normal",
                                overflowWrap: "break-word",
                                textOverflow: "ellipsis",
                                fontSize: "16px",
                            }}
                        >
                            {card.isHidden ? "hidden" : card.name}
                        </div>
                    </Polygon>
                )}
            />
        </div>
    );
};

export default Card;
