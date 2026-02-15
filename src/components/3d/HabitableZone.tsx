import * as THREE from 'three';

/**
 * HabitableZone - Renders a translucent green ring showing the habitable zone around a star.
 * The habitable zone boundaries are calculated from stellar luminosity (approximated from star size/type).
 */
interface HabitableZoneProps {
    starLuminosity?: number; // relative to Sol (1.0 = Sun)
    innerRadius?: number;    // manual override
    outerRadius?: number;    // manual override
    scaleFactor?: number;
}

export const HabitableZone = ({ starLuminosity = 1.0, innerRadius, outerRadius, scaleFactor = 1 }: HabitableZoneProps) => {
    // Calculate habitable zone from luminosity if not manually specified
    // HZ inner ≈ sqrt(L/1.1), HZ outer ≈ sqrt(L/0.53) (in AU, but we use game units)
    // Game units: Earth is at distance 60 = 1 AU equivalent
    const auToGame = 60; // 1 AU = 60 game units in Sol system

    const inner = innerRadius ?? (Math.sqrt(starLuminosity / 1.1) * auToGame);
    const outer = outerRadius ?? (Math.sqrt(starLuminosity / 0.53) * auToGame);


    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} renderOrder={-1}>
            <ringGeometry args={[inner * scaleFactor, outer * scaleFactor, 128]} />
            <meshBasicMaterial
                color="#00ff66"
                transparent
                opacity={0.1}
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
};
