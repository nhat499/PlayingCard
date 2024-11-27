import { ReactNode } from "react";

type DraggableOptionsProps = {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    zIndex: number;
    scale?: number;
    children?: ReactNode;
};

const DraggableOptions = ({
    openDialog,
    setOpenDialog,
    zIndex,
    scale,
    children,
}: DraggableOptionsProps) => {
    return (
        <dialog
            open={openDialog}
            style={{
                position: "absolute",
                // top: "0",
                zIndex: zIndex + 1,
                left: "0px",
                top: "0px",
                padding: "20px", // Add some padding
                border: "none", // Remove default border
                borderRadius: "8px", // Rounded corners
                backgroundColor: "#fff", // Background color
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                width: "100px", // Set a fixed width
                fontFamily: "Arial, sans-serif", // Change font family
                transform: scale ? `scale(${scale})` : undefined,
            }}
        >
            <div style={{ marginBottom: "15px" }}>{children}</div>

            <button
                style={{
                    padding: "8px 16px",
                    width: "100%",
                    backgroundColor: "gray",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                }}
                onClick={() => setOpenDialog(false)}
            >
                Cancel
            </button>
        </dialog>
    );
};

export default DraggableOptions;
