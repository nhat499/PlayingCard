import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { Children, ReactNode, useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";

export type item = {
    id: string;
    name: string;
    zIndex: number;
    top: number;
    left: number;
    width: number;
    height: number;
    disabled: boolean;
    isHidden: boolean;
    parent: string;
    data?: unknown;
    transform?: string; // translate3d(xpx, ypx, scale)
};

export type DraggableProps = {
    item: item;
    setAttribute: (
        itemId: string,
        key: keyof DraggableProps["item"],
        value: string | number | boolean
    ) => void;
    Children?: (isDragging: boolean) => ReactNode;
};

const Draggable = ({ item, setAttribute, Children }: DraggableProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: item.id,
            data: item,
            disabled: item.disabled,
        });
    const [openDiaglo, setOpenDialog] = useState(false);

    const style = {
        transform: item.transform ?? CSS.Translate.toString(transform),
    };

    // const renderChildren = () => {
    //     return React.Children.map(children, (child) => {
    //         return React.cloneElement(child, {
    //             isDragging,
    //         });
    //     });
    // };

    return (
        <>
            <dialog open={openDiaglo}>
                <button
                    onClick={(e) => {
                        console.log("click");
                        setAttribute(item.id, "disabled", !item.disabled);
                        setOpenDialog(false);
                    }}
                >
                    {item.disabled ? "unlock" : "lock"}
                </button>
                <button
                    onClick={(e) => {
                        setOpenDialog(false);
                        setAttribute(item.id, "isHidden", !item.isHidden);
                    }}
                >
                    flip
                </button>
                <button
                    onClick={(e) => {
                        setOpenDialog(false);
                    }}
                >
                    cancel
                </button>
            </dialog>
            <div
                ref={setNodeRef}
                style={{
                    border: "1px solid black",
                    position: "absolute",
                    cursor: "move",
                    backgroundColor: "white",
                    width: `${item.width}px`,
                    height: `${item.height}px`,

                    ...style,
                }}
                onContextMenu={(e) => {
                    e.preventDefault();

                    setOpenDialog(true);
                }}
                {...listeners}
                {...attributes}
            >
                {item.isHidden ? "hidden" : item.name}
                {Children && Children(isDragging)}
            </div>
        </>
    );
};
export default Draggable;
