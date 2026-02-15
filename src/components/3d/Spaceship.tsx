import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Quaternion, Group } from 'three';
import * as THREE from 'three';
import { useShipPhysics } from '../../hooks/useShipPhysics';
import { Trail } from '@react-three/drei';

interface SpaceshipProps {
    onTelemetryUpdate?: (telemetry: { speed: number; position: Vector3; heading: number }) => void;
    targetPosition?: [number, number, number] | null;
    onArrived?: () => void;
    initialPosition?: [number, number, number];
    isTrueScale?: boolean;
}

const BlinkingLight = ({ position, color, speed = 1, phase = 0 }: { position: [number, number, number], color: string, speed?: number, phase?: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (meshRef.current) {
            const t = (clock.getElapsedTime() * speed + phase) % 1;
            const intensity = t < 0.2 ? 1 : 0; // Short blink
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
        }
    });
    return (
        <mesh position={position} ref={meshRef}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} transparent />
        </mesh>
    );
};

const EngineBlock = ({ active }: { active: boolean }) => (
    <group position={[0, 0, 3.5]}>
        {/* Main Tech Block - White/Gray */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[1.4, 1.4, 1.0]} />
            <meshStandardMaterial
                color="#e0e0e0" // White/Light Gray
                roughness={0.5}
                metalness={0.5}
            />
        </mesh>

        {/* Detail Plates */}
        <mesh position={[0.75, 0, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.8]} />
            <meshStandardMaterial color="#cccccc" />
        </mesh>
        <mesh position={[-0.75, 0, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.8]} />
            <meshStandardMaterial color="#cccccc" />
        </mesh>

        {/* Thruster Nozzles */}
        {[
            [0.4, 0.4], [-0.4, 0.4],
            [0.4, -0.4], [-0.4, -0.4]
        ].map(([x, y], i) => (
            <group key={i} position={[x, y, 0.6]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.3, 0.2, 0.6, 16]} />
                    <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]} visible={active}>
                    <circleGeometry args={[0.25, 16]} />
                    <meshBasicMaterial color="#00ffff" toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]} visible={!active}>
                    <circleGeometry args={[0.25, 16]} />
                    <meshBasicMaterial color="#111111" />
                </mesh>
            </group>
        ))}
        {/* Rear navigation light */}
        <BlinkingLight position={[0, 0.8, 0]} color="white" speed={2} />
    </group>
);


