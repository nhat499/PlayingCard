import { useDroppable } from "@dnd-kit/core";
import Draggable, { DraggableProps, item } from "./Draggable";

export type StackProps = {
    stack: item;
    data: item[];
};

// export interface StackItem extends item {
//     data: item[];
// }

const Stack = ({ stack, data }: StackProps) => {
    const { setNodeRef: setDropRef } = useDroppable({
        id: stack.id,
    });
    return (
        <Draggable
            setAttribute={() => {
                // add shuffle.
                // add hide cards
                // add deal cards
            }}
            item={{
                ...stack,
                // id: stack.id,
                // disabled: stack.disabled ?? false,
                // parent: stack.parent,
                // height: stack.height,
                // isHidden: false,
                // left: stack.left,
                // name: stack.name,
                // top: stack.top,
                // width: stack.width,
                // zIndex: stack.zIndex,
                // transform: stack.transform,
            }}
            Children={(isDragging) => (
                <div
                    ref={!isDragging ? setDropRef : undefined}
                    style={{
                        width: stack.width,
                        height: stack.height,
                        display: "flex",
                    }}
                >
                    {data?.map((item) => {
                        return (
                            <Draggable
                                key={item.id}
                                item={item}
                                setAttribute={() => {}}
                            />
                        );
                    })}
                </div>
            )}
        ></Draggable>
    );
};

export default Stack;
