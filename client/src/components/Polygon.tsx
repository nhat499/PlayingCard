import { CSSProperties, ReactNode } from "react";

interface PolygonProps {
    sides: number;
    width: number;
    height: number;
    rotate: number; // Rotation in degrees
    color: CSSProperties["color"];
    children?: ReactNode;
}

const Polygon = ({
    sides,
    width,
    height,
    rotate,
    color = "lightblue",
    children,
}: PolygonProps) => {
    const points: string[] = [];
    const rotateInRadians = (45 * Math.PI) / 180;
    // Calculate points for a unit polygon in [-1, 1] coordinate space
    const angle = (2 * Math.PI) / sides;
    for (let i = 0; i < sides; i++) {
        const x = Math.sin(i * angle + rotateInRadians);
        const y = Math.cos(i * angle + rotateInRadians);
        points.push(`${x},${y}`);
    }

    return (
        <div
            style={{
                position: "relative",
                width,
                height,
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox="-1 -1 2 2" // Unit square
                style={{
                    transform: `rotate(${rotate}deg) scale(${width / height}, ${height / width})`,
                }}
            >
                <polygon
                    points={points.join(" ")}
                    fill={color}
                    stroke="black"
                    strokeWidth="0.02"
                />
            </svg>
            {children && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default Polygon;
