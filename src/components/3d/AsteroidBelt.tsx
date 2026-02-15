import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidBeltProps {
    count?: number;
    minRadius?: number;
    maxRadius?: number;
    scale?: number;
    color?: string;
}

export const AsteroidBelt = ({ count = 2000, minRadius = 85, maxRadius = 100, scale = 1, color = "#887766" }: AsteroidBeltProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const rotationRef = useRef(0);

    // Generate random data for asteroids
    const asteroids = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Random distance between min and max radius
            const r = minRadius + Math.random() * (maxRadius - minRadius);

            // Random angle
            const angle = Math.random() * Math.PI * 2;

            // Random vertical offset (keep it relatively flat)
            const y = (Math.random() - 0.5) * 5;

            // Random scale
            const scale = 0.1 + Math.random() * 0.4;

            // Random rotation speed and axis
            const rotationSpeed = (Math.random() - 0.5) * 0.02;

            temp.push({ r, angle, y, scale, rotationSpeed });
        }
        return temp;
    }, [count, minRadius, maxRadius]);

    // Initial setup
    useEffect(() => {
        if (!meshRef.current) return;

        const dummy = new THREE.Object3D();
        const isTrueScale = scale < 0.1;

        asteroids.forEach((asteroid, i) => {
            const x = Math.cos(asteroid.angle) * asteroid.r;
            const z = Math.sin(asteroid.angle) * asteroid.r;

            dummy.position.set(x, asteroid.y, z);

            // In True Scale, we must clamp the size so they don't vanish (~0.0005 is too small)
            // Normal scale: 0.1 to 0.5
            // True scale input `scale` is 0.005.
            // visualScale should probably not go below ~0.05 to be seen as dots
            let s = asteroid.scale * scale;
            if (isTrueScale) {
                // Boost size significantly for visibility
                s = Math.max(s, 0.2 + Math.random() * 0.1);
            }

            dummy.scale.set(s, s, s);

            // Random initial rotation
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [asteroids, scale]);

    // Animation loop
    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // Rotate the entire belt slowly
        rotationRef.current += 0.01 * delta; // Overall belt rotation speed
        meshRef.current.rotation.y = rotationRef.current;
    });

    const isTrueScale = scale < 0.1;

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[1, 0]} /> {/* Low poly rock shape */}
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isTrueScale ? 0.8 : 0.2}
                roughness={0.8}
                metalness={0.2}
                flatShading={true}
            />
        </instancedMesh>
    );
};
