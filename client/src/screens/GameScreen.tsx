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
import {
    useBoardScale,
    useGameState,
    useItemAction,
    useUser,
} from "../atom/userAtom";
import {
    gameObj,
    Item,
    Player,
    Room,
    Stack,
} from "../../../server/src/interfaces/gameStateInterface";
import SubSection from "../components/subSection";
import HandButton from "../components/HandButtons";
import DraggableOptions from "../components/DraggableOptions";

function GameScreen() {
    const { roomId } = useParams();
    const { gameStates, setGameStates } = useGameState();
    // const [highestZIndex, setHighestZIndex] = useState<number>(
    //     gameStates?.maxZIndex ?? 1
    // );
    const { setIsItemAction } = useItemAction();
    const { boardScale, setBoardScale } = useBoardScale();
    const { user, setUser } = useUser();

    const [boardItem, setBoardItem] = useState<Room["board"]>(
        gameStates?.board ?? {}
    );
    const [handItem, setHandItem] = useState<Player["hand"]>({});
    // const [isItemDrag, setIsItemDrag] = useState(false);

    const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta } = event;
        const item = active.data.current as Item | Stack | undefined;
        if (!item || !item.id || !user || !over) return;
        if (over.id === gameObj.BOARD) {
            let updateItem = boardItem[item.id];
            const stack = boardItem[item.parent];
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

                // get location x
                updateItem.left += delta.x;
                updateItem.left -= boardPosition.x;
                updateItem.left /= boardScale;

                // get location y
                updateItem.top = over.rect.height + delta.y + 20;
                updateItem.top -= boardPosition.y;
                updateItem.top /= boardScale;
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
                const stack = boardItem[item.parent];
                // let updateItem = boardItem[item.id];
                item.top = 10;
                if (stack && item.parent.startsWith(gameObj.STACK)) {
                    item.left = stack.left;
                }

                item.left += delta.x;
                item.left += boardPosition.x;
                item.left *= boardScale;

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
        } else if ("data" in item) {
            // drop a stack in hand or anther stack
            socket.emit("DropOnBoard", {
                item,
                player: user,
            });
        }
        setIsItemAction(false);
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const item = active.data.current as Item | undefined;
        if (!item) return;
        setIsItemAction(true);
        if (
            boardItem[item.id] &&
            // item.zIndex < highestZIndex &&
            !item.id.startsWith(gameObj.STACK)
        ) {
            item.zIndex = gameStates?.maxZIndex ?? 0;
            setBoardItem((currBoardItem) => {
                currBoardItem[item.id] = item;
                return { ...currBoardItem };
            });
        }
    }

    function handleDragMove(event: DragMoveEvent) {
        const updateItem = { ...event.active.data.current } as Item | Stack;
        if (
            user &&
            updateItem &&
            event.over?.id === gameObj.BOARD &&
            updateItem.parent === gameObj.BOARD
        ) {
            // only show drag if they are on the board
            updateItem.transform = `translate3d(${event.delta.x / boardScale}px, ${event.delta.y / boardScale}px, 0)`;
            socket.emit("OnBoardDrag", {
                item: updateItem,
                player: user,
            });
        }
        // else if (
        //     user &&
        //     updateItem.parent.startsWith(gameObj.STACK) &&
        //     !("data" in updateItem)
        // ) {
        //     socket.emit("DragFromStack", {
        //         item: updateItem,
        //         player: user,
        //     });
        // }
    }

    useEffect(() => {
        socket.on("RequestStates", ({ roomState }) => {
            console.log("i am roomStates", roomState);
            setGameStates(roomState);
            setBoardItem(roomState.board);
        });

        socket.on("BoardUpdate", ({ board }) => {
            setBoardItem(board);
        });

        socket.on("AddToHand", ({ item }) => {
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

        socket.on("MaxZIndex", ({ zIndex }) => {
            // setHighestZIndex(zIndex);
            console.log("i am zindex:", zIndex);
            setGameStates((prevGameState) => {
                if (!prevGameState) return prevGameState;
                const currGameStates = { ...prevGameState };
                currGameStates.maxZIndex = zIndex;
                return currGameStates;
            });
        });

        return () => {
            socket.off("RequestStates");
            socket.off("BoardUpdate");
            socket.off("AddToHand");
            socket.off("RemoveFromHand");
            socket.off("OnBoardDrag");
            socket.off("ReceiveItem");
            socket.off("MaxZIndex");
        };
    }, []);

    if (!roomId) {
        throw Error("roomId Not found");
    }

    if (!user) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const reUser = JSON.parse(storedUser);
            setUser(reUser);
        } else {
            throw Error("User not found");
        }
    }

    if (!gameStates) {
        // get game states somehow
        // setGameStates({
        //     board: {},
        //     maxZIndex: 0,
        //     players: [],
        //     setting: { window: { height: 500, width: 700 } },
        // });
        // throw Error("No game statues");
        if (user) {
            return (
                <button
                    onClick={() => {
                        socket.emit("RequestRoomStates", {
                            player: user,
                            roomId,
                        });
                    }}
                >
                    reconnect
                </button>
            );
        } else {
            throw Error("User not found");
        }
    }

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "4fr 1fr",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            flexDirection: "column",
                            overflowAnchor: "auto",
                        }}
                    >
                        <Board
                            size={gameStates.setting.window}
                            boardPosition={boardPosition}
                            setBoardPosition={setBoardPosition}
                            items={boardItem}
                            setItems={setBoardItem}
                            // itemDragging={isItemDrag}
                            boardScale={boardScale}
                            setBoardScale={setBoardScale}
                        />
                        <HandButton setHandItem={setHandItem} />
                        <Hand cards={handItem} />
                    </div>
                </div>

                <SubSection />
            </div>
        </DndContext>
    );
}

export default GameScreen;
