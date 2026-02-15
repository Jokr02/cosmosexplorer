
import { DoubleSide } from 'three';

interface PlanetRingProps {
    innerRadius: number;
    outerRadius: number;
    color: string;
    opacity?: number;
    rotation?: [number, number, number];
}

export const PlanetRing = ({ innerRadius, outerRadius, color, opacity = 0.8, rotation = [Math.PI / 2, 0, 0] }: PlanetRingProps) => {
    return (
        <mesh rotation={rotation}>
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshStandardMaterial
                color={color}
                opacity={opacity}
                transparent
                side={DoubleSide}
            />
        </mesh>
    );
};
