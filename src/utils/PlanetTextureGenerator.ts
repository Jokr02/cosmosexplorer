
import * as THREE from 'three';

export type TextureType = 'GAS_GIANT' | 'TERRESTRIAL' | 'CRATERED' | 'ICE_GIANT' | 'SUN' | 'VOLCANIC';

// ─── Standard Perlin Noise Permutation ───
const p_init = Array.from({ length: 256 }, (_, i) => i);
// Shuffle using a fixed seed for consistency
for (let i = 255; i > 0; i--) {
    const j = Math.floor((i * 1664525 + 1013904223) % (i + 1));
    [p_init[i], p_init[j]] = [p_init[j], p_init[i]];
}
const permutation = [...p_init, ...p_init];

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);

const grad1D = (hash: number, x: number, y: number): number => {
    // 8 bit directions for better 2D coverage
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
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

// Fractal Brownian Motion — multiple octaves of noise layered together
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

    // Amplify contrast by scaling the final normalized value
    // Standard Perlin FBM usually resides in a narrow range around 0
    // Massively amplify contrast for visibility
    return Math.max(-1, Math.min(1, (value / maxValue) * 3.5));
};

// ─── Color utilities ───
const hexToRgb = (hex: string): [number, number, number] => {
    const c = hex.replace('#', '');
    return [
        parseInt(c.substring(0, 2), 16),
        parseInt(c.substring(2, 4), 16),
        parseInt(c.substring(4, 6), 16)
    ];
};

const lerpColor = (c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] => {
    const clamped = Math.max(0, Math.min(1, t));
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * clamped),
        Math.round(c1[1] + (c2[1] - c1[1]) * clamped),
        Math.round(c1[2] + (c2[2] - c1[2]) * clamped)
    ];
};

const rgbStr = (c: [number, number, number]) => `rgb(${c[0]},${c[1]},${c[2]})`;

const adjustColorRgb = (color: [number, number, number], amount: number): [number, number, number] => [
    Math.max(0, Math.min(255, color[0] + amount)),
    Math.max(0, Math.min(255, color[1] + amount)),
    Math.max(0, Math.min(255, color[2] + amount))
];

// Simple hash function for deterministic randomness from strings
const getSeedFromColors = (c1: string, c2: string): number => {
    const s = c1 + c2;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 1000;
};

// ─── Main export ───
export const generatePlanetCanvas = (type: TextureType, baseColor: string, secondaryColor: string, resolution = 1024): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d', { alpha: true })!;

    // Background fill
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, resolution, resolution);

    console.log(`[TextureGenerator] Generating: ${type} res=${resolution} base=${baseColor}`);

    if (type === 'GAS_GIANT') {
        generateGasGiantTexture(ctx, resolution, baseColor, secondaryColor, getSeedFromColors(baseColor, secondaryColor));
    } else if (type === 'ICE_GIANT') {
        generateIceGiantTexture(ctx, resolution, baseColor, secondaryColor, getSeedFromColors(baseColor, secondaryColor));
    } else if (type === 'TERRESTRIAL') {
        generateTerrestrialTexture(ctx, resolution, '#224488', '#228844', getSeedFromColors(baseColor, secondaryColor));
    } else if (type === 'CRATERED') {
        generateCrateredTexture(ctx, resolution, baseColor, secondaryColor, getSeedFromColors(baseColor, secondaryColor));
    } else if (type === 'VOLCANIC') {
        generateVolcanicTexture(ctx, resolution, baseColor, secondaryColor, getSeedFromColors(baseColor, secondaryColor));
    } else {
        // Fallback for Sun/Other
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, resolution, resolution);
    }

    // Verify Canvas Content (Debug)
    const centerPixel = ctx.getImageData(resolution / 2, resolution / 2, 1, 1).data;
    console.log(`[TextureGenerator] ${type} Canvas Center Pixel: R=${centerPixel[0]}, G=${centerPixel[1]}, B=${centerPixel[2]}, A=${centerPixel[3]}`);

    return canvas;
};

export const generatePlanetTexture = (type: TextureType, baseColor: string, secondaryColor: string, resolution = 1024): THREE.CanvasTexture => {
    const canvas = generatePlanetCanvas(type, baseColor, secondaryColor, resolution);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    return texture;
};

