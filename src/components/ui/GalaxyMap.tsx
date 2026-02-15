import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Float, Cloud, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useState, useMemo, useRef, useEffect } from 'react';
import { SYSTEMS } from '../../data/systems';
import { useAudio } from '../../hooks/useAudio';
import type { StarSystemData } from '../../data/systems';
import { MapPin, Zap, Navigation, X, Sparkles } from 'lucide-react';

interface GalaxyMapProps {
    onSystemSelect: (systemId: string) => void;
    currentSystemId: string;
    onClose: () => void;
}

// Sub-component for background cosmic dust
const CosmicDust = () => {
    const count = 3000;
    const [positions, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 1500;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 1500;
            s[i] = Math.random() * 0.2;
        }
        return [pos, s];
    }, []);

    const points = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y += state.clock.getDelta() * 0.03;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
                <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} args={[sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial size={0.07} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
        </points>
    );
};

// Cinematic camera fly-in handler
const CameraHandler = () => {
    const { camera } = useThree();
    const [initialAnim, setInitialAnim] = useState(true);
    const targetPos = new THREE.Vector3(0, 40, 60);
    const startPos = new THREE.Vector3(0, 150, 200); // Closer start for compressed map

    useEffect(() => {
        camera.position.copy(startPos);
    }, []);

    useFrame(() => {
        if (initialAnim) {
            camera.position.lerp(targetPos, 0.05); // Use a fixed lerp for smoothness
            if (camera.position.distanceTo(targetPos) < 1) {
                setInitialAnim(false);
            }
        }
    });

    return null;
};

// Sub-component for a flowing dash line
const FlowingLine = ({ start, end, color, opacity, isActive }: { start: [number, number, number], end: [number, number, number], color: string, opacity: number, isActive: boolean }) => {
    const lineRef = useRef<any>(null);

    useFrame((state) => {
        if (lineRef.current && isActive) {
            lineRef.current.material.dashOffset -= state.clock.getDelta() * 3.5;
        }
    });

    return (
        <Line
            ref={lineRef}
            points={[start, end]}
            color={color}
            opacity={opacity}
            transparent
            lineWidth={isActive ? 2.5 : 1.5}
            dashed={isActive}
            dashSize={0.6}
            gapSize={0.3}
        />
    );
};

// Sub-component for background nebulas (Enhanced v3)
const Nebula = () => {
    return (
        <group>
            {/* Deep Purple Core */}
            <Cloud
                opacity={0.12}
                speed={0.1}
                bounds={[200, 100, 200]}
                segments={30}
                position={[0, -50, -400]}
                color="#330066"
                fade={150}
            />
            {/* Ethereal Cyan Layer */}
            <Cloud
                opacity={0.08}
                speed={0.2}
                bounds={[300, 150, 400]}
                segments={20}
                position={[300, 100, -700]}
                color="#006688"
                fade={200}
            />
            {/* Cosmic Magenta Glow */}
            <Cloud
                opacity={0.1}
                speed={0.15}
                bounds={[400, 200, 300]}
                segments={25}
                position={[-400, 0, -300]}
                color="#660044"
                fade={180}
            />
        </group>
    );
};

// Generate a soft glow texture
const generateGlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; // Increased resolution
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
};

