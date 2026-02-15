import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DevHelpersProps {
    planets: any[];
    onPlanetSelect: (planet: any, position: [number, number, number]) => void;
    setIsPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
    isPaused: boolean;
}

export const useDevHelpers = ({ planets, onPlanetSelect, setIsPaused, isPaused }: DevHelpersProps) => {
    const { scene, camera, gl } = useThree();
    // @ts-ignore
    window.scene = scene;

    useEffect(() => {
        // Helper to find a planet object in the scene
        const findPlanetObject = (name: string) => {
            let found: THREE.Object3D | undefined;
            scene.traverse((obj) => {
                if (obj.name === name) {
                    found = obj;
                }
            });
            return found;
        };

        // @ts-ignore
        window.__selectPlanet = (name: string) => {
            const planetData = planets.find(p => p.name === name);
            if (!planetData) {
                // Check if it's a moon (not in top-level planets list, but maybe in sub-lists)
                // For now, simpler verification: just check top-level.
                // Actually SolarSystem passes `planets` which are top-level.
                return { error: `Planet '${name}' not found in data.`, available: planets.map(p => p.name) };
            }

            const planetObj = findPlanetObject(name);
            if (planetObj) {
                const worldPos = new THREE.Vector3();
                planetObj.getWorldPosition(worldPos);
                onPlanetSelect(planetData, [worldPos.x, worldPos.y, worldPos.z]);
                return { success: true, name, position: [worldPos.x, worldPos.y, worldPos.z] };
            } else {
                return { error: `Planet object '${name}' not found in scene.` };
            }
        };

        // @ts-ignore
        window.__pauseOrbit = () => {
            setIsPaused((prev) => !prev);
            return { success: true, action: !isPaused ? "Paused Orbit" : "Resumed Orbit" };
        };

        // @ts-ignore
        window.__listPlanets = () => {
            const names: string[] = [];
            scene.traverse((obj) => {
                if (obj.name) names.push(obj.name);
            });
            return names;
        };

        // @ts-ignore
        window.__findPlanet = (name: string) => {
            const obj = findPlanetObject(name);
            if (!obj) return { error: "Not found" };

            const worldPos = new THREE.Vector3();
            obj.getWorldPosition(worldPos);
            // Project to screen
            worldPos.project(camera);

            const width = gl.domElement.width;
            const height = gl.domElement.height;
            const x = (worldPos.x * .5 + .5) * width;
            const y = (-(worldPos.y * .5) + .5) * height;

            return {
                name,
                screenX: x,
                screenY: y,
                behindCamera: worldPos.z > 1 // simple check
            };
        };

        // @ts-ignore
        window.__clickButton = (text: string) => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(b => b.textContent?.toLowerCase().includes(text.toLowerCase()));
            if (button) {
                button.click();
                return { success: true, clicked: button.textContent };
            }
            return { error: "Button not found", available: buttons.map(b => b.textContent) };
        };

        return () => {
            // @ts-ignore
            delete window.__selectPlanet;
            // @ts-ignore
            delete window.__pauseOrbit;
            // @ts-ignore
            delete window.__listPlanets;
            // @ts-ignore
            delete window.__findPlanet;
            // @ts-ignore
            delete window.__clickButton;
        };
    }, [planets, onPlanetSelect, setIsPaused, isPaused, scene, camera, gl]);
};
