import { useDroppable } from "@dnd-kit/core";
import Draggable, { item } from "./Draggable";
import { useState } from "react";
import { socket } from "../socket/Socket";
import DraggableOptions from "./DraggableOptions";
import Card, { CardProps } from "./Card";
import { useUser } from "../atom/userAtom";

export type StackProps = {
    stack: item & { data: CardProps["card"][]; width: number; height: number };
};

const Stack = ({ stack }: StackProps) => {
    const { setNodeRef: setDropRef } = useDroppable({
        id: stack.id,
    });

    const { user } = useUser();

    if (!user) {
        throw Error("user Not found");
    }
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                cursor: "pointer",
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                setOpenDialog(true);
            }}
        >
            {/* Context Menu (Draggable Options) */}
            <DraggableOptions
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                zIndex={stack.zIndex + 1}
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
                            // shuffle(stack.data);
                            // socket.emit("ShuffleStack", {
                            //     roomId,
                            //     stackId: stack.id,
                            //     stackData: stack.data,
                            // });

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
                            transition: "all 0.3s ease",
                        }}
                    >
                        Shuffle
                    </button>

                    <button
                        onClick={() => {
                            if (stack.data.length < 1) return;
                            // flipAll(stack.data, !stack.data[0].isHidden);
                            // socket.emit("FlipStack", {
                            //     roomId,
                            //     stackId: stack.id,
                            //     stackData: stack.data,
                            // });

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
                            transition: "all 0.3s ease",
                        }}
                    >
                        Flip
                    </button>
                </div>
            </DraggableOptions>

            {/* Draggable Stack */}
            <Draggable
                item={{ ...stack }}
                Children={(isDragging) => (
                    <div
                        style={{
                            position: "relative",
                            border: "2px solid #007bff",
                            paddingTop: "5px",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.2s ease",
                            opacity: isDragging ? 0.6 : 1,
                        }}
                    >
                        <div
                            ref={!isDragging ? setDropRef : undefined}
                            style={{
                                width: stack.width + 20,
                                height: stack.height + 30,
                                position: "relative",
                                // display: "flex",
                                // alignItems: "center",
                                // justifyContent: "center",
                            }}
                        >
                            {/* {stack.data?.map((item) => {
                                return <Card key={item.id} card={item} />;
                            })} */}
                            {stack.data.length > 0 &&
                                <Card
                                    card={stack.data[stack.data.length - 1]}
                                    disableOptions={true}
                                />}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default Stack;
