import { ReactNode } from "react";

interface PolygonProps {
    sides: number;
    width: number;
    height: number;
    children?: ReactNode
}

const Polygon = ({ sides, width, height, children }: PolygonProps) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate radius from the smaller of width/height to fit the polygon
    const radius = Math.min(width, height) / 2;

    // Calculate the angle between each vertex
    const angleStep = (2 * Math.PI) / sides;

    // Generate the points for the polygon
    const points = Array.from({ length: sides }).map((_, i) => {
        const angle = angleStep * i;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
    });

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon points={points.join(' ')} fill="lightblue" stroke="black" strokeWidth="1">
                {children}
            </polygon>
        </svg>
    );
};

export default Polygon;