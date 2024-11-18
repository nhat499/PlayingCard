import { memo } from "react";
import { Player } from "../../../server/src/interfaces/gameStateInterface";

type PlayerIconProps = {
    player: Player
}

const PlayerIcon = ({ player }: PlayerIconProps) => {
    return (
        <div
            style={{
                // minWidth: "60px",
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
            {player.name}
        </div>
    );
};

export default memo(PlayerIcon);
