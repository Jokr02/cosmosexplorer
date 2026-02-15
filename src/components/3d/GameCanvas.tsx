import { Canvas } from '@react-three/fiber';
import { Suspense, memo, useState, useCallback, useEffect, useRef } from 'react';
import { StarField } from './StarField';
import { SolarSystem } from './SolarSystem';
import { PlanetInfo } from '../ui/PlanetInfo';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import type { StarSystemData } from '../../data/systems';
import type { AudioControls } from '../../hooks/useAudio';

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3 } from 'three';

interface GameCanvasProps {
    onPlanetSelect: (planet: any, position: [number, number, number]) => void;
    selectedPlanet: any;
    selectedPlanetPosition: [number, number, number] | null;
    isPaused: boolean;
    setIsPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
    isTrueScale: boolean;
    currentSystem: StarSystemData;
    audio?: AudioControls;
}

export const GameCanvas = memo(({ onPlanetSelect, selectedPlanet, selectedPlanetPosition, isPaused, setIsPaused, isTrueScale, currentSystem, audio }: GameCanvasProps) => {
    if (!currentSystem || !currentSystem.planets) return null;

    // Internal state for things NOT managed by App.tsx (like detailed view, camera modes)

    // We'll keep local state for UI modes specific to the canvas
    const [showInfo, setShowInfo] = useState(false);
    const [detailedView, setDetailedView] = useState(false);

    const [resetCamera, setResetCamera] = useState(false);
    const [arrivalAdjustment, setArrivalAdjustment] = useState(false);

    const [viewingMoons, setViewingMoons] = useState(false);
    const [exitingTopDown, setExitingTopDown] = useState(false); // Signal MoonViewHandler to start exit animation
    const exitModeRef = useRef<'toggle' | 'resume'>('toggle'); // Which exit flow triggered the animation
    const skipNavigationRef = useRef(false); // Skip camera travel when swapping moon↔parent

    // Sync handlePlanetSelect from props
    const handleLocalPlanetSelect = useCallback((planet: any, position: [number, number, number]) => {
        console.log('GameCanvas handleLocalPlanetSelect:', planet?.name);
        // If selecting a moon, update UI but DO NOT change camera or view state
        if (planet.isMoon) {
            skipNavigationRef.current = true;
            onPlanetSelect(planet, position);
            // Show the info panel directly for moons (no travel needed)
            setShowInfo(true);
            setDetailedView(true); // Moons skip the scan step, show full info immediately
            return;
        }

        // JUST notify App. Do not set local state yet.
        onPlanetSelect(planet, position);
    }, [onPlanetSelect]);

    // React to selectedPlanet change from App to initiate travel
    useEffect(() => {
        // Skip navigation when swapping moon↔parent (no camera travel needed)
        if (skipNavigationRef.current) {
            skipNavigationRef.current = false;
            return;
        }
        if (selectedPlanet && selectedPlanetPosition) {
            // Start travel to planet
            setShowInfo(false);
            setDetailedView(false);
            setViewingMoons(false);
            setArrivalAdjustment(true); // Trigger optimal camera positioning
        } else if (!selectedPlanet) {
            // Reset if deselected externally (e.g. back button)
            if (!showInfo) {
                // setResetCamera(true); // Optional: reset to system view? App.tsx might handle this via onPlanetSelect(null)
            }
        }
    }, [selectedPlanet, selectedPlanetPosition]);

    const handleTravelComplete = useCallback(() => {
        if (selectedPlanet) {
            setShowInfo(true);
            setArrivalAdjustment(false);
            // Automatically show detailed view for comets (matching moon behavior/UX)
            if (selectedPlanet.type === 'Comet') {
                setDetailedView(true);
            }
        }
    }, [selectedPlanet]);

    return (
        <div className="w-full h-full relative">
            <Canvas shadows onPointerMissed={() => console.log('Canvas pointer missed')}>
                <PerspectiveCamera makeDefault position={[0, 400, 0]} fov={60} far={20000} />
                <CameraHandler
                    shouldReset={resetCamera}
                    onResetComplete={() => setResetCamera(false)}
                    shouldAdjustArrival={arrivalAdjustment}
                    onArrivalComplete={handleTravelComplete}
                    selectedPlanetName={selectedPlanet?.name || null}
                    isTrueScale={isTrueScale}
                    viewingMoons={viewingMoons}
                />

                <OrbitControls
                    makeDefault
                    enabled={!viewingMoons} // Disable controls in Top-Down view (exit animation keeps viewingMoons=true)
                    enableRotate={true}
                    enableZoom={!showInfo}
                    enablePan={!showInfo}
                    maxDistance={800}
                    // Allow getting much closer in True Scale
                    // Game Scale: Min distance should guard against clipping. Radius * 1.5 is usually good min.
                    minDistance={selectedPlanet ? (
                        selectedPlanet.type === 'Star' ? 20 : (
                            viewingMoons ? selectedPlanet.size * 15 : (isTrueScale ? 0.1 : Math.max(selectedPlanet.size * 2 + 5, 8))
                        )
                    ) : 5}
                    zoomSpeed={3}
                />

                <color attach="background" args={['#000000']} />

                <ambientLight intensity={0.5} />
                <hemisphereLight args={["#ffffff", "#000000", 0.3]} />
                <pointLight
                    position={[0, 0, 0]}
                    intensity={currentSystem.star.lightIntensity || 6}
                    color={currentSystem.star.coronaColor || "#ffaa00"}
                    distance={5000}
                    decay={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />

                <Suspense fallback={null}>
                    <StarField />
                    <SolarSystem
                        onPlanetSelect={handleLocalPlanetSelect}
                        selectedPlanet={selectedPlanet}
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                        isTrueScale={isTrueScale}
                        currentSystem={currentSystem}
                    />
                    <PlanetTracker selectedPlanetName={selectedPlanet?.name || null} enabled={!viewingMoons} />
                    <MoonViewHandler
                        viewingMoons={viewingMoons}
                        selectedPlanet={selectedPlanet}
                        currentSystem={currentSystem}
                        shouldExit={exitingTopDown}
                        onExitComplete={() => {
                            setViewingMoons(false);
                            setExitingTopDown(false);
                            if (exitModeRef.current === 'resume') {
                                // Resume Mission: clear planet and fully reset
                                onPlanetSelect(null, [0, 0, 0]);
                                setResetCamera(true);
                            } else {
                                // Exit Top Down: return to planet orbit view with info panel
                                setShowInfo(true);
                            }
                        }}
                    />

                    <SceneDebugHelper
                        planets={currentSystem.planets}
                        onPlanetSelect={handleLocalPlanetSelect}
                    />
                    <CameraInitializer currentSystem={currentSystem} />
                </Suspense>
            </Canvas>



            {/* Planet Info Overlay */}
            {showInfo && selectedPlanet && (
                <PlanetInfo
                    planet={selectedPlanet}
                    onClose={() => {
                        // Resuming from Moon View:
                        if (selectedPlanet?.isMoon && selectedPlanet.parentName) {
                            // Go back to the parent planet's info card, staying in top-down view
                            const parentPlanet = currentSystem.planets.find(p => p.name === selectedPlanet.parentName);
                            if (parentPlanet) {
                                skipNavigationRef.current = true;
                                onPlanetSelect(parentPlanet, selectedPlanetPosition || [0, 0, 0]);
                                setShowInfo(true);
                                setDetailedView(false);
                                setViewingMoons(true);
                                return;
                            }
                        }

                        // Default: Resume to System View
                        if (!viewingMoons) {
                            // Not in top-down, just exit normally
                            setShowInfo(false);
                            setDetailedView(false);
                            onPlanetSelect(null, [0, 0, 0]);
                            setResetCamera(true);
                            setViewingMoons(false);
                        } else {
                            // In top-down view: start exit animation
                            // Hide UI immediately, but keep viewingMoons=true & selectedPlanet
                            // so MoonViewHandler can run the exit animation
                            setShowInfo(false);
                            setDetailedView(false);
                            exitModeRef.current = 'resume';
                            setExitingTopDown(true);
                        }
                    }}
                    onDetailsClick={() => setDetailedView(true)}
                    isDetailedView={detailedView}
                    onViewMoons={() => {
                        if (viewingMoons) {
                            // Signal MoonViewHandler to play exit animation
                            // viewingMoons stays true until animation completes
                            exitModeRef.current = 'toggle';
                            setExitingTopDown(true);
                        } else {
                            setViewingMoons(true);
                        }
                    }}
                    viewingMoons={viewingMoons}
                    audio={audio}
                />
            )}
        </div>
    );
});

const SceneDebugHelper = ({ planets, onPlanetSelect }: { planets?: any[], onPlanetSelect?: (planet: any, position: [number, number, number]) => void }) => {
    const { scene, camera, size } = useThree();
    const stateRef = useRef({ scene, camera, size });
    const planetsRef = useRef(planets);
    const onPlanetSelectRef = useRef(onPlanetSelect);

    // Keep refs updated
    useEffect(() => {
        stateRef.current = { scene, camera, size };
    }, [scene, camera, size]);
    useEffect(() => { planetsRef.current = planets; }, [planets]);
    useEffect(() => { onPlanetSelectRef.current = onPlanetSelect; }, [onPlanetSelect]);

    useEffect(() => {
        // Expose a function to find any named object's screen coordinates
        (window as any).__findPlanet = (name: string) => {
            const { scene, camera, size } = stateRef.current;
            const obj = scene.getObjectByName(name);
            if (!obj) {
                const names: string[] = [];
                scene.traverse((child: any) => { if (child.name) names.push(child.name); });
                return { error: `"${name}" not found`, availableNames: names };
            }
            const worldPos = new Vector3();
            obj.getWorldPosition(worldPos);
            const projected = worldPos.clone().project(camera);
            const screenX = Math.round((projected.x + 1) / 2 * size.width);
            const screenY = Math.round((-projected.y + 1) / 2 * size.height);
            return { name, screenX, screenY, behindCamera: projected.z > 1 };
        };

        // Expose a function to list all named scene objects
        (window as any).__listPlanets = () => {
            const names: string[] = [];
            stateRef.current.scene.traverse((child: any) => { if (child.name) names.push(child.name); });
            return names;
        };

        // Programmatically select a planet by name (no pixel clicking needed)
        (window as any).__selectPlanet = (name: string) => {
            const { scene } = stateRef.current;
            const planets = planetsRef.current;
            const selectFn = onPlanetSelectRef.current;
            if (!planets || !selectFn) return { error: 'Planet data or select function not available' };

            const planetData = planets.find((p: any) => p.name === name);
            if (!planetData) {
                return { error: `Planet "${name}" not found in data`, available: planets.map((p: any) => p.name) };
            }

            // Get world position from the Three.js scene
            const obj = scene.getObjectByName(name);
            if (obj) {
                const worldPos = new Vector3();
                obj.getWorldPosition(worldPos);
                selectFn(planetData, [worldPos.x, worldPos.y, worldPos.z]);
                return { success: true, name, position: [worldPos.x, worldPos.y, worldPos.z] };
            } else {
                // Fallback: use initial calculated position
                const x = planetData.distance * Math.cos(planetData.angle || 0);
                const z = planetData.distance * Math.sin(planetData.angle || 0);
                selectFn(planetData, [x, 0, z]);
                return { success: true, name, position: [x, 0, z], note: 'Used fallback position' };
            }
        };

        // Programmatically pause/resume orbit (toggles)
        (window as any).__pauseOrbit = () => {
            const btn = document.querySelector('button[title="Pause Orbit"]') as HTMLButtonElement
                || document.querySelector('button[title="Resume Orbit"]') as HTMLButtonElement;
            if (btn) { btn.click(); return { success: true, action: btn.title }; }
            return { error: 'Pause/Resume button not found' };
        };

        // Programmatically click any button by text content match
        (window as any).__clickButton = (text: string) => {
            const btn = Array.from(document.querySelectorAll('button')).find(
                b => b.textContent?.toUpperCase().includes(text.toUpperCase())
            ) as HTMLButtonElement | undefined;
            if (btn) { btn.click(); return { success: true, clicked: btn.textContent?.trim() }; }
            return { error: `Button containing "${text}" not found`, available: Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean) };
        };

        return () => {
            delete (window as any).__findPlanet;
            delete (window as any).__listPlanets;
            delete (window as any).__selectPlanet;
            delete (window as any).__pauseOrbit;
            delete (window as any).__clickButton;
        };
    }, []);

    return null;
};

