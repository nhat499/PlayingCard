import { Children, ReactNode } from "react";
import { BoardProps } from "./Board";

type DraggableOptionsProps<k> = {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    zIndex: number;
    children?: ReactNode;
};

const DraggableOptions = <k,>({
    openDialog,
    setOpenDialog,
    zIndex,
    children,
}: DraggableOptionsProps<k>) => {
    return (
        <dialog
            open={openDialog}
            style={{
                position: "absolute",
                zIndex: zIndex,
                left: 30,
            }}
        >
            {children}

            <button
                onClick={(e) => {
                    setOpenDialog(false);
                }}
            >
                cancel
            </button>
        </dialog>
    );
};

export default DraggableOptions;
