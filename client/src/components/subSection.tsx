import { useState } from "react";
import AddItemPopup from "./AddItemPopup";
import ChatBox from "./ChatBox";

const tabs = ["ChatBox", "AddItem", "Other", "Hide"];

const SubSection = () => {
    const [currTab, setCurrTab] = useState(0);

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "#e6f7ff",
                border: "5px solid #a7c7dc",
                // borderTop: "5px dashed #a7c7dc",
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

                    // top: "-5px",
                    // borderLeft: "5px solid #a7c7dc",
                    // borderRight: "5px solid #a7c7dc"
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
            <div style={{ width: "350px" }}>
                {currTab === 0 && <ChatBox />}
                {currTab === 1 && <AddItemPopup />}
                {currTab === 2 && <div>Other Content</div>}
                {currTab === 3 && <div>Hidden Content</div>}
            </div>
        </div>
    );
};

export default SubSection;
