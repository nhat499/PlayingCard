import { useDroppable } from '@dnd-kit/core';
import Draggable, { DraggableProps } from './Draggable';

export type BoardProps = {
    items: { [key: string]: DraggableProps["item"] };
    setItems: React.Dispatch<React.SetStateAction<{ [key: string]: DraggableProps["item"] }>>
}

const Board = ({ items, setItems }: BoardProps) => {
    const { isOver, setNodeRef, node, active, over, rect } = useDroppable({
        id: 'Board',
    });

    return (
        <div ref={setNodeRef}
            style={{
                position: "relative",
                border: "1px solid black",
                width: "85%",
                height: "70%",

            }}>
            {Object.entries(items).map(([key, item]) =>
                <div
                    key={key}

                    style={{
                        position: "absolute",
                        top: item.top,
                        left: item.left,
                        zIndex: item.zIndex,
                    }}
                >
                    <Draggable
                        item={item}
                        setAttribute={(id, key, value) => setItems(currItems => {
                            currItems[id][key] = value;
                            return currItems;
                        })}
                    />
                </div>)}
        </div>
    )
}

export default Board;