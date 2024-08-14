import Draggable, { DraggableProps } from "./Draggable";

export type HandProps = {
    cards: DraggableProps["item"][]
}

const Hand = ({ cards }: HandProps) => {
    return (
        <div style={{
            display: "flex",

            gap: "5px"
        }}>
            {cards.map(card => <Draggable key={card.id} item={card} />)}
        </div>
    )
}

export default Hand;