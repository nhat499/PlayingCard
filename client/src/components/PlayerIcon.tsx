import { memo } from "react";

const PlayerIcon = ({ name }: { name: string }) => {
    return (
        <div
            style={{
                minWidth: "60px",
                height: "40px",
                background: "lightblue",
                border: "2px solid darkBlue",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "darkBlue",
            }}
        >
            {name}
        </div>
    );
};

export default memo(PlayerIcon);
