import { Color, AdditiveBlending, BackSide } from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const AtmosphereMaterial = shaderMaterial(
  {
    glowColor: new Color(0.3, 0.6, 1.0),
    coef: 1.0,
    power: 4.0,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    uniform vec3 glowColor;
    uniform float coef;
    uniform float power;
    void main() {
      float intensity = pow(coef - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
      gl_FragColor = vec4(glowColor, 1.0) * intensity;
    }
  `
);

extend({ AtmosphereMaterial });

interface AtmosphereProps {
  radius: number;
  color: string;
  scale?: number;
  opacity?: number;
}

export const Atmosphere = ({ radius, color, scale = 1.2 }: AtmosphereProps) => {
  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[radius, 64, 64]} />
      {/* @ts-ignore */}
      <atmosphereMaterial
        glowColor={new Color(color)}
        coef={0.6} // Controls how "thick" the edge is
        power={4.0} // Controls falloff
        transparent
        blending={AdditiveBlending}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};