const CameraInitializer = ({ currentSystem }: { currentSystem?: StarSystemData }) => {
    const { camera, controls } = useThree();
    useEffect(() => {
        // Compute camera distance based on the outermost planet orbit
        let maxDist = 200; // default
        if (currentSystem?.planets && currentSystem.planets.length > 0) {
            maxDist = Math.max(...currentSystem.planets.map(p => p.distance));
        }
        // Camera height: close enough to see the whole system, with some padding
        // Minimum 50 for very compact systems, capped at 400 for large ones
        const camDist = Math.min(Math.max(maxDist * 1.4, 50), 400);
        camera.position.set(0, camDist, camDist);
        camera.lookAt(0, 0, 0);
        if (controls) {
            // @ts-ignore
            controls.target.set(0, 0, 0);
            // @ts-ignore
            controls.update();
        }
    }, [camera, controls]);
    return null;
};

const CameraHandler = ({ shouldReset, onResetComplete, shouldAdjustArrival, onArrivalComplete, selectedPlanetName, isTrueScale = false, viewingMoons = false }: { shouldReset: boolean; onResetComplete: () => void; shouldAdjustArrival?: boolean; onArrivalComplete?: () => void; selectedPlanetName?: string | null; isTrueScale?: boolean; viewingMoons?: boolean }) => {
    const { camera, controls, scene } = useThree();
    const [targetPos, setTargetPos] = useState<Vector3 | null>(null);
    const [startCameraPos, setStartCameraPos] = useState<Vector3 | null>(null);
    const [startControlTarget, setStartControlTarget] = useState<Vector3 | null>(null);
    const [alignmentTarget, setAlignmentTarget] = useState<Vector3 | null>(null); // Target to look at (0,0,0 for reset, Planet for arrival)
    const [resetTime, setResetTime] = useState(0);

    useFrame((_, delta) => {
        if (shouldReset) {
            if (!targetPos) {
                // calculate target position preserving azimuth
                const currentPos = camera.position.clone();

                // Safety check for NaN/Invalid position
                if (isNaN(currentPos.x) || isNaN(currentPos.y) || isNaN(currentPos.z)) {
                    console.warn("Camera position was NaN, resetting to default.");
                    currentPos.set(0, 400, 400);
                    camera.position.copy(currentPos);
                }

                // Project current position to XZ plane to get azimuth
                const azimuth = new Vector3(currentPos.x, 0, currentPos.z).normalize();

                // If we are somewhat valid
                if (azimuth.lengthSq() < 0.1 || isNaN(azimuth.x)) azimuth.set(0, 0, 1);

                // Target: Up at Y=400, and pulled back 300 units along the *same* azimuth
                const newPos = azimuth.multiplyScalar(300).setY(400);

                setTargetPos(newPos);
                setStartCameraPos(currentPos);
                // @ts-ignore
                setStartControlTarget(controls ? controls.target.clone() : new Vector3());
                setAlignmentTarget(new Vector3(0, 0, 0));
                setResetTime(0);
            }

            if (targetPos && startCameraPos && startControlTarget) {
                // Smooth interpolation variable
                // Using a slightly eased time variable for smoother motion
                setResetTime(prev => Math.min(prev + delta * 1.5, 1)); // Adjust speed here, 1.5 is moderate
                const t = resetTime;

                // Ease out cubic
                const ease = 1 - Math.pow(1 - t, 3);

                // Lerp Camera Position
                camera.position.lerpVectors(startCameraPos, targetPos, ease);

                // Lerp Controls Target (LookAt)
                if (controls) {
                    const origin = alignmentTarget || new Vector3(0, 0, 0);
                    // @ts-ignore
                    controls.target.lerpVectors(startControlTarget, origin, ease);
                    // @ts-ignore
                    controls.update();
                }

                if (t >= 0.99) {
                    camera.position.copy(targetPos);
                    const finalLookAt = alignmentTarget || new Vector3(0, 0, 0);
                    camera.lookAt(finalLookAt);

                    if (controls) {
                        // @ts-ignore
                        controls.target.copy(finalLookAt);
                        // @ts-ignore
                        controls.update();
                    }

                    setTargetPos(null);
                    setStartCameraPos(null);
                    setStartControlTarget(null);
                    onResetComplete();
                }
            }
        } else if (shouldAdjustArrival && selectedPlanetName && onArrivalComplete) {
            const obj = scene.getObjectByName(selectedPlanetName);
            if (obj) {
                const worldPos = new Vector3();
                obj.getWorldPosition(worldPos);

                // Calculate direction from Object to Sun
                const distToCenter = worldPos.length();
                let dirToSun = new Vector3(0, 0, 1); // Default safe vector
                let isStar = false;

                if (distToCenter < 1) {
                    // Case: We are at the Star (Center)
                    isStar = true;
                    const camDir = camera.position.clone().sub(worldPos).normalize();
                    // If camera is exactly at 0,0,0 too (impossible?), fallback to Z
                    if (camDir.lengthSq() < 0.1) dirToSun = new Vector3(0, 0, 1);
                    else dirToSun = camDir.negate();
                } else {
                    dirToSun = worldPos.clone().negate().normalize();
                }

                // Calculate discrete Side Vector (Tangent) for a "Quarter View"
                // Cross dirToSun with Up (0,1,0)
                // If dirToSun is exactly Up/Down, this fails, but planets are on XZ plane usually.
                let sideVec = new Vector3(1, 0, 0);
                if (Math.abs(dirToSun.y) < 0.99) {
                    sideVec = new Vector3().crossVectors(dirToSun, new Vector3(0, 1, 0)).normalize();
                }

                // Find radius - handle Group wrapping
                let radius = 2; // Fallback

                // If Group, find first Mesh child
                let geometryObj = obj;
                if (obj.type === 'Group') {
                    // Try to find the visual mesh
                    // 1. MeshStandardMaterial (Planets)
                    // 2. Any Mesh (Sun/StarSurfaceShader)
                    let visualMesh = obj.children.find(c => (c as any).isMesh && ((c as any).material?.type === 'MeshStandardMaterial'));
                    if (!visualMesh) {
                        visualMesh = obj.children.find(c => (c as any).isMesh);
                    }

                    if (visualMesh) {
                        geometryObj = visualMesh;
                    }
                }

                // @ts-ignore
                if (geometryObj.geometry?.parameters?.radius) {
                    // @ts-ignore
                    radius = geometryObj.geometry.parameters.radius;
                }

                // Account for World Scale!
                const worldScale = new Vector3();
                geometryObj.getWorldScale(worldScale);
                radius *= worldScale.x; // Assume uniform scale logic check

                // Distance calculation
                let dist = 10;
                if (isTrueScale) {
                    dist = Math.max(radius * 1.5, 0.4);
                } else {
                    // Game Scale
                    if (isStar) {
                        // For the Sun/Star: ensure we are far enough back!
                        // Even if radius detection fails (fallback=2), force a minimum distance.
                        // Star visual size is often ~10-15.
                        const safeRadius = Math.max(radius, 15);
                        dist = safeRadius * 4;
                    } else {
                        // Planets
                        dist = Math.max(radius * 8 + 10, 20);
                    }
                }

                // Position: Offset 
                let offsetDir: Vector3;
                let idealPos = worldPos.clone();

                if (isStar) {
                    // Force a consistent majestic view for the Sun
                    // High angle, decent distance.
                    // Ignoring current camera vector to ensure we don't get stuck in weird angles
                    const fixedDist = isTrueScale ? (radius * 5) : 140; // Tuned for better close-up
                    const fixedHeight = isTrueScale ? (radius * 2) : 50;

                    // Arbitrary nice angle (Quarter view)
                    offsetDir = new Vector3(0, fixedHeight, fixedDist).normalize();
                    // Just overwrite idealPos logic
                    idealPos.copy(worldPos).add(new Vector3(0, fixedHeight, fixedDist));
                } else {
                    // Mix: 30% Sunward, 70% Sideward for planets (Lit Crescent/Half view)
                    offsetDir = dirToSun.clone().multiplyScalar(0.4).add(sideVec.multiplyScalar(0.9)).normalize();
                    idealPos.copy(worldPos).add(offsetDir.multiplyScalar(dist));
                    idealPos.y += radius * (isTrueScale ? 0.2 : 1.0);
                }

                console.log(`Arriving at ${selectedPlanetName}: IsStar=${isStar} FixedPos=`, idealPos);

                if (isNaN(idealPos.x) || isNaN(idealPos.y) || isNaN(idealPos.z)) {
                    console.error("Computed arrival position is NaN! Aborting move.");
                    setTargetPos(null);
                    setStartCameraPos(null);
                    setStartControlTarget(null);
                    onArrivalComplete();
                    return;
                }

                // Use the same smooth transition logic as reset
                setTargetPos(idealPos);
                setStartCameraPos(camera.position.clone());
                // @ts-ignore
                setStartControlTarget(controls ? controls.target.clone() : new Vector3());
                setAlignmentTarget(worldPos.clone());
                setResetTime(0);

                onArrivalComplete(); // We mark arrival as 'planned'
            } else {
                onArrivalComplete();
            }
        } else {
            // If viewing moons, yield all camera control to MoonViewHandler
            if (viewingMoons) {
                // Clear any in-progress animation so we don't resume it later
                if (targetPos) {
                    setTargetPos(null);
                    setStartCameraPos(null);
                    setStartControlTarget(null);
                }
                return;
            }

            if (targetPos && startCameraPos && startControlTarget) {
                // CONTINUATION OF MOVEMENT (Shared logic)
                setResetTime(prev => Math.min(prev + delta * 0.8, 1));
                const t = resetTime;
                const ease = 1 - Math.pow(1 - t, 3);

                camera.position.lerpVectors(startCameraPos, targetPos, ease);

                // Clear state when animation is complete to stop overriding camera
                if (t >= 0.99) {
                    camera.position.copy(targetPos);
                    setTargetPos(null);
                    setStartCameraPos(null);
                    setStartControlTarget(null);
                }
            }
        }
    });

    return null;
};



