import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

import { StarSurfaceShader } from './materials/StarSurfaceMaterial';
import type { StarData } from '../../data/systems';

interface SunProps {
    scale?: number;
    starData: StarData;
    onSelect?: (data: any, pos: [number, number, number]) => void;
}

export const Sun = ({ scale = 1, starData, onSelect }: SunProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    const { name, color, coronaColor = "#ff8800", type, temp, mass, age, details, composition } = starData;

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.02; // Slower physical rotation, let shader do the work

            // Animate shader uniform
            // @ts-ignore
            if (meshRef.current.material.uniforms) {
                // @ts-ignore
                meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
            }
        }
        if (glowRef.current) {
            glowRef.current.rotation.z -= delta * 0.02;
            glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
        }
    });

    return (
        <group scale={[scale, scale, scale]} name={name}>
            {/* Core Sun */}
            <mesh
                ref={meshRef}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onSelect) {
                        onSelect({
                            name,
                            distance: 0,
                            temp,
                            mass,
                            size: starData.size,
                            age,
                            type: 'Star',
                            spectralType: type,
                            composition,
                            description: details || `The star at the center of the ${name} system.`,
                            details: {
                                gravity: `${mass} Solar Masses`, // Reusing gravity field for Mass
                                orbitalPeriod: 'N/A',
                                moons: 0,
                                dayLength: 'N/A',
                                facts: [
                                    `Spectral Type: ${type}`,
                                    `Mass: ${mass} Solar Masses`,
                                    `Age: ${age || 'Unknown'}`,
                                    `Surface Temp: ${temp}`
                                ]
                            }
                        }, [0, 0, 0]);
                    }
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[10, 64, 64]} />
                {/* @ts-ignore */}
                <starSurfaceShader
                    key={StarSurfaceShader.key}
                    uColor={new THREE.Color(color)}
                    uTime={0}
                    uBrightness={1.2}
                /* wireframe={false} */
                />
                <pointLight intensity={3} distance={500} decay={0.5} color={color} />

                {hovered && (
                    <Html>
                        <div className="bg-black/90 border border-yellow-500/50 p-4 rounded-md text-yellow-400 whitespace-nowrap pointer-events-none select-none backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.5)] transform -translate-x-1/2 -translate-y-full mb-2">
                            <div className="font-bold text-lg text-white mb-1">{name}</div>
                            <div className="text-sm">Type: {type}</div>
                            <div className="text-sm">Temp: {temp}</div>
                        </div>
                    </Html>
                )}
            </mesh>
            {/* Glow/Corona Layer */}
            <mesh ref={glowRef} scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[10, 64, 64]} />
                <meshBasicMaterial
                    color={coronaColor}
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer Glow */}
            <mesh scale={[1.5, 1.5, 1.5]}>
                <sphereGeometry args={[10, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

        </group>
    );
};
