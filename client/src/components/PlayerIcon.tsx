import { Iuser } from "../atom/userAtom";

const PlayerIcon = ({ name, socketId }: Iuser) => {
    return (
        <div
            style={{
                width: "50px",
                height: "50px",
                border: "1px solid gray",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {name}
        </div>
    );
};

export default PlayerIcon;
