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
                left: "30px",
                padding: "20px", // Add some padding
                border: "none", // Remove default border
                borderRadius: "8px", // Rounded corners
                backgroundColor: "#fff", // Background color
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                width: "100px", // Set a fixed width
                fontFamily: "Arial, sans-serif", // Change font family
            }}
        >
            <div style={{ marginBottom: "15px" }}>
                {children}
            </div>

            <button
                onClick={() => setOpenDialog(false)}
            >
                Cancel
            </button>
        </dialog>

    );
};

export default DraggableOptions;
