import { useEffect, useState } from "react";
import DefaultScreen from "../components/DefaultScreen";
import Setting, { SettingProps } from "../components/Setting"
import { socket } from "../socket/Socket";

const defaultOne: SettingProps["itemData"] = {
    "cards": [
        {
            id: "1",
            name: "card1",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false
        },
        {
            id: "2",
            name: "card2",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false
        },
        {
            id: "3",
            name: "card3",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false
        },
        {
            id: "4",
            name: "card4",
            zIndex: 0,
            width: 40,
            height: 55,
            top: 0,
            left: 0,
            disabled: false,
            isHidden: false
        }
    ]
}


const CreateGameScreen = () => {
    useEffect(() => {


        // socket.emit()
    }, [])
    return <DefaultScreen>
        test
        <Setting
            itemData={defaultOne}
        />
    </DefaultScreen>
}

export default CreateGameScreen; 