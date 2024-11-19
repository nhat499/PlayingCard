import { memo } from "react";
import { Player } from "../../../server/src/interfaces/gameStateInterface";

type PlayerIconProps = {
    player: Player
}

const PlayerIcon = ({ player }: PlayerIconProps) => {
    return (

        <div style={{
            display: "flex",
            border: "1px solid lightBlue",
            alignItems: "center",
            gap: "20px",
            paddingLeft: "10px",
            paddingRight: "10px",
        }}>

            <div
                style={{
                    height: "40px",
                    background: "lightblue",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    padding: "3px",
                    color: "darkBlue",
                    textOverflow: "clip"
                }}
            >
                {player.name}
            </div>
            <div>
                <p>hand:{Object.keys(player.hand).length}</p>
                <p>{player.roomLeader && "RoomLeader"}</p>
            </div>
        </div>



    );
};

export default memo(PlayerIcon);
