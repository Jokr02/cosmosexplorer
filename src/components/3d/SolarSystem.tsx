import { useRef, useMemo, memo, useEffect, useState } from 'react';
import { Line, useCursor, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';

import type { StarSystemData } from '../../data/systems';
import { Sun } from './Sun';
import { PlanetRing } from './PlanetRing';
import { AsteroidBelt } from './AsteroidBelt';
import { Comet } from './Comet';
import { HabitableZone } from './HabitableZone';
import { useDevHelpers } from '../../hooks/useDevHelpers';

// Restore synchronous texture generation imports
import { generatePlanetCanvas } from '../../utils/PlanetTextureGenerator';

interface SolarSystemProps {
    onPlanetSelect: (planet: any, position: [number, number, number]) => void;
    selectedPlanet: any | null;
    isPaused: boolean;
    setIsPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
    isTrueScale: boolean;
    currentSystem: StarSystemData;
}

export const SolarSystem = ({ onPlanetSelect, selectedPlanet, isPaused, setIsPaused, isTrueScale, currentSystem }: SolarSystemProps) => {
    // console.log('SolarSystem render:', { system: currentSystem.name });

    useDevHelpers({
        planets: currentSystem.planets,
        onPlanetSelect,
        setIsPaused,
        isPaused
    });

    const scaleFactor = isTrueScale ? 0.005 : 1;
    const sunScale = isTrueScale ? Math.max(scaleFactor, 0.05) : scaleFactor;

    return (
        <group>
            {/* SUN */}
            <Sun
                scale={sunScale}
                starData={currentSystem.star}
                onSelect={(data, pos) => onPlanetSelect({ ...data, type: 'Star', spectralType: data.type }, pos)}
            />

            {/* HABITABLE ZONE */}
            <HabitableZone
                starLuminosity={currentSystem.star.luminosity}
                innerRadius={currentSystem.habitableZone.inner}
                outerRadius={currentSystem.habitableZone.outer}
                scaleFactor={scaleFactor}
            />

            {/* ASTEROID BELTS */}
            {currentSystem.asteroidBelts && currentSystem.asteroidBelts.map((belt, i) => (
                <AsteroidBelt
                    key={i}
                    count={belt.count}
                    minRadius={belt.radius - belt.width / 2}
                    maxRadius={belt.radius + belt.width / 2}
                    scale={scaleFactor}
                    color={belt.color}
                />
            ))}

            {/* COMETS */}
            {currentSystem.comets && currentSystem.comets.map((comet, i) => (
                <Comet
                    key={i}
                    {...comet}
                    size={comet.size * scaleFactor}
                    scaleFactor={scaleFactor}
                    isPaused={isPaused}
                    onSelect={onPlanetSelect}
                    isSelected={selectedPlanet?.name === comet.name}
                />
            ))}

            {/* PLANETS */}
            {currentSystem.planets.map((p) => {
                // Initial position calculation matching the orbit logic
                const eccentricity = p.eccentricity || 0;
                const semiMajorAxis = p.distance;
                const focusOffset = semiMajorAxis * eccentricity;

                // Base orbit position in 2D (XZ plane)
                const xBase = semiMajorAxis * Math.cos(p.angle) - focusOffset;
                const zBase = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(p.angle);

                // Apply inclination
                const inclination = p.inclination || 0;
                const incRad = THREE.MathUtils.degToRad(inclination);

                // Rotated around X axis
                const x = xBase;
                const y = -zBase * Math.sin(incRad);
                const z = zBase * Math.cos(incRad);

                const scaledSize = isTrueScale ? Math.max(p.size * scaleFactor, 0.15) : p.size;

                return (
                    <Planet
                        key={p.name}
                        {...p}
                        size={scaledSize}
                        isPaused={isPaused}
                        position={[x, y, z]}
                        onSelect={onPlanetSelect}
                        isSelected={selectedPlanet?.name === p.name}
                        moonsData={p.moonsData || []}
                        scaleFactor={scaleFactor}
                        eccentricity={eccentricity}
                        inclination={inclination}
                        description={p.description}
                        composition={p.composition}
                        atmosphere={p.atmosphere}
                        details={p.details}
                    />
                );
            })}
        </group>
    );
};

// ------------------------------------------------------------------
// PLANET COMPONENT (Restored from Backup Logic)
// ------------------------------------------------------------------

const Planet = memo(({ name, distance, size, color, temp, angle, orbitSpeed, rotationSpeed, position: initialPos, onSelect, isSelected, moonsData, rings, textureType, textureColors, isPaused, eccentricity = 0, inclination = 0, axialTilt = 0, scaleFactor = 1, description, composition, atmosphere, details }: any) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    const groupRef = useRef<Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    // Orbit state
    const angleRef = useRef(angle);

    // Async Staggered Texture Generation
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const hasLoadedRef = useRef(false);

    const textureColorsStr = JSON.stringify(textureColors);

    useEffect(() => {
        if (hasLoadedRef.current || !textureType || !textureColors) return;

        const timer = setTimeout(() => {
            const canvas = generatePlanetCanvas(textureType, textureColors.base, textureColors.secondary, 512);

            const loader = new THREE.TextureLoader();
            loader.load(canvas.toDataURL(), (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 8;
                tex.needsUpdate = true;

                setTexture(tex);
                hasLoadedRef.current = true;
            });
        }, 100); // Added delay

        return () => clearTimeout(timer); // Added cleanup
    }, [name, textureType, textureColorsStr]);

    // Removed the RESET effect to prevent "Grey Sphere" flicker


    // Ellipse parameters
    const semiMajorAxis = distance;
    const semiMinorAxis = distance * Math.sqrt(1 - (eccentricity * eccentricity));
    const focusOffset = distance * eccentricity;

    // Create ellipse curve for visual path
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
        if (!isSelected && !isPaused) {
            // Orbital movement: Kepler's 2nd law approximation
            const r = Math.sqrt(
                Math.pow(semiMajorAxis * Math.cos(angleRef.current) - focusOffset, 2) +
                Math.pow(semiMinorAxis * Math.sin(angleRef.current), 2)
            );
            const speedFactor = (semiMajorAxis / Math.max(0.1, r));
            angleRef.current += (orbitSpeed || 1) * delta * 0.1 * speedFactor;

            const xBase = semiMajorAxis * Math.cos(angleRef.current) - focusOffset;
            const zBase = semiMinorAxis * Math.sin(angleRef.current);

            // Apply inclination rotation
            const incRad = THREE.MathUtils.degToRad(inclination);
            const xx = xBase;
            const yy = -zBase * Math.sin(incRad);
            const zz = zBase * Math.cos(incRad);

            if (groupRef.current) {
                groupRef.current.position.set(xx, yy, zz);
            }
        }

        // Self-rotation
        if (meshRef.current && !isPaused) {
            meshRef.current.rotation.y += (rotationSpeed || 0.01) * 10 * delta;
        }
    });

    const isTrueScale = scaleFactor < 0.1;
    const orbitOpacity = isTrueScale ? 0.3 : 0.15;

    // Moon distance logic
    const safeMoonDistance = (originalDist: number, idx: number) => {
        if (isTrueScale) {
            return Math.max(originalDist * scaleFactor, 0.3 + (idx * 0.1));
        }
        return originalDist * scaleFactor;
    };

    return (
        <group>
            {/* Orbit Path */}
            <group rotation={[THREE.MathUtils.degToRad(inclination), 0, 0]}>
                <Line
                    points={points}
                    color="white"
                    opacity={orbitOpacity}
                    transparent
                    lineWidth={1}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </group>

            {/* Planet System Group */}
            <group ref={groupRef} position={initialPos} name={name}>
                <group rotation={[THREE.MathUtils.degToRad(axialTilt), 0, 0]}>
                    <group>
                        {/* HITBOX */}
                        <mesh
                            visible={false}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (groupRef.current) {
                                    const worldPos = new THREE.Vector3();
                                    groupRef.current.getWorldPosition(worldPos);
                                    onSelect({
                                        name,
                                        distance,
                                        size,
                                        color,
                                        description,
                                        temp,
                                        moonsData,
                                        textureType,
                                        textureColors,
                                        composition,
                                        atmosphere,
                                        details,
                                        axialTilt
                                    }, [worldPos.x, worldPos.y, worldPos.z]);
                                }
                            }}
                            onPointerOver={() => setHover(true)}
                            onPointerOut={() => setHover(false)}
                        >
                            <sphereGeometry args={[isTrueScale ? Math.max(size * 4, 1.5) : size * 1.05, 16, 16]} />
                            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                        </mesh>

                        {/* Visible Planet Mesh */}
                        <mesh
                            ref={meshRef}
                            castShadow
                            receiveShadow
                            name={name}
                        >
                            <sphereGeometry args={[size, 64, 64]} />
                            <meshStandardMaterial
                                color={texture ? '#ffffff' : color}
                                map={texture}
                                metalness={0.1}
                                roughness={0.8}
                                emissive={hovered ? color : '#000000'}
                                emissiveIntensity={hovered ? 0.2 : 0}
                                toneMapped={false}
                                key={texture ? 'textured' : 'fallback'}
                            />
                        </mesh>

                        {hovered && !isSelected && (
                            <Html position={[0, 0, 0]} pointerEvents="none">
                                <div className="bg-black/90 border border-cyan-500/50 p-4 rounded-md text-cyan-400 whitespace-nowrap pointer-events-none select-none backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.5)] transform translate-x-12 -translate-y-1/2">
                                    <div className="font-bold text-lg text-white mb-1">{name}</div>
                                    <div className="text-sm">Dist: {distance} AU</div>
                                    <div className="text-sm">Temp: {temp || 'N/A'}</div>
                                </div>
                            </Html>
                        )}
                    </group>

                    {/* Rings */}
                    {rings && (
                        <PlanetRing
                            innerRadius={rings.innerRadius * scaleFactor}
                            outerRadius={rings.outerRadius * scaleFactor}
                            color={rings.color}
                            opacity={rings.opacity}
                            rotation={rings.rotation}
                        />
                    )}

                    {/* Moons */}
                    {moonsData && moonsData.map((moon: any, i: number) => (
                        <Moon
                            key={i}
                            {...moon}
                            parentName={name}
                            size={isTrueScale ? Math.max(moon.size * scaleFactor, 0.1) : moon.size * scaleFactor}
                            distance={safeMoonDistance(moon.distance, i)}
                            scaleFactor={scaleFactor}
                            isPaused={isPaused}
                            onSelect={onSelect}
                        />
                    ))}
                </group>
            </group>
        </group >
    );
});

