import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";
import { useBoardScale } from "../atom/userAtom";
import { gameObj } from "../../../server/src/interfaces/gameStateInterface";

export type item = {
    id: string;
    name: string;
    zIndex: number;
    top: number;
    left: number;
    rotate: number;
    disabled: boolean;
    parent: string;
    transform?: string;
};

export type DraggableProps = {
    item: item;
    Children?: (isDragging: boolean) => ReactNode;
};

const Draggable = ({ item, Children }: DraggableProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: item.id,
            data: item,
            disabled: item.disabled,
        });
    const { boardScale } = useBoardScale();
    const scaledTransform = transform
        ? {
              ...transform,
              x:
                  item.parent === gameObj.HAND
                      ? transform.x
                      : transform.x / boardScale,
              y:
                  item.parent === gameObj.HAND
                      ? transform.y
                      : transform.y / boardScale,
          }
        : null;
    const style = {
        transform: item.transform
            ? item.transform
            : CSS.Translate.toString(scaledTransform),
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    position: "absolute",
                    cursor: "move",
                    ...(item.transform || isDragging ? { opacity: 0.7 } : {}),
                    ...style,
                }}
                {...listeners}
                {...attributes}
            >
                {Children && Children(isDragging)}
            </div>
        </>
    );
};
export default Draggable;
