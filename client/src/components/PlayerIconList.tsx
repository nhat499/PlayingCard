import { useMemo } from "react";
import { Player } from "../../../server/src/interfaces/gameStateInterface";
import PlayerIcon from "./PlayerIcon";

type PlayerIconListProps = {
    players: Player[];
};

const PlayerIconList = ({ players }: PlayerIconListProps) => {
    const memoPlayerIconList = useMemo(() => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {players.map((player) => (
                    <PlayerIcon
                        key={player.socketId}
                        name={player.name}
                    />
                ))}
            </div>
        );
    }, [players.length]);

    return memoPlayerIconList;
};

export default PlayerIconList;