/* ── Individual star node ── */
const StarNode = ({
    system,
    isCurrent,
    isHovered,
    onSelect,
    onHover,
    onUnhover,
    audio
}: {
    system: StarSystemData;
    isCurrent: boolean;
    isHovered: boolean;
    onSelect: (id: string) => void;
    onHover: (id: string) => void;
    onUnhover: () => void;
    audio?: any;
}) => {
    // SCALE UP COORDINATES (v3.4) - Compressed for better ergonomy
    const position = useMemo(() => {
        const [x, y, z] = system.coordinates;
        // Slashing multipliers to bring everything within immediate reach
        return new THREE.Vector3(x * 1.6, y * 1.6, z * 1.4);
    }, [system.coordinates]);

    const glowTexture = useMemo(() => generateGlowTexture(), []);

    const coreRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Sprite>(null);
    const outerGlowRef = useRef<THREE.Sprite>(null);
    const coronaRef = useRef<THREE.Mesh>(null);

    const baseSize = Math.max(0.4, Math.min(1.2, (system.star.size || 10) / 12));

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (isHovered || isCurrent) {
            const pulse = 1.0 + Math.sin(time * 3) * 0.05;
            if (coreRef.current) coreRef.current.scale.setScalar(pulse);
            if (glowRef.current) glowRef.current.scale.setScalar(1.5 + Math.cos(time * 2) * 0.1);
            if (outerGlowRef.current) outerGlowRef.current.scale.setScalar(2.2 + Math.sin(time * 3) * 0.15);
            if (coronaRef.current) {
                coronaRef.current.scale.setScalar(pulse * 1.3);
                coronaRef.current.rotation.y += 0.005;
            }
        } else {
            if (coreRef.current) coreRef.current.scale.setScalar(1);
            if (glowRef.current) glowRef.current.scale.setScalar(1);
            if (outerGlowRef.current) outerGlowRef.current.scale.setScalar(1);
            if (coronaRef.current) coronaRef.current.scale.setScalar(1);
        }
    });

    return (
        <group position={position}>
            {/* Interaction Hitbox - Optimized Size to prevent overlap */}
            <mesh
                visible={false}
                onClick={(e) => {
                    e.stopPropagation();
                    audio?.playClick();
                    onSelect(system.id);
                }}
                onPointerOver={() => {
                    document.body.style.cursor = 'pointer';
                    audio?.playHover();
                    onHover(system.id);
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'auto';
                    onUnhover();
                }}
            >
                <sphereGeometry args={[baseSize * 2.2, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Visuals Group */}
            <group>
                {/* Interactive Corona (Refined v3.1) */}
                {(isHovered || isCurrent) && (
                    <Sphere ref={coronaRef} args={[baseSize * 0.9, 32, 24]}>
                        <meshBasicMaterial
                            color={system.star.color}
                            transparent
                            opacity={0.06}
                            wireframe
                        />
                    </Sphere>
                )}

                {/* Star Core */}
                <mesh ref={coreRef}>
                    <sphereGeometry args={[baseSize * 0.45, 32, 32]} />
                    <meshBasicMaterial
                        color={system.star.color}
                        toneMapped={false}
                    />
                </mesh>

                {/* Inner Star Glow */}
                <sprite ref={glowRef} scale={[baseSize * 6, baseSize * 6, 1]}>
                    <spriteMaterial
                        map={glowTexture}
                        color={system.star.color}
                        transparent
                        opacity={isHovered ? 1.0 : 0.75}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </sprite>

                {/* Outer Ambient Glow Layer */}
                <sprite ref={outerGlowRef} scale={[baseSize * 10, baseSize * 10, 1]}>
                    <spriteMaterial
                        map={glowTexture}
                        color={system.star.color}
                        transparent
                        opacity={isHovered ? 0.35 : 0.2}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </sprite>

                {/* TARGET LOCK INDICATOR (Redesigned Brackets) */}
                {isCurrent && (
                    <group rotation={[Math.PI / 2, 0, 0]}>
                        {/* Inner delicate ring */}
                        <Line
                            points={new THREE.EllipseCurve(0, 0, baseSize + 1.2, baseSize + 1.2, 0, 2 * Math.PI, false, 0).getPoints(64).map(p => [p.x, p.y, 0]) as any}
                            color="#00ff88"
                            lineWidth={1}
                            transparent
                            opacity={0.5}
                        />
                        {/* Brackets (Replacing the "Square") */}
                        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
                            <group key={i} rotation={[0, 0, angle]}>
                                <Line
                                    points={[
                                        [baseSize + 1.4, baseSize + 1.8, 0],
                                        [baseSize + 1.8, baseSize + 1.8, 0],
                                        [baseSize + 1.8, baseSize + 1.4, 0]
                                    ]}
                                    color="#00ff88"
                                    lineWidth={2}
                                    transparent
                                    opacity={0.8}
                                />
                            </group>
                        ))}
                    </group>
                )}
            </group>

            {/* Connection line to Sol */}
            {system.id !== 'sol' && (
                <FlowingLine
                    start={[0, 0, 0]}
                    end={[-position.x, -position.y, -position.z]}
                    color={isCurrent ? '#00ff88' : isHovered ? '#44ccff' : '#114466'}
                    opacity={isCurrent ? 0.6 : isHovered ? 0.4 : 0.15}
                    isActive={isHovered || isCurrent}
                />
            )}
        </group>
    );
};


// Sub-component for the rotating star cluster
const ClusterGroup = ({ children }: { children: React.ReactNode }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += state.clock.getDelta() * 0.02;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group ref={groupRef}>
                {children}
            </group>
        </Float>
    );
};

