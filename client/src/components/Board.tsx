import { useDroppable } from "@dnd-kit/core";
import Draggable, { DraggableProps } from "./Draggable";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";

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
                position: "relative",
                width: "100%",

                height: "700px",
                // border: "1px solid gray",
                backgroundColor: "lightblue",
            }}
        >

            {Object.entries(items).map(([key, item], index) => (
                <div
                    key={key}
                    style={{
                        position: "relative",
                        // border: "1px solid red",
                        width: "fit-content",
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
        </div>
    );
};

export default Board;
