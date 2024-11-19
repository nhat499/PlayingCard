import { useState } from "react";
import AddItemPopup from "./AddItemPopup";
import ChatBox from "./ChatBox";
import Dice from "./Dice";
import PlayerIconList from "./PlayerIconList";
import { useGameState } from "../atom/userAtom";

const tabs = ["GameInfo", "Players", "AddItem", "TBD"];

const SubSection = () => {
    const [currTab, setCurrTab] = useState(0);
    const { gameStates } = useGameState();
    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "#e6f7ff",
                border: "5px solid #a7c7dc",
                borderTop: "none",
                borderRadius: "5px",

                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "10px",
                // padding: "10px",
                width: "100%",
                // position: "relative",
            }}
        >
            {/* Tabs Container */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    width: "100%",
                    position: "relative",
                    top: -10,
                }}
            >
                {tabs.map((value, index) => (
                    <button
                        key={index}
                        style={{
                            width: "100%",
                            backgroundColor: "lightblue",
                            border: "none",

                            paddingBottom: index === currTab ? "10px" : "0px",
                            height: index === currTab ? "40px" : "30px",
                            translate: index === currTab ? "0 -5px" : "0 5px",
                            transition: "ease-in-out 0.3s",
                            fontWeight: index === currTab ? "bolder" : "normal",
                            borderTopLeftRadius: 10,
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.paddingBottom = "10px";
                            e.currentTarget.style.height = "40px";
                            e.currentTarget.style.translate = "0 -5px";
                        }}
                        onMouseLeave={(e) => {
                            if (index !== currTab) {
                                e.currentTarget.style.paddingBottom = "0px";
                                e.currentTarget.style.height = "30px";
                                e.currentTarget.style.translate = "0 5px";
                            }
                        }}
                        onClick={() => setCurrTab(index)}
                    >
                        {value}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ height: "100%", width: "300px" }}>
                {currTab === 0 && <div style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}><Dice /><ChatBox /></div>}
                {currTab === 1 && <PlayerIconList players={gameStates?.players ?? []} detail />}
                {currTab === 2 && <AddItemPopup />}
                {currTab === 3 && <div>TBD</div>}
            </div>
        </div>
    );
};

export default SubSection;
