import { ReactNode } from "react";

type DraggableOptionsProps = {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    zIndex: number;
    children?: ReactNode;
};

const DraggableOptions = ({
    openDialog,
    setOpenDialog,
    zIndex,
    children,
}: DraggableOptionsProps) => {
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
                onClick={() => {
                    setOpenDialog(false);
                }}
            >
                cancel
            </button>
        </dialog>
    );
};

export default DraggableOptions;
