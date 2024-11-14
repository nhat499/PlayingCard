import { CSSProperties, ReactNode } from "react";

interface PolygonProps {
    sides: number;
    width: number;
    height: number;
    rotate: number;
    color: CSSProperties["color"];
    children?: ReactNode
}

const Polygon = ({ sides, width, height, children, rotate, color = "lightblue" }: PolygonProps) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const points: string[] = [];
    // angle formula
    const angle = 2 * Math.PI / sides;
    for (let i = 0; i < sides; i++) {
        const x = centerX + radius * Math.sin(i * angle);
        const y = centerY + radius * Math.cos(i * angle);
        points.push(`${x}, ${y}`);
    }

    return (
        <div style={{
            position: "relative",
        }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{
                transform: `scale(${width / (radius * 2)}, ${height / (radius * 2)}) rotate(${rotate}deg)`
            }}>
                <polygon points={points.join(' ')} fill={color} stroke="black" strokeWidth="1">



                </polygon>
            </svg>
            <div style={{
                position: "relative",
                top: (-(height * 0.9)),
                left: width * 0.07,
                width: width * 0.86
            }}>
                {children}
            </div>
        </div >
    );
};

export default Polygon;