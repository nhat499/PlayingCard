import { useEffect, useState } from "react";
import Board from "../components/Board";
import Hand from "../components/Hand";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import { socket } from "../socket/Socket";
import { useParams } from "react-router-dom";
import AddItemPopup from "../components/AddItemPopup";
import ChatBox from "../components/ChatBox";
import { useGameState, useUser } from "../atom/userAtom";
import {
    gameObj,
    Item,
    Player,
    Room,
    Stack,
} from "../../../server/src/interfaces/gameStateInterface";

function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(2);
    const { roomId } = useParams();
    const { gameStates } = useGameState();
    const { user } = useUser();
    if (!gameStates || !roomId || !user) {
        throw Error("User || roomId States Not found");
    }
    // console.log("i am gameStates", gameStates.setting.window);
    const [boardItem, setBoardItem] = useState<Room["board"]>(gameStates.board);
    const [handItem, setHandItem] = useState<Player["hand"]>({});
    const [openAddItemPopup, setOpenAddItemPopup] = useState<boolean>(false);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta } = event;
        const item = active.data.current as Item | Stack | undefined;
        if (!item || !user || !over) return;
        if (over.id === gameObj.BOARD) {
            let updateItem = boardItem[item.id];

            // if item is already on the board;
            if (updateItem) {
                updateItem.left += delta.x;
                updateItem.top += delta.y;
            } else {
                // item is not already on the board;
                updateItem = { ...item };
                updateItem.top = 300;
                updateItem.left = 200;
            }

            socket.emit("DropOnBoard", {
                item: updateItem,
                player: user,
            });
        } else if (
            over.id === gameObj.HAND &&
            !("data" in item) // stack have data field
        ) {
            if (!handItem[item.id]) {
                // add to hand
                socket.emit("DropOnHand", { item, player: user });
            } else {
                // move in hand
                setHandItem((currHandItem) => {
                    item.left += delta.x;
                    item.top += delta.y;
                    currHandItem[item.id] = { ...item };
                    return currHandItem;
                });
            }
        } else if (over.id.toString() && !("data" in item)) {
            if (over.id.toString().startsWith(gameObj.STACK)) {
                socket.emit("DropOnStack", {
                    item,
                    player: user,
                    stackId: over.id.toString(),
                });
            }
        }
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const item = active.data.current as Item | undefined;
        if (!item) return;

        if (
            boardItem[item.id] &&
            item.zIndex < highestZIndex &&
            !item.id.startsWith(gameObj.STACK)
        ) {
            item.zIndex = highestZIndex;
            setBoardItem((currBoardItem) => {
                currBoardItem[item.id] = item;
                return { ...currBoardItem };
            });
            setHighestZIndex(highestZIndex + 1);
        }
    }

    function handleDragMove(event: DragMoveEvent) {
        const updateItem = { ...event.active.data.current } as Item | Stack;
        if (user && updateItem && event.over?.id === gameObj.BOARD) {
            updateItem.transform = `translate3d(${event.delta.x}px, ${event.delta.y}px, 0)`;
            socket.emit("OnBoardDrag", {
                item: updateItem,
                player: user
            });
        }
    }

    useEffect(() => {
        socket.on("BoardUpdate", ({ item, player, board }) => {
            setBoardItem(board);
        });

        socket.on("AddToHand", ({ item, player }) => {
            setHandItem((prevItem) => {
                const newItem = { ...prevItem };
                newItem[item.id] = item;
                return newItem;
            });
        });

        socket.on("RemoveFromHand", ({ item }) => {
            setHandItem((prevItem) => {
                const newItem = { ...prevItem };
                delete newItem[item.id];
                return newItem;
            });
        });

        socket.on("OnBoardDrag", ({ item, player }) => {
            setBoardItem((currItem) => {
                currItem[item.id] = item;
                return { ...currItem };
            });
        });

        return () => {
            console.log("disconnection?");
            socket.off("BoardUpdate");
            socket.off("AddToHand");
            socket.off("RemoveFromHand");
            socket.off("OnBoardDrag");
            // socket.off("DropOnBoard");
        };
    }, []);

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr",
                    gap: "10px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "10px", // Increased gap for better spacing
                        borderRadius: "12px", // Rounded corners for a modern touch
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                        overflow: "hidden",
                    }}
                >
                    <Board
                        size={gameStates.setting.window}
                        items={boardItem}
                        setItems={setBoardItem}
                    // isDragging={isDragging}
                    />

                    <Hand cards={handItem} setItems={setHandItem} />
                </div>

                <div
                    style={{
                        // width: "100%",
                        // maxHeight: "parent",
                        backgroundColor: "#e6f7ff", // Soft light blue
                        border: "5px solid #a7c7dc", // Light border to frame the board
                        borderRadius: "12px", // Rounded corners for a modern touch
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        // overflow: "hidden"
                    }}
                >
                    <AddItemPopup
                        open={openAddItemPopup}
                        setOpen={setOpenAddItemPopup}
                        setBoardItem={setBoardItem}
                    />
                    {!openAddItemPopup && (
                        <button
                            style={{
                                padding: "8px 16px",
                                margin: "20px",
                                // width: "70%",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                                boxShadow: "0 2px 5px rgba(0, 123, 255, 0.2)",
                                transition: "background-color 0.2s",
                            }}
                            onClick={() => setOpenAddItemPopup(true)}
                        >
                            Add Item
                        </button>
                    )}

                    <ChatBox />
                </div>
            </div>
        </DndContext>
    );
}

export default GameScreen;