/* ── Main GalaxyMap component ── */
export const GalaxyMap = ({ onSystemSelect, currentSystemId, onClose }: GalaxyMapProps) => {
    const systemsList = Object.values(SYSTEMS);
    const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);
    const audio = useAudio();

    const hoveredData = hoveredSystem ? SYSTEMS[hoveredSystem] : null;

    useEffect(() => {
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <div className="absolute inset-0 bg-[#00050a] z-50 overflow-hidden font-mono">
            {/* Cinematic Noise & Glitch Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] mix-blend-screen"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.3)_100%)]" />

            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #00ffff 2px)' }} />

            {/* ── Top Bar ── */}
            <div className="absolute top-0 left-0 right-0 z-30 px-8 py-6 flex items-center justify-between"
                style={{ background: 'linear-gradient(to bottom, rgba(0,10,20,0.9), transparent)' }}>
                <div className="flex items-center gap-6">
                    <div className="border-l-4 border-cyan-500 pl-4 py-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                            <span className="text-[10px] text-cyan-500/60 tracking-[0.4em] uppercase font-bold">Interstellar Map</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.4em] text-cyan-400 glitch-text uppercase">
                            Navigation
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] text-cyan-600 tracking-widest uppercase font-bold">
                                <Navigation size={10} className="text-cyan-500" />
                                {systemsList.length} Charted
                            </span>
                            <span className="w-1 h-1 rounded-full bg-cyan-900" />
                            <span className="text-[10px] text-emerald-600 tracking-[0.2em] uppercase font-bold animate-pulse">Drive Core Ready</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        audio.playPanelClose();
                        onClose();
                    }}
                    onMouseEnter={() => audio.playHover()}
                    className="group relative px-8 py-2 overflow-hidden"
                >
                    <div className="absolute inset-0 border border-red-500/40 group-hover:border-red-400 transition-colors" />
                    <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative text-red-500 text-xs font-black tracking-[0.3em] flex items-center gap-3">
                        <X size={16} /> ABORT NAV
                    </span>
                </button>
            </div>

            {/* ── Hover Info Panel ── */}
            <div className={`absolute bottom-10 left-10 z-30 w-80 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${hoveredData ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0 pointer-events-none'}`}>
                {hoveredData && (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                        <div className="relative rounded-lg border border-cyan-500/40 bg-black/90 backdrop-blur-2xl p-6 shadow-2xl overflow-hidden">
                            {/* Decorative scanline inside panel */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                                style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, #ffffff 2px)' }} />

                            <div className="flex items-start justify-between mb-5 border-b border-cyan-500/20 pb-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse"
                                        style={{ backgroundColor: hoveredData.star.color }}
                                    />
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-wider uppercase leading-none">{hoveredData.name}</h3>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold tracking-widest uppercase">
                                                {hoveredData.star.type} Class
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <MapPin size={18} className="text-cyan-500 opacity-50" />
                            </div>

                            <p className="text-xs text-cyan-100/70 leading-relaxed mb-8 font-medium italic">
                                {hoveredData.description}
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'DIST', val: hoveredData.distanceFromSol, unit: 'LY' },
                                    { label: 'OBJECTS', val: hoveredData.planets.length, unit: 'BODIES' },
                                    { label: 'TEMP', val: hoveredData.star.temp, unit: 'K' }
                                ].map((stat, i) => (
                                    <div key={i} className="relative p-2.5 rounded border border-white/5 bg-white/5 flex flex-col items-center justify-center">
                                        <div className="text-cyan-400 font-black text-base">{stat.val}</div>
                                        <div className="text-[8px] text-cyan-800 tracking-widest mt-1 font-black uppercase text-center">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 pt-4 border-t border-cyan-500/20 flex items-center justify-center gap-3">
                                <Zap size={12} className="text-yellow-400 animate-pulse" />
                                <span className="text-[10px] text-cyan-400 font-black tracking-[0.3em] uppercase">Initialize Warp Sequence</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── 3D Scene ── */}
            <Canvas camera={{ position: [0, 150, 200], fov: 45 }}>
                <color attach="background" args={['#041225']} />
                {/* Virtually vanishing fog for total clarity */}
                <fog attach="fog" args={['#041225', 500, 8000]} />
                <ambientLight intensity={2.0} />
                <pointLight position={[0, 50, 0]} intensity={1.5} color="#44ccff" />

                <Stars radius={1200} depth={300} count={8000} factor={8} saturation={1} fade speed={1.5} />
                <Stars radius={600} depth={150} count={3000} factor={4} saturation={0.5} fade speed={0.8} />

                <CosmicDust />
                <Nebula />
                <CameraHandler />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={2500} // Total freedom
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.8}
                />

                <ClusterGroup>
                    {systemsList.map((sys) => (
                        <StarNode
                            key={sys.id}
                            system={sys}
                            isCurrent={sys.id === currentSystemId}
                            isHovered={hoveredSystem === sys.id}
                            onSelect={onSystemSelect}
                            onHover={setHoveredSystem}
                            onUnhover={() => setHoveredSystem(null)}
                            audio={audio}
                        />
                    ))}
                </ClusterGroup>

                <EffectComposer enabled={true}>
                    <Bloom
                        luminanceThreshold={0.1} // Lower threshold for more glow
                        mipmapBlur
                        intensity={2.2} // Increased intensity
                        radius={0.5}
                    />
                    <Noise opacity={0.03} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};


