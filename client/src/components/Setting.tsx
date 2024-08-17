import { DraggableProps } from "./Draggable";

export type SettingProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    itemData: { [key: string]: DraggableProps["item"][] }
}

const Setting = ({ open, setOpen, itemData }: SettingProps) => {
    return <dialog open={open} autoFocus style={{
        position: "absolute",
        top: "10%",
        minWidth: "400px",
        minHeight: "600px",
        // zIndex: 1
    }}>
        <div style={{

            backgroundColor: "whitesmoke"
        }}>
            <textarea
                style={{
                    border: "none",
                    resize: "none",
                    minWidth: "400px",
                    minHeight: "600px"
                }}
                value={JSON.stringify(itemData, undefined, 2)}
            ></textarea>
        </div>
        <button onClick={() => { setOpen(false) }}>save</button>
    </dialog>
}

export default Setting;