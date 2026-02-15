import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Line, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CometData } from '../../data/systems';

interface CometProps extends CometData {
    isPaused: boolean;
    scaleFactor?: number;
    onSelect?: (data: any, pos: [number, number, number]) => void;
    isSelected?: boolean;
}

export const Comet = ({ name, distance, size, color, speed, eccentricity, inclination, orbitOffset = 0, orbitalPeriod, isPaused, scaleFactor = 1, onSelect, isSelected, details, composition, atmosphere }: CometProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    // Ellipse parameters
    const semiMajorAxis = distance;
    const semiMinorAxis = distance * Math.sqrt(1 - (eccentricity * eccentricity));
    const focusOffset = distance * eccentricity;

    const angleRef = useRef(Math.random() * Math.PI * 2);

    const points = useMemo(() => {
        const curve = new THREE.EllipseCurve(
            -focusOffset, 0,
            semiMajorAxis, semiMinorAxis,
            0, 2 * Math.PI,
            false,
            0
        );
        const points2D = curve.getPoints(128);
        return points2D.map(p => new THREE.Vector3(p.x, p.y, 0));
    }, [semiMajorAxis, semiMinorAxis, focusOffset]);

    useFrame((_, delta) => {
        if (!isPaused && !isSelected) {
            const r = Math.sqrt(
                Math.pow(semiMajorAxis * Math.cos(angleRef.current) - focusOffset, 2) +
                Math.pow(semiMinorAxis * Math.sin(angleRef.current), 2)
            );

            const speedFactor = (semiMajorAxis / r);
            angleRef.current += speed * delta * 0.1 * speedFactor;

            const xBase = semiMajorAxis * Math.cos(angleRef.current) - focusOffset;
            const zBase = semiMinorAxis * Math.sin(angleRef.current);
            const incRad = THREE.MathUtils.degToRad(inclination);

            const x = xBase;
            const y = -zBase * Math.sin(incRad);
            const z = zBase * Math.cos(incRad);

            if (meshRef.current) {
                meshRef.current.position.set(x, y, z);
                meshRef.current.rotation.y += delta;
            }
        }
    });

    const isTrueScale = scaleFactor < 0.1;
    const orbitOpacity = isTrueScale ? 0.2 : 0.3;

    // Minimum visual size in True Scale
    const visualSize = isTrueScale ? Math.max(size, 0.2) : size;

    return (
        <group rotation={[0, THREE.MathUtils.degToRad(orbitOffset), 0]}>
            <group>
                {/* Orbit Path (Visual) */}
                <group rotation={[THREE.MathUtils.degToRad(inclination), 0, 0]}>
                    <Line
                        points={points}
                        color={color}
                        opacity={orbitOpacity}
                        transparent
                        lineWidth={1}
                        rotation={[Math.PI / 2, 0, 0]}
                    />
                </group>

                {/* HITBOX */}
                <mesh
                    ref={meshRef}
                    name={name}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) {
                            const pos = new THREE.Vector3();
                            meshRef.current?.getWorldPosition(pos);

                            // Calculate realistic distance range (Perihelion and Aphelion)
                            const perihelion = (distance * (1 - eccentricity)).toFixed(1);
                            const aphelion = (distance * (1 + eccentricity)).toFixed(1);
                            const distRange = `${perihelion} - ${aphelion} AU`;

                            onSelect({
                                name,
                                distance,
                                distanceRange: distRange,
                                size,
                                color,
                                description: details.description,
                                type: 'Comet',
                                temp: 'Unknown', // Comets vary wildly
                                composition,
                                atmosphere,
                                details: {
                                    gravity: 'Negligible',
                                    orbitalPeriod: `${orbitalPeriod} Years` || 'Unknown',
                                    moons: 0,
                                    dayLength: 'Irregular',
                                    facts: details.facts || []
                                }
                            }, [pos.x, pos.y, pos.z]);
                        }
                    }}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <sphereGeometry args={[visualSize * 15, 16, 16]} />
                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        depthWrite={false}
                    />

                    {/* Visible Comet Nucleus */}
                    <mesh>
                        <sphereGeometry args={[visualSize, 16, 16]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={isTrueScale ? 1.5 : 0.8}
                            toneMapped={!isTrueScale}
                        />

                        {/* Trail Effect */}
                        <Trail
                            width={visualSize * 8}
                            length={isTrueScale ? 15 : 25}
                            color={new THREE.Color(color)}
                            attenuation={(t) => t * t}
                        >
                            <mesh visible={false}>
                                <sphereGeometry args={[visualSize, 8, 8]} />
                                <meshBasicMaterial color={color} />
                            </mesh>
                        </Trail>

                        {hovered && !isSelected && (
                            <Html position={[0, 0, 0]} pointerEvents="none">
                                <div className="bg-black/90 border border-blue-500/50 p-4 rounded-md text-blue-400 whitespace-nowrap pointer-events-none select-none backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.5)] transform translate-x-10 -translate-y-1/2">
                                    <div className="font-bold text-lg text-white mb-1">{name}</div>
                                    <div className="text-sm">Range: {(distance * (1 - eccentricity)).toFixed(1)} - {(distance * (1 + eccentricity)).toFixed(1)} AU</div>
                                    <div className="text-sm">Orbit: {orbitalPeriod} Years</div>
                                </div>
                            </Html>
                        )}
                    </mesh>
                </mesh>
            </group>
        </group>
    );
};
