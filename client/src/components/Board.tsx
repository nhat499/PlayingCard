import { useDroppable } from "@dnd-kit/core";
import Draggable, { DraggableProps } from "./Draggable";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export type BoardProps = {
    items: { [key: string]: DraggableProps["item"] };
    setItems: React.Dispatch<
        React.SetStateAction<{ [key: string]: DraggableProps["item"] }>
    >;
    isDragging: boolean;
};

const Board = ({ items, setItems, isDragging }: BoardProps) => {
    const { isOver, setNodeRef, node, active, over, rect } = useDroppable({
        id: "Board",
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                // position: "relative",
                width: "100%",
                height: "100%",
                border: "1px solid gray",
                // backgroundColor: "lightblue",
            }}
        >
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                limitToBounds={false}
                maxScale={3}
                disabled={isDragging}
            >
                <TransformComponent
                    contentStyle={
                        {
                            // display: "flex",
                            // flexDirection: "row",
                            // position: "absolute",
                        }
                    }
                    wrapperStyle={{ height: "100%", width: "100%" }}
                >
                    {Object.entries(items).map(([key, item]) => (
                        <div
                            key={key}
                            style={{
                                position: "fixed",
                                top: item.top,
                                left: item.left,
                            }}
                        >
                            <Draggable
                                key={key}
                                item={item}
                                setAttribute={(id, key, value) =>
                                    setItems((currItems) => {
                                        currItems[id][key] = value;
                                        return currItems;
                                    })
                                }
                            />
                        </div>
                    ))}
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

export default Board;
