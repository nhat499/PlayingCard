import { useEffect, useMemo, useState } from "react";
import Draggable, { item } from "./Draggable";
import DraggableOptions from "./DraggableOptions";
import { socket } from "../socket/Socket";
import { useGameState, useItemAction, useUser } from "../atom/userAtom";
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
    const { isItemAction, setIsItemAction } = useItemAction();
    const [openDialog, setOpenDialog] = useState(false);
    const [isRotate, setIsRotate] = useState(false);
    const [sliderValue, setSliderValue] = useState(card.rotate);
    const { gameStates } = useGameState();
    if (!user) {
        throw Error("user not found");
    }

    useEffect(() => {
        if (!isItemAction && isRotate) {
            setIsRotate(false);
        }
    }, [isItemAction]);

    const CardMemo = useMemo(() => {
        return (
            <div
                style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: card.top,
                    left: card.left,
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setOpenDialog(true);
                }}
            >
                {isRotate && (
                    <input
                        style={{ position: "absolute", top: "-30px" }}
                        type={"range"}
                        tabIndex={0}
                        value={sliderValue}
                        min={-180}
                        max={180}
                        onMouseUp={() => {
                            if (card.parent === gameObj.BOARD) {
                                socket.emit("DropOnBoard", {
                                    item: card,
                                    player: user,
                                });
                            }
                            setIsItemAction(false);
                            setIsRotate(false);
                        }}
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSliderValue(parseInt(e.target.value));
                            card.rotate = sliderValue;
                            socket.emit("OnBoardDrag", {
                                item: card,
                                player: user,
                            });
                        }}
                    />
                )}
                <Draggable
                    item={{
                        ...card,
                    }}
                    Children={({ listeners }) => (
                        <Polygon
                            height={card.height}
                            sides={card.sides}
                            width={card.width}
                            rotate={card.rotate}
                            color={card.isHidden ? "brown" : card.color}
                            listeners={listeners}
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

                {!disableOptions && (
                    <DraggableOptions
                        openDialog={openDialog}
                        setOpenDialog={setOpenDialog}
                        zIndex={gameStates?.maxZIndex ?? card.zIndex + 1}
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
                                    backgroundColor: "blue",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setIsItemAction(true);
                                    setIsRotate(true);
                                    setOpenDialog(false);
                                }}
                            >
                                rotate
                            </button>
                        </div>
                    </DraggableOptions>
                )}
            </div>
        );
    }, [
        card.id,
        card.top,
        card.left,
        card.rotate,
        card.transform,
        card.disabled,
        card.zIndex,
        card.parent,
        card.isHidden,
        sliderValue,
        isRotate,
        openDialog,
        gameStates?.maxZIndex,
    ]);
    return CardMemo;
};

export default Card;
