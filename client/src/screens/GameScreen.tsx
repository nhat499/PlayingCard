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
import { useBoardScale, useGameState, useUser } from "../atom/userAtom";
import {
    gameObj,
    Item,
    Player,
    Room,
    Stack,
} from "../../../server/src/interfaces/gameStateInterface";
import PlayerIconList from "../components/PlayerIconList";
import SubSection from "../components/subSection";

function GameScreen() {
    const [highestZIndex, setHighestZIndex] = useState<number>(2);
    const { roomId } = useParams();
    const { gameStates } = useGameState();
    const { boardScale, setBoardScale } = useBoardScale();
    const { user } = useUser();
    if (!gameStates || !roomId || !user) {
        throw Error("User || roomId States Not found");
    }
    const [boardItem, setBoardItem] = useState<Room["board"]>(gameStates.board);
    const [handItem, setHandItem] = useState<Player["hand"]>({});
    const [isItemDrag, setIsItemDrag] = useState(false);
    const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta } = event;
        console.log(over, active);
        const item = active.data.current as Item | Stack | undefined;
        if (!item || !user || !over) return;
        if (over.id === gameObj.BOARD) {
            let updateItem = boardItem[item.id];
            const stack = gameStates?.board[item.parent];
            // if item is already on the board;
            if (updateItem) {
                updateItem.left = updateItem.left + delta.x / boardScale;
                updateItem.top = updateItem.top + delta.y / boardScale;
            } else if (item.parent.startsWith(gameObj.STACK) && stack) {
                updateItem = { ...item };
                updateItem.top = stack.top + delta.y / boardScale;
                updateItem.left = stack.left + delta.x / boardScale;
            } else {
                // item is not already on the board;
                updateItem = { ...item };
                // correct without scale
                // updateItem.left = updateItem.left - boardPosition.x + delta.x;

                const scaleDeltaX = delta.x / boardScale;
                const postXScale = boardPosition.x / boardScale;
                updateItem.left = updateItem.left - postXScale + scaleDeltaX;

                // correct with scale
                // const deltaY = over.rect.top + delta.y + item.height;
                // const scaleDeltaY = deltaY / boardScale;
                // const postYScale = boardPosition.y / boardScale;
                // updateItem.top = updateItem.top + postYScale + scaleDeltaY;

                // correct without scale
                // updateItem.top =
                //     over.rect.bottom -
                //     over.rect.top +
                //     delta.y -
                //     boardPosition.y;
                // updateItem.top /= boardScale;
                updateItem.top = delta.y;
                updateItem.top += over.rect.bottom;
                updateItem.top -= over.rect.top;
                updateItem.top -= boardPosition.y;
                updateItem.top /= boardScale;

                // updateItem.top /= boardScale;
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
                item.top = 0;
                item.left = 0;
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
        setIsItemDrag(false);
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const item = active.data.current as Item | undefined;
        if (!item) return;
        setIsItemDrag(true);
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
            updateItem.transform = `translate3d(${event.delta.x / boardScale}px, ${event.delta.y / boardScale}px, 0)`;
            socket.emit("OnBoardDrag", {
                item: updateItem,
                player: user,
            });
        }
    }

    useEffect(() => {
        socket.on("BoardUpdate", ({ board }) => {
            setBoardItem(board);
        });

        socket.on("AddToHand", ({ item }) => {
            console.log("i am item added to hand", item);
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

        socket.on("OnBoardDrag", ({ item }) => {
            setBoardItem((currItem) => {
                currItem[item.id] = item;
                return { ...currItem };
            });
        });

        socket.on("ReceiveItem", ({ newItems }) => {
            setHandItem((prevHand) => {
                const newHand = { ...prevHand, ...newItems };
                return newHand;
            });
        });

        return () => {
            socket.off("BoardUpdate");
            socket.off("AddToHand");
            socket.off("RemoveFromHand");
            socket.off("OnBoardDrag");
            socket.off("ReceiveItem");
        };
    }, []);

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
        >
            <PlayerIconList players={gameStates.players} />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "4fr 1fr",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        // display: "grid",
                        // gridTemplateColumns: "4fr 1fr",
                        // gap: "10px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            overflowAnchor: "auto",
                        }}
                    >
                        <Board
                            size={gameStates.setting.window}
                            boardPosition={boardPosition}
                            setBoardPosition={setBoardPosition}
                            items={boardItem}
                            setItems={setBoardItem}
                            itemDragging={isItemDrag}
                            boardScale={boardScale}
                            setBoardScale={setBoardScale}
                        />

                        <Hand cards={handItem} />
                    </div>
                </div>
                <SubSection />
            </div>
        </DndContext>
    );
}

export default GameScreen;
