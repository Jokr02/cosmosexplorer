import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * AtmosphericGlow - Adds a soft Fresnel-edge glow around planets with atmospheres.
 * Creates the effect of light scattering through a thin atmosphere at the limb.
 */
interface AtmosphericGlowProps {
    color: string;
    planetSize: number;
    scale?: number;   // how far glow extends (1.1 = 10% beyond surface)
    opacity?: number;
    pulseSpeed?: number;
}

export const AtmosphericGlow = ({ color, planetSize, scale = 1.15, opacity = 0.35, pulseSpeed = 0 }: AtmosphericGlowProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    // Custom shader for Fresnel glow effect
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(color) },
                intensity: { value: opacity },
                time: { value: 0 },
                pulseSpeed: { value: pulseSpeed }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewDir;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewDir = normalize(-mvPosition.xyz);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float intensity;
                uniform float time;
                uniform float pulseSpeed;
                varying vec3 vNormal;
                varying vec3 vViewDir;
                void main() {
                    float fresnel = 1.0 - dot(vNormal, vViewDir);
                    fresnel = pow(fresnel, 3.0);
                    float pulse = pulseSpeed > 0.0 ? 1.0 + sin(time * pulseSpeed) * 0.15 : 1.0;
                    gl_FragColor = vec4(glowColor, fresnel * intensity * pulse);
                }
            `,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
    }, [color, opacity, pulseSpeed]);

    // Disposal cleanup
    useEffect(() => {
        return () => {
            if (shaderMaterial) {
                shaderMaterial.dispose();
            }
        };
    }, [shaderMaterial]);

    useFrame(({ clock }) => {
        if (meshRef.current && pulseSpeed > 0) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} material={shaderMaterial}>
            <sphereGeometry args={[planetSize * scale, 48, 48]} />
        </mesh>
    );
};
