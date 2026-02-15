import type { TextureType } from './PlanetTextureGenerator';
type ColorRGB = [number, number, number];

// ─── Noise Functions (Copied from textureGenerator.ts) ───
const permutation = Array.from({ length: 512 }, (_, i) => ((i * 1664525 + 1013904223) >>> 0) % 256);
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);
const grad1D = (hash: number, x: number, y: number): number => {
    const h = hash & 3;
    return (h & 1 ? -x : x) + (h & 2 ? -y : y);
};

const noise2D = (x: number, y: number): number => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = permutation[permutation[xi] + yi];
    const ab = permutation[permutation[xi] + yi + 1];
    const ba = permutation[permutation[xi + 1] + yi];
    const bb = permutation[permutation[xi + 1] + yi + 1];
    return lerp(
        lerp(grad1D(aa, xf, yf), grad1D(ba, xf - 1, yf), u),
        lerp(grad1D(ab, xf, yf - 1), grad1D(bb, xf - 1, yf - 1), u),
        v
    );
};

const fbm = (x: number, y: number, octaves: number = 6, lacunarity: number = 2.0, gain: number = 0.5): number => {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        value += amplitude * noise2D(x * frequency, y * frequency);
        maxValue += amplitude;
        amplitude *= gain;
        frequency *= lacunarity;
    }
    return value / maxValue;
};

// ─── Color Utilities ───
const hexToRgb = (hex: string): ColorRGB => {
    const c = hex.replace('#', '');
    return [
        parseInt(c.substring(0, 2), 16),
        parseInt(c.substring(2, 4), 16),
        parseInt(c.substring(4, 6), 16)
    ];
};

const lerpColor = (c1: ColorRGB, c2: ColorRGB, t: number): ColorRGB => {
    const clamped = Math.max(0, Math.min(1, t));
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * clamped),
        Math.round(c1[1] + (c2[1] - c1[1]) * clamped),
        Math.round(c1[2] + (c2[2] - c1[2]) * clamped)
    ];
};

const adjustColorRgb = (color: ColorRGB, amount: number): ColorRGB => [
    Math.max(0, Math.min(255, color[0] + amount)),
    Math.max(0, Math.min(255, color[1] + amount)),
    Math.max(0, Math.min(255, color[2] + amount))
];

const getSeedFromColors = (c1: string, c2: string): number => {
    const s = c1 + c2;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 1000;
};

// ─── Generators ───

const generateGasGiant = (data: Uint8ClampedArray, res: number, color1: string, color2: string, seed: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const dark = adjustColorRgb(c1, -60);
    const bright = adjustColorRgb(c2, 40);

    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;
            const lat = v * Math.PI;
            const turbulence = fbm(u * 8 + seed, v * 3 + seed, 5, 2.2, 0.45);
            const bandValue = Math.sin(lat * 12 + turbulence * 4.0);
            const storm = fbm(u * 4 + 100, v * 4 + 100, 4, 2.0, 0.5);
            const t = (bandValue * 0.6 + storm * 0.3 + 0.5);
            let color: ColorRGB;
            if (t > 0.7) color = lerpColor(c2, bright, (t - 0.7) * 3);
            else if (t > 0.4) color = lerpColor(c1, c2, (t - 0.4) / 0.3);
            else color = lerpColor(dark, c1, t / 0.4);
            const polarFade = Math.pow(Math.sin(lat), 0.3);
            color = lerpColor(adjustColorRgb(color, -40), color, polarFade);
            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }
};

// ... add other generators if needed, but Terresterial is the main one ...
const generateTerrestrial = (data: Uint8ClampedArray, res: number, oceanColor: string, landColor: string, seed: number) => {
    const ocean = hexToRgb(oceanColor);
    const land = hexToRgb(landColor);
    const deepOcean = adjustColorRgb(ocean, -40);
    const highland = adjustColorRgb(land, 30);
    const desert = adjustColorRgb(land, 50);
    const ice: ColorRGB = [230, 240, 255];

    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;
            const continental = fbm(u * 5 + seed, v * 5 + seed, 6, 2.1, 0.5);
            const detail = fbm(u * 20 + seed * 2, v * 20 + seed * 2, 4, 2.0, 0.5) * 0.15;
            const elevation = continental + detail;
            const seaLevel = 0.05;
            let color: ColorRGB;

            // [Debug block removed]

            if (elevation < seaLevel - 0.1) color = deepOcean;
            else if (elevation < seaLevel) color = lerpColor(deepOcean, ocean, (elevation - seaLevel + 0.1) * 10);
            else if (elevation < seaLevel + 0.15) color = lerpColor(land, highland, (elevation - seaLevel) / 0.15);
            else if (elevation < seaLevel + 0.3) color = lerpColor(highland, desert, (elevation - seaLevel - 0.15) / 0.15);
            else {
                const snowLine = 0.1 + Math.abs(v - 0.5) * 0.3;
                // Increased threshold from 0.2 to 0.45 to reduce global ice coverage
                if (elevation - seaLevel > snowLine + 0.45) color = ice;
                else color = adjustColorRgb(desert, -20);
            }
            const lat = Math.abs(v - 0.5) * 2.0;
            const iceLine = 0.82 + fbm(u * 10 + 300, v * 10 + 300, 3, 2.0, 0.5) * 0.06;

            // [Debug block removed]

            if (lat > iceLine) {
                const iceBlend = Math.min(1, (lat - iceLine) * 10);
                color = lerpColor(color, ice, iceBlend);
            }
            const cloudNoise = fbm(u * 8 + 500, v * 6 + 500, 4, 2.5, 0.5);
            if (cloudNoise > 0.15) {
                const cloudAlpha = Math.min(0.35, (cloudNoise - 0.15) * 1.5);
                color = lerpColor(color, [255, 255, 255], cloudAlpha);
            }
            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }
};

