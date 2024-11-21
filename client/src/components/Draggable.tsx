import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { Children, ReactNode, useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import { BoardProps } from "./Board";

export type item = {
    id: string;
    name: string;
    zIndex: number;
    top: number;
    left: number;
    rotate: number; // rotate(90deg);
    // width: number;
    // height: number;
    disabled: boolean;
    // isHidden: boolean;
    parent: string;
    transform?: string; // translate3d(xpx, ypx, scale)
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

    const style = {
        transform: item.transform
            ? item.transform
            : CSS.Translate.toString(transform),
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    // border: "1px solid black",
                    position: "absolute",
                    cursor: "move",
                    // backgroundColor: "white",
                    // width: `${item.width}px`,
                    // height: `${item.height}px`,

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
