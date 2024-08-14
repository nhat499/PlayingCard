import { useDroppable } from '@dnd-kit/core';
import Draggable, { DraggableProps } from './Draggable';

export type BoardProps = {
    items: { [key: string]: DraggableProps["item"] };
}

const Board = ({ items }: BoardProps) => {
    const { isOver, setNodeRef, node, active, over, rect } = useDroppable({
        id: 'droppable',
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
                        left: item.left
                    }}
                >
                    <Draggable item={item} />
                </div>)}
        </div>
    )
}

export default Board;