import { useDroppable } from "@dnd-kit/core";
import Draggable, { DraggableProps, item } from "./Draggable";
import {
    TransformWrapper,
    TransformComponent,
    useTransformContext,
} from "react-zoom-pan-pinch";
import Stack, { StackProps } from "./Stack";

export type BoardProps = {
    items: { [key: string]: DraggableProps["item"] | StackProps["stack"] };
    setItems: React.Dispatch<
        React.SetStateAction<{ [key: string]: DraggableProps["item"] }>
    >;
    isDragging: boolean;
};

const Board = ({ items, setItems, isDragging }: BoardProps) => {
    const { setNodeRef } = useDroppable({
        id: "Board",
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
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
                        // width: "fit-content",
                        zIndex: item.zIndex,
                        top: item.top,
                        left: item.left,
                    }}
                >
                    {item.id.startsWith("card") && (
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
                    )}
                    {item.id.startsWith("stack") && (
                        <Stack
                            key={key}
                            // listOfItem={item.data ?? []}
                            data={item.data as item[]}
                            stack={item}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Board;