const generateIceGiant = (data: Uint8ClampedArray, res: number, color1: string, color2: string, seed: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;
            const lat = v;
            const baseGrad = Math.sin(lat * Math.PI);
            const bands = Math.sin(lat * 24) * 0.08;
            const clouds = fbm(u * 6 + seed, v * 4 + seed, 4, 2.0, 0.4) * 0.15;
            const t = baseGrad * 0.7 + bands + clouds + 0.3;
            const color = lerpColor(c1, c2, t);
            const polarBright = 1.0 - Math.pow(Math.sin(lat * Math.PI), 0.5) * 0.15;
            const idx = (y * res + x) * 4;
            data[idx] = Math.min(255, Math.round(color[0] * polarBright));
            data[idx + 1] = Math.min(255, Math.round(color[1] * polarBright));
            data[idx + 2] = Math.min(255, Math.round(color[2] * polarBright));
            data[idx + 3] = 255;
        }
    }
};

const generateCratered = (data: Uint8ClampedArray, res: number, color1: string, color2: string, seed: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;
            const terrain = fbm(u * 8 + seed, v * 8 + seed, 5, 2.0, 0.5);
            const t = (terrain + 1) * 0.5;
            const color = lerpColor(c2, c1, t);
            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }
    // Note: Craters are harder in worker without Canvas API context. 
    // We'll skip complex crater draws or return base.
};

const generateVolcanic = (data: Uint8ClampedArray, res: number, baseColor: string, magmaColor: string, seed: number) => {
    const base = hexToRgb(baseColor);
    const magma = hexToRgb(magmaColor);
    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;
            const terrain = fbm(u * 10 + seed, v * 10 + seed, 5, 2.0, 0.5);
            const t = (terrain + 1) * 0.5;
            let color = lerpColor(adjustColorRgb(base, -40), base, t);
            const dx = fbm(u * 12 + 0.01, v * 12, 4) - fbm(u * 12 - 0.01, v * 12, 4);
            const dy = fbm(u * 12, v * 12 + 0.01, 4) - fbm(u * 12, v * 12 - 0.01, 4);
            const gradient = Math.sqrt(dx * dx + dy * dy) * 50;
            if (gradient > 0.8) {
                const magmaIntensity = Math.min(1, (gradient - 0.8) * 3);
                color = lerpColor(color, magma, magmaIntensity * 0.8);
            }
            const hotspot = fbm(u * 5 + 300, v * 5 + 300, 3, 2.0, 0.5);
            if (hotspot > 0.3) {
                const glow = Math.min(1, (hotspot - 0.3) * 2);
                color = lerpColor(color, magma, glow * 0.4);
            }
            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }
};

onmessage = (e) => {
    const { type, baseColor, secondaryColor, resolution, id } = e.data;
    const seed = getSeedFromColors(baseColor, secondaryColor);

    const buffer = new Uint8ClampedArray(resolution * resolution * 4);

    switch (type as TextureType) {
        case 'GAS_GIANT': generateGasGiant(buffer, resolution, baseColor, secondaryColor, seed); break;
        case 'TERRESTRIAL':
            // DEBUG: Force Earth to Red
            if (baseColor === '#0000ff' || secondaryColor === '#00ff00' || (type === 'TERRESTRIAL' && resolution === 512)) {
                const c = [255, 0, 0];
                for (let i = 0; i < buffer.length; i += 4) {
                    buffer[i] = c[0]; buffer[i + 1] = c[1]; buffer[i + 2] = c[2]; buffer[i + 3] = 255;
                }
            } else {
                generateTerrestrial(buffer, resolution, baseColor, secondaryColor, seed);
            }
            break;
        case 'ICE_GIANT': generateIceGiant(buffer, resolution, baseColor, secondaryColor, seed); break;
        case 'CRATERED': generateCratered(buffer, resolution, baseColor, secondaryColor, seed); break;
        case 'VOLCANIC': generateVolcanic(buffer, resolution, baseColor, secondaryColor, seed); break;
        case 'SUN':
            const c = hexToRgb(baseColor);
            for (let i = 0; i < buffer.length; i += 4) {
                buffer[i] = c[0]; buffer[i + 1] = c[1]; buffer[i + 2] = c[2]; buffer[i + 3] = 255;
            }
            break;
    }

    // Return the raw buffer to main thread for DataTexture creation
    // This allows Three.js to re-upload the texture from RAM if WebGL context is lost

    // @ts-ignore
    self.postMessage({ id, buffer, width: resolution, height: resolution });
};