export const Spaceship = ({ onTelemetryUpdate, targetPosition, onArrived, initialPosition, isCockpitView, arrivalThreshold = 20, isTrueScale = false }: SpaceshipProps & { isCockpitView: boolean, arrivalThreshold?: number }) => {
    const shipRef = useRef<Group>(null);
    const startPos = initialPosition ? new Vector3(...initialPosition) : new Vector3(0, 0, 0);

    const physics = useShipPhysics(startPos);

    const [autopilotEngaged, setAutopilotEngaged] = useState(false);
    const [hasArrived, setHasArrived] = useState(false);

    useEffect(() => {
        if (targetPosition) {
            setAutopilotEngaged(true);
            setHasArrived(false);
        } else {
            setAutopilotEngaged(false);
            setHasArrived(false);
        }
    }, [targetPosition]);

    useFrame((state, delta) => {
        if (!shipRef.current) return;
        let currentPosition = physics.position.current;
        let currentRotation = physics.rotation.current;
        let currentVelocity = physics.velocity;

        if (autopilotEngaged && targetPosition) {
            const target = new Vector3(...targetPosition);
            const direction = new Vector3().subVectors(target, currentPosition);
            const distance = direction.length();

            if (distance < arrivalThreshold) {
                currentVelocity.set(0, 0, 0); // Stop
                if (!hasArrived) {
                    setHasArrived(true);
                    if (onArrived) onArrived();
                }
            } else {
                direction.normalize();
                const speed = 50;
                currentVelocity.copy(direction).multiplyScalar(speed);
                currentPosition.add(currentVelocity.clone().multiplyScalar(delta));

                // Smooth rotation towards target
                const targetQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), direction);
                currentRotation.slerp(targetQuaternion, delta * 5);
            }
        } else {
            // Idle drift or hold position if no target
            currentVelocity.multiplyScalar(0.95); // Damping
            currentPosition.add(currentVelocity.clone().multiplyScalar(delta));
        }

        shipRef.current.position.copy(currentPosition);
        shipRef.current.quaternion.copy(currentRotation);

        if (isCockpitView) {
            let cameraOffset, lookAtOffset;

            if (hasArrived) {
                // Cinematic Arrival View (Behind and to the side)
                cameraOffset = new Vector3(2.5, 1.0, 3.5);
                lookAtOffset = new Vector3(0, 0, -5); // Look towards destination
            } else {
                // Standard Flight/Cockpit View
                cameraOffset = new Vector3(0, 0.4, -1.2);
                lookAtOffset = new Vector3(0, 0, -20);
            }

            cameraOffset.applyQuaternion(currentRotation);
            const cameraPosition = currentPosition.clone().add(cameraOffset);

            lookAtOffset.applyQuaternion(currentRotation);
            const lookAtPosition = currentPosition.clone().add(lookAtOffset);

            state.camera.position.lerp(cameraPosition, 0.1); // Smooth transition
            state.camera.lookAt(lookAtPosition);
        }

        if (onTelemetryUpdate) {
            onTelemetryUpdate({
                speed: currentVelocity.length(),
                position: currentPosition.clone(),
                heading: 0
            });
        }
    });

    // Scale calculation: 
    // Default scale: 0.2
    // True Scale factor for planets: 0.005
    // Ship in True Scale should be much smaller but visible. 
    // 0.2 * 0.05 = 0.01 (20x smaller than game scale, but still 2x larger than "true" proportional scale of 0.001)
    const shipScale = isTrueScale ? 0.02 : 0.2;

    return (
        <group ref={shipRef}>
            {/* Scaled Visuals Group */}
            <group scale={[shipScale, shipScale, shipScale]}>
                {/* Rotating Gravity Ring - Centered on spine */}
                <RingSection />

                {/* Connecting Spine */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 4, 16]} />
                    <meshStandardMaterial color="#eeeeee" roughness={0.4} metalness={0.6} />
                </mesh>

                {/* Forward Command Module (Bulky) */}
                <group position={[0, 0, -2.5]}>
                    {/* Main Hull */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.8, 1.2, 1.5, 16]} />
                        <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.5} />
                    </mesh>

                    {/* Nose Cone */}
                    <mesh position={[0, 0, -1.0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.4, 0.8, 0.5, 16]} />
                        <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.5} />
                    </mesh>

                    {/* Bridge/Cockpit Window */}
                    <mesh position={[0, 0.4, -0.5]} rotation={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.8, 0.4, 0.5]} />
                        <meshPhysicalMaterial
                            color="#aaddff"
                            roughness={0.1}
                            metalness={0.2}
                            transmission={0.6}
                            thickness={0.5}
                        />
                    </mesh>

                    {/* Navigation Lights */}
                    <BlinkingLight position={[1.0, 0, 0]} color="#00ff00" speed={1.5} phase={0} /> {/* Green (Starboard) */}
                    <BlinkingLight position={[-1.0, 0, 0]} color="#ff0000" speed={1.5} phase={0.5} /> {/* Red (Port) */}
                    <BlinkingLight position={[0, -0.8, 0]} color="white" speed={3} /> {/* Bottom Strobe */}
                </group>

                {/* Detailed Engine Block - Moved back */}
                <EngineBlock active={autopilotEngaged} />

                {/* Engine Trails - Scaled with the ship */}
                <group position={[0, 0, 5]}>
                    {autopilotEngaged && (
                        <>
                            <Trail width={3} length={8} color="#00ffff" attenuation={(t) => t * t}> {/* Reduced width/length */}
                                <mesh position={[0.4, 0.4, 0]} visible={false}><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
                            </Trail>
                            <Trail width={3} length={8} color="#00ffff" attenuation={(t) => t * t}>
                                <mesh position={[-0.4, 0.4, 0]} visible={false}><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
                            </Trail>
                            <Trail width={3} length={8} color="#00ffff" attenuation={(t) => t * t}>
                                <mesh position={[0.4, -0.4, 0]} visible={false}><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
                            </Trail>
                            <Trail width={3} length={8} color="#00ffff" attenuation={(t) => t * t}>
                                <mesh position={[-0.4, -0.4, 0]} visible={false}><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
                            </Trail>
                        </>
                    )}
                </group>
            </group>
        </group>
    );
};

const RingSection = () => {
    const ringRef = useRef<Group>(null);

    useFrame((_, delta) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += delta * 0.5;
        }
    });

    return (
        <group ref={ringRef}>
            {/* The Ring */}
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[1.8, 0.25, 16, 32]} />
                <meshStandardMaterial color="#eeeeee" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Spokes */}
            <mesh rotation={[0, 0, 0]}>
                <boxGeometry args={[3.6, 0.15, 0.15]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[3.6, 0.15, 0.15]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>

            {/* Modules on Ring */}
            {[0, 1, 2, 3].map(i => (
                <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 1.8, Math.sin(i * Math.PI / 2) * 1.8, 0]}>
                    <boxGeometry args={[0.8, 0.5, 0.4]} />
                    <meshStandardMaterial color="#eeeeee" metalness={0.6} roughness={0.3} emissive="#ffffff" emissiveIntensity={0.2} />
                </mesh>
            ))}
        </group>
    );
};