// ─── Gas Giant: turbulent banded atmosphere with storms ───
const generateGasGiantTexture = (ctx: CanvasRenderingContext2D, res: number, color1: string, color2: string, seed: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const dark = adjustColorRgb(c1, -60);
    const bright = adjustColorRgb(c2, 40);

    const imageData = ctx.createImageData(res, res);
    const data = imageData.data;

    // Randomize synthesis parameters based on seed
    const bandDensity = 8 + (seed % 12); // Bands between 8 and 20
    const bandOffset = (seed % 100) / 100 * Math.PI; // Shift bands up/down
    const turbulenceScale = 6 + (seed % 6); // Turbulence scale 6-12
    const stormFrequency = 3 + (seed % 5);

    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;

            // Base latitude bands with turbulent displacement
            const lat = v * Math.PI;
            const turbulence = fbm(u * turbulenceScale + seed, v * 3 + seed, 5, 2.2, 0.45);

            // Apply randomized band parameters
            const bandValue = Math.sin((lat + bandOffset) * bandDensity + turbulence * 4.0);

            // Storm features — large-scale perturbation
            const storm = fbm(u * stormFrequency + 100 + seed, v * stormFrequency + 100 + seed, 4, 2.0, 0.5);

            // Combine
            const t = (bandValue * 0.6 + storm * 0.3 + 0.5);
            let color: [number, number, number];

            if (t > 0.7) color = lerpColor(c2, bright, (t - 0.7) * 3);
            else if (t > 0.4) color = lerpColor(c1, c2, (t - 0.4) / 0.3);
            else color = lerpColor(dark, c1, t / 0.4);

            // Polar darkening
            const polarFade = Math.pow(Math.sin(lat), 0.3);
            color = lerpColor(adjustColorRgb(color, -40), color, polarFade);

            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Great Spot feature (Randomized position and presence)
    const hasSpot = seed % 3 !== 0; // 66% chance of a spot

    if (hasSpot) {
        // Random placement based on seed
        const spotLat = 0.3 + (seed % 40) / 100; // Between 0.3 and 0.7 height
        const spotLon = (seed % 100) / 100; // Anywhere horizontally

        const spotX = res * spotLon;
        const spotY = res * spotLat;
        const spotW = res * (0.05 + (seed % 5) / 100); // Width 0.05 - 0.10
        const spotH = spotW * 0.6; // Elliptical

        const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotW);
        spotGrad.addColorStop(0, rgbStr(adjustColorRgb(c2, 60)));
        spotGrad.addColorStop(0.5, rgbStr(adjustColorRgb(c2, 20)));
        spotGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.ellipse(spotX, spotY, spotW, spotH, 0, 0, Math.PI * 2);
        ctx.fill();
    }
};

