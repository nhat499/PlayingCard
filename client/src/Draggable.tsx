import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



export type DraggableProps = {
    item: {
        id: string,
        name: string,
        top: number,
        left: number
        width: number,
        height: number,
    }
}

const Draggable = ({ item }: DraggableProps) => {
    // const { attributes, listeners, setNodeRef, transform } = useDraggable({
    //     id: item.id,
    //     data: item,

    // });

    // const style = transform ? {
    //     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // } : undefined;


    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
        data: item,
    });


    const style = {

        transform: CSS.Translate.toString(transform)
    }


    return (

        <div
            ref={setNodeRef}
            style={{
                border: "1px solid black",
                width: `${item.width}px`,
                height: `${item.height}px`,
                ...style
            }}
            {...listeners}
            {...attributes}
        >

            {item.name}
        </div>

    )
}
export default Draggable