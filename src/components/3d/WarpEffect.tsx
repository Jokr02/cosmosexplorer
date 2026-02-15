import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 2000;

export const WarpEffect = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    // Initial positions for stars
    const { positions, speeds } = useMemo(() => {
        const pos = new Float32Array(COUNT * 3);
        const spd = new Float32Array(COUNT);
        const col = new Float32Array(COUNT * 3);
        const color = new THREE.Color();

        for (let i = 0; i < COUNT; i++) {
            // Random spread in a cylinder/tunnel shape
            const r = 2 + Math.random() * 20; // radius 2 to 22
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            const z = (Math.random() - 0.5) * 200; // -100 to 100

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            spd[i] = 0.5 + Math.random(); // Random base speed

            // Varying colors (mostly white/blue)
            color.setHSL(0.6, 0.8, 0.8 + Math.random() * 0.2);
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }
        return { positions: pos, speeds: spd, colors: col };
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // Increase speed over time for "acceleration" feel
        const warpFactor = 200 * delta; // Very fast

        for (let i = 0; i < COUNT; i++) {
            // Move star towards camera (+Z)
            let z = positions[i * 3 + 2];
            z += speeds[i] * warpFactor;

            // Reset if passed camera (camera is at ~5, so reset at 10)
            if (z > 20) {
                z = -150; // Reset far back
                // Reshuffle x/y slightly for variety? Optional.
            }
            positions[i * 3 + 2] = z;

            // Update instance matrix
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];

            dummy.position.set(x, y, z);

            // Stretch effect: Scale geometry based on Z position or simple stretch
            // Classical effect: Stars become lines. We scale Z axis.
            dummy.scale.set(0.1, 0.1, 10 + Math.random() * 5); // Long streaks

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;

        // Flicker light effect
        if (lightRef.current) {
            lightRef.current.intensity = 2 + Math.random() * 3;
        }
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
                {/* Long thin box or cylinder for streak */}
                <boxGeometry args={[0.2, 0.2, 1]} />
                <meshBasicMaterial color="#ccffff" transparent opacity={0.8} />
            </instancedMesh>

            {/* Ambient blue glow */}
            <pointLight ref={lightRef} position={[0, 0, 0]} distance={50} color="#00ffff" />
        </group>
    );
};
