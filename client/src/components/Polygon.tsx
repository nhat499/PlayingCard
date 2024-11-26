import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CSSProperties, ReactNode } from "react";

interface PolygonProps {
    sides: number;
    width: number;
    height: number;
    rotate: number; // Rotation in degrees
    color: CSSProperties["color"];
    listeners?: SyntheticListenerMap;
    children?: ReactNode;
}

const Polygon = ({
    sides,
    width,
    height,
    rotate,
    color = "lightblue",
    listeners,
    children,
}: PolygonProps) => {
    const points: string[] = [];
    const rotateInRadians = (45 * Math.PI) / 180;
    const angle = (2 * Math.PI) / sides;
    for (let i = 0; i < sides; i++) {
        const y = Math.sin(i * angle + rotateInRadians);
        const x = Math.cos(i * angle + rotateInRadians);
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
                        // border: "1px solid blue",
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
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "60%",
                    height: "60%",
                    margin: "20%",
                    transform: `rotate(${rotate}deg) `,
                }}
                {...listeners}
            ></div>
        </div>
    );
};

export default Polygon;