// ─── Ice Giant: smooth gradients with faint wispy clouds ───
const generateIceGiantTexture = (ctx: CanvasRenderingContext2D, res: number, color1: string, color2: string, seed: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const imageData = ctx.createImageData(res, res);
    const data = imageData.data;

    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;

            // Smooth pole-to-pole gradient
            const lat = v;
            const baseGrad = Math.sin(lat * Math.PI);

            // Very subtle banding
            const bands = Math.sin(lat * 24) * 0.08;

            // Cloud wisps
            const clouds = fbm(u * 6 + seed, v * 4 + seed, 4, 2.0, 0.4) * 0.15;

            const t = baseGrad * 0.7 + bands + clouds + 0.3;
            const color = lerpColor(c1, c2, t);

            // Polar brightening (ice caps on ice giants)
            const polarBright = 1.0 - Math.pow(Math.sin(lat * Math.PI), 0.5) * 0.15;
            const final: [number, number, number] = [
                Math.min(255, Math.round(color[0] * polarBright)),
                Math.min(255, Math.round(color[1] * polarBright)),
                Math.min(255, Math.round(color[2] * polarBright))
            ];

            const idx = (y * res + x) * 4;
            data[idx] = final[0];
            data[idx + 1] = final[1];
            data[idx + 2] = final[2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

// ─── Terrestrial: Land/Ocean/Clouds ───
const generateTerrestrialTexture = (ctx: CanvasRenderingContext2D, res: number, oceanColor: string, landColor: string, seed: number) => {
    const ocean = hexToRgb(oceanColor);
    const land = hexToRgb(landColor);

    const imageData = ctx.createImageData(res, res);
    const data = imageData.data;
    const seedOffset = seed * 10;

    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;

            // Continental noise (Boost frequency for more detail)
            const h = fbm(u * 3 + seedOffset, v * 3 + seedOffset, 6, 2.0, 0.5);

            let color: [number, number, number];
            if (h > 0.1) {
                // Land (Higher contrast)
                const landT = (h - 0.1) * 2.0;
                color = lerpColor(land, adjustColorRgb(land, 60), landT);
            } else if (h > -0.1) {
                // Beach/Coast
                color = lerpColor(ocean, land, (h + 0.1) * 5);
            } else {
                // Deep Ocean
                color = ocean;
            }

            // Clouds (More dramatic)
            const clouds = fbm(u * 8 + seedOffset + 50, v * 8 + seedOffset + 50, 4) > 0.3;
            if (clouds) {
                color = lerpColor(color, [255, 255, 255], 0.7);
            }

            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

// ─── Cratered: moon/mercury-style with realistic impact craters ───
const generateCrateredTexture = (ctx: CanvasRenderingContext2D, res: number, color1: string, color2: string, seed: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const imageData = ctx.createImageData(res, res);
    const data = imageData.data;

    // Generate base terrain with noise
    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;

            const terrain = fbm(u * 8 + seed, v * 8 + seed, 5, 2.0, 0.5);
            const t = (terrain + 1) * 0.5; // Normalize to [0, 1]
            const color = lerpColor(c2, c1, t);

            const idx = (y * res + x) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Overlay craters of varying sizes
    const craterSizes = [
        { count: 8, sizeRange: [res * 0.04, res * 0.1] },    // Large
        { count: 30, sizeRange: [res * 0.015, res * 0.04] },  // Medium
        { count: 100, sizeRange: [res * 0.004, res * 0.015] } // Small
    ];

    for (const tier of craterSizes) {
        for (let i = 0; i < tier.count; i++) {
            const cx = Math.random() * res;
            const cy = Math.random() * res;
            const radius = tier.sizeRange[0] + Math.random() * (tier.sizeRange[1] - tier.sizeRange[0]);

            // Crater rim (bright ring)
            ctx.strokeStyle = rgbStr(adjustColorRgb(c1, 25));
            ctx.lineWidth = Math.max(1, radius * 0.12);
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();

            // Crater floor (darker)
            const floorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.85);
            floorGrad.addColorStop(0, rgbStr(adjustColorRgb(c2, -30)));
            floorGrad.addColorStop(0.7, rgbStr(adjustColorRgb(c2, -15)));
            floorGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = floorGrad;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
            ctx.fill();

            // Shadow on one side
            ctx.fillStyle = rgbStr(adjustColorRgb(c2, -50));
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(cx - radius * 0.15, cy - radius * 0.15, radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }
};

// ─── Volcanic: dark surface with magma cracks and hotspots ───
const generateVolcanicTexture = (ctx: CanvasRenderingContext2D, res: number, baseColor: string, magmaColor: string, seed: number) => {
    const base = hexToRgb(baseColor);
    const magma = hexToRgb(magmaColor);

    const imageData = ctx.createImageData(res, res);
    const data = imageData.data;

    for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
            const u = x / res;
            const v = y / res;

            // Dark rocky terrain
            const terrain = fbm(u * 10 + seed, v * 10 + seed, 5, 2.0, 0.5);
            const t = (terrain + 1) * 0.5;
            let color = lerpColor(adjustColorRgb(base, -40), base, t);

            // Lava cracks — thin bright lines where noise derivative is steep
            const dx = fbm(u * 12 + 0.01, v * 12, 4) - fbm(u * 12 - 0.01, v * 12, 4);
            const dy = fbm(u * 12, v * 12 + 0.01, 4) - fbm(u * 12, v * 12 - 0.01, 4);
            const gradient = Math.sqrt(dx * dx + dy * dy) * 50;

            if (gradient > 0.8) {
                const magmaIntensity = Math.min(1, (gradient - 0.8) * 3);
                color = lerpColor(color, magma, magmaIntensity * 0.8);
            }

            // Volcanic hotspots
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

    ctx.putImageData(imageData, 0, 0);
};