const MoonViewHandler = ({ viewingMoons, selectedPlanet, currentSystem, shouldExit, onExitComplete }: { viewingMoons: boolean, selectedPlanet: any, currentSystem?: StarSystemData, shouldExit?: boolean, onExitComplete?: () => void }) => {
    const { camera, scene } = useThree();

    // Saved state for smooth restore on exit
    const savedCameraPosRef = useRef<Vector3 | null>(null);
    const savedCameraUpRef = useRef<Vector3 | null>(null);

    // Transition progress (0→1) for enter/exit animations
    const transitionProgressRef = useRef(0);
    const enterStartPosRef = useRef<Vector3 | null>(null);
    const enterStartUpRef = useRef<Vector3 | null>(null);
    const hasEnteredRef = useRef(false);

    // Exit transition state
    const isExitingRef = useRef(false);
    const exitStartPosRef = useRef<Vector3 | null>(null);
    const exitStartUpRef = useRef<Vector3 | null>(null);
    const exitTargetPosRef = useRef<Vector3 | null>(null);
    const exitTargetLookAtRef = useRef<Vector3 | null>(null);

    const TRANSITION_SPEED = 0.7; // ~1.4 seconds for full transition

    useFrame((_, delta) => {
        if (!viewingMoons || !selectedPlanet) {
            // Reset all state when not viewing moons
            if (hasEnteredRef.current) {
                hasEnteredRef.current = false;
                isExitingRef.current = false;
                camera.up.set(0, 1, 0);
                savedCameraPosRef.current = null;
                savedCameraUpRef.current = null;
            }
            return;
        }

        const planetObject = scene.getObjectByName(selectedPlanet.name);
        if (!planetObject) return;

        const worldPos = new Vector3();
        planetObject.getWorldPosition(worldPos);

        // --- EXIT TRANSITION (plays while viewingMoons is still true) ---
        if (isExitingRef.current && exitStartPosRef.current && exitTargetPosRef.current) {
            transitionProgressRef.current = Math.min(transitionProgressRef.current + delta * TRANSITION_SPEED, 1);
            const t = transitionProgressRef.current;
            const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic

            // Lerp position from top-down back to saved orbit position
            camera.position.lerpVectors(exitStartPosRef.current, exitTargetPosRef.current, ease);

            // Lerp up vector from top-down (0,0,-1) back to normal (0,1,0)
            if (exitStartUpRef.current) {
                const up = exitStartUpRef.current.clone().lerp(new Vector3(0, 1, 0), ease).normalize();
                camera.up.copy(up);
            }

            // Keep looking at the planet throughout
            camera.lookAt(exitTargetLookAtRef.current || worldPos);
            camera.updateProjectionMatrix();

            if (t >= 1) {
                // Exit animation complete
                camera.position.copy(exitTargetPosRef.current);
                camera.up.set(0, 1, 0);
                camera.lookAt(exitTargetLookAtRef.current || worldPos);

                isExitingRef.current = false;
                exitStartPosRef.current = null;
                exitStartUpRef.current = null;
                exitTargetPosRef.current = null;
                exitTargetLookAtRef.current = null;
                savedCameraPosRef.current = null;
                savedCameraUpRef.current = null;
                hasEnteredRef.current = false;

                // Signal parent to set viewingMoons=false NOW
                onExitComplete?.();
            }
            return;
        }

        // --- DETECT shouldExit signal: start exit animation from current top-down position ---
        if (shouldExit && !isExitingRef.current && savedCameraPosRef.current) {
            isExitingRef.current = true;
            exitStartPosRef.current = camera.position.clone();  // Current top-down position
            exitStartUpRef.current = camera.up.clone();          // Current up (0,0,-1)
            exitTargetPosRef.current = savedCameraPosRef.current.clone(); // Saved orbit position
            exitTargetLookAtRef.current = worldPos.clone();
            transitionProgressRef.current = 0;
            return;
        }

        // --- ENTER TRANSITION & TRACKING ---
        // Calculate desired top-down camera position
        const maxDist = selectedPlanet.moonsData && selectedPlanet.moonsData.length > 0
            ? Math.max(...selectedPlanet.moonsData.map((m: any) => m.distance))
            : (selectedPlanet.details?.moons > 0 ? 10 : 5);

        // Significantly closer view: 2.2x max moon distance instead of 4x, and lower ceiling
        const desiredHeight = Math.max(maxDist * 2.2, 25);

        // Determine the relevant axial tilt (use parent planet's tilt if it's a moon)
        let axialTilt = selectedPlanet.axialTilt || 0;
        if (selectedPlanet.parentName && currentSystem?.planets) {
            const parent = currentSystem.planets.find((p: any) => p.name === selectedPlanet.parentName);
            if (parent) axialTilt = parent.axialTilt || 0;
        }

        const tiltRad = THREE.MathUtils.degToRad(axialTilt);
        const cosT = Math.cos(tiltRad);
        const sinT = Math.sin(tiltRad);

        // Position: Rotate [0, height, 0] around X by tiltRad
        const desiredCamPos = new Vector3(
            worldPos.x,
            worldPos.y + desiredHeight * cosT,
            worldPos.z + desiredHeight * sinT
        );

        // Up vector: Rotate [0, 0, -1] around X by tiltRad
        // y' = y*cos - z*sin = 0*cos - (-1)*sin = sin(tiltRad)
        // z' = y*sin + z*cos = 0*sin + (-1)*cos = -cos(tiltRad)
        const desiredUp = new Vector3(0, sinT, -cosT);

        if (!hasEnteredRef.current) {
            // First frame: save camera state and start enter transition
            hasEnteredRef.current = true;
            savedCameraPosRef.current = camera.position.clone();
            savedCameraUpRef.current = camera.up.clone();
            enterStartPosRef.current = camera.position.clone();
            enterStartUpRef.current = camera.up.clone();
            transitionProgressRef.current = 0;
        }

        if (transitionProgressRef.current < 1) {
            // Smooth enter transition
            transitionProgressRef.current = Math.min(transitionProgressRef.current + delta * TRANSITION_SPEED, 1);
            const t = transitionProgressRef.current;
            const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic

            if (enterStartPosRef.current) {
                camera.position.lerpVectors(enterStartPosRef.current, desiredCamPos, ease);
            }

            // Smoothly rotate up vector from current to tilted pole's relative up
            if (enterStartUpRef.current) {
                const up = enterStartUpRef.current.clone().lerp(desiredUp, ease).normalize();
                camera.up.copy(up);
            }

            camera.lookAt(worldPos);
            camera.updateProjectionMatrix();

            if (t >= 1) {
                enterStartPosRef.current = null;
                enterStartUpRef.current = null;
            }
        } else {
            // Post-transition: smoothly track the planet (in case it's orbiting)
            const lerpFactor = Math.min(delta * 10, 0.3);
            camera.position.lerp(desiredCamPos, lerpFactor);

            camera.up.copy(desiredUp);
            camera.lookAt(worldPos);
            camera.updateProjectionMatrix();
        }
    });

    return null;
};

const PlanetTracker = ({ selectedPlanetName, enabled = true }: { selectedPlanetName: string | null, enabled?: boolean }) => {
    const { camera, scene, controls } = useThree();

    useFrame(() => {
        if (enabled && selectedPlanetName && controls) {
            const planetObject = scene.getObjectByName(selectedPlanetName);
            if (planetObject) {
                const worldPos = new Vector3();
                planetObject.getWorldPosition(worldPos);

                // Calculate movement delta for camera to follow
                // @ts-ignore
                const oldTarget = controls.target.clone();

                // @ts-ignore
                controls.target.lerp(worldPos, 0.1); // Smoothly move target

                // @ts-ignore
                const newTarget = controls.target.clone();
                const delta = newTarget.sub(oldTarget);

                // Move camera by same delta to maintain relative position/angle
                camera.position.add(delta);

                // @ts-ignore
                controls.update();
            }
        }
    });

    return null;
};