// ------------------------------------------------------------------
// MOON COMPONENT (Restored from Backup Logic)
// ------------------------------------------------------------------

const Moon = memo(({ name, size, distance, color, speed, isPaused, onSelect, parentName, scaleFactor, textureType, textureColors, description, temp, composition, atmosphere, details }: any) => {
    const orbitRef = useRef<Group>(null);
    const initialRotation = useMemo(() => Math.random() * Math.PI * 2, []);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    const isTrueScale = (scaleFactor || 1) < 0.1;

    // Async Staggered Texture Generation for Moons
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const hasLoadedRef = useRef(false);

    const textureColorsStr = JSON.stringify(textureColors);

    useEffect(() => {
        if (hasLoadedRef.current || !textureType || !textureColors) return;

        const timer = setTimeout(() => {
            const canvas = generatePlanetCanvas(textureType, textureColors.base, textureColors.secondary, 256); // Increased res
            const loader = new THREE.TextureLoader();
            loader.load(canvas.toDataURL(), (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 4;
                tex.needsUpdate = true;
                setTexture(tex);
                hasLoadedRef.current = true;
            });
        }, 200);

        return () => clearTimeout(timer);
    }, [name, textureType, textureColorsStr]);

    // Removed the RESET effect


    useFrame((_, delta) => {
        if (orbitRef.current && !isPaused) {
            orbitRef.current.rotation.y += (speed || 1) * delta * 0.5;
        }
    });

    return (
        <group ref={orbitRef} rotation={[0, initialRotation, 0]}>
            {/* Group representing the moon object itself, offset by distance */}
            <group position={[distance, 0, 0]}>
                {/* Moon Hitbox */}
                <mesh
                    onClick={(e) => {
                        e.stopPropagation();
                        // Construct moon data object for selection
                        const moonData = {
                            name,
                            distance,
                            size,
                            color,
                            textureType,
                            textureColors,
                            isMoon: true,
                            description: description || `A moon of ${parentName}.`,
                            parentName,
                            temp,
                            composition,
                            atmosphere,
                            details
                        };

                        onSelect(moonData, [e.point.x, e.point.y, e.point.z]);
                    }}
                    onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
                    onPointerOut={() => setHover(false)}
                >
                    <sphereGeometry args={[isTrueScale ? Math.max(size * 4, 0.8) : Math.max(size * 3, 0.5), 16, 16]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>

                {/* Visual Moon */}
                <mesh>
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial
                        color={texture ? '#ffffff' : color}
                        map={texture}
                        emissive={hovered ? color : '#000000'}
                        emissiveIntensity={hovered ? 0.2 : 0}
                        metalness={0.1}
                        roughness={0.8}
                        toneMapped={false}
                        key={texture ? 'textured' : 'fallback'}
                    />
                </mesh>

                {hovered && (
                    <Html position={[0, 0, 0]} pointerEvents="none">
                        <div className="bg-black/90 border border-gray-500/50 p-2 rounded-md text-gray-300 whitespace-nowrap pointer-events-none select-none backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.2)] transform translate-x-8 -translate-y-1/2 z-50">
                            <div className="font-bold text-sm text-white">{name}</div>
                            <div className="text-xs">Dist: {distance.toFixed(1)}</div>
                        </div>
                    </Html>
                )}
            </group>

            {/* Orbit Line */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={2} />
            </mesh>
        </group>
    );
});
