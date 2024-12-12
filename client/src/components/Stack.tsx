import { useDroppable } from "@dnd-kit/core";
import Draggable, { item } from "./Draggable";
import { useMemo, useState } from "react";
import { socket } from "../socket/Socket";
import DraggableOptions from "./DraggableOptions";
import Card, { CardProps } from "./Card";
import { useGameState, useUser } from "../atom/userAtom";

export type StackProps = {
    stack: item & { data: CardProps["card"][]; width: number; height: number };
};

const Stack = ({ stack }: StackProps) => {
    const { setNodeRef: setDropRef } = useDroppable({
        id: stack.id,
    });
    const { gameStates } = useGameState();
    const { user } = useUser();

    if (!user) {
        throw Error("user Not found");
    }
    const [openDialog, setOpenDialog] = useState(false);

    const StackMemo = useMemo(() => {
        return (
            <div
                style={{
                    position: "absolute",

                    top: stack.top,
                    left: stack.left,
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setOpenDialog(true);
                }}
            >
                {/* Draggable Stack */}
                <Draggable
                    item={{ ...stack }}
                    Children={({ isDragging, listeners }) => (
                        <div
                            style={{
                                cursor: "move",
                                position: "relative",
                                border: "2px solid #007bff",
                                paddingTop: "5px",
                                borderRadius: "10px",
                                backgroundColor: "white",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                            {...listeners}
                        >
                            <div>{stack.data.length}</div>
                            <div
                                ref={!isDragging ? setDropRef : undefined}
                                style={{
                                    position: "relative",
                                    width: stack.width,
                                    height: stack.height,
                                }}
                            >
                                {stack.data.length > 0 && (
                                    <Card
                                        card={stack.data[stack.data.length - 1]}
                                        disableOptions={true}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                />
                {/* Context Menu (Draggable Options) */}
                <DraggableOptions
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    zIndex={gameStates?.maxZIndex ?? stack.zIndex + 1}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <button
                            onClick={() => {
                                if (stack.data.length < 1) return;
                                socket.emit("DealItem", {
                                    player: user,
                                    amount: 1,
                                    stack,
                                });
                                setOpenDialog(false);
                            }}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                // transition: "all 0.3s ease",
                            }}
                        >
                            Deal
                        </button>
                        <button
                            onClick={() => {
                                socket.emit("ShuffleStack", {
                                    player: user,
                                    stack,
                                });
                                setOpenDialog(false);
                            }}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                // transition: "all 0.3s ease",
                            }}
                        >
                            Shuffle
                        </button>

                        <button
                            onClick={() => {
                                if (stack.data.length < 1) return;
                                socket.emit("FlipStack", {
                                    player: user,
                                    stack,
                                });
                                setOpenDialog(false);
                            }}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                // transition: "all 0.3s ease",
                            }}
                        >
                            Flip
                        </button>
                    </div>
                </DraggableOptions>
            </div>
        );
    }, [
        openDialog,
        stack.top,
        stack.left,
        stack.data[0]?.isHidden,
        stack.data[0]?.id,
        stack.data.length,
        stack.transform,
        gameStates?.maxZIndex,
        setDropRef,
    ]);
    return StackMemo;
};

export default Stack;
