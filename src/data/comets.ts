export interface CometData {
    name: string;
    distance: number; // Perihelion distance (closest approach) or Semi-major axis? Let's use Semi-major axis for consistency with planets, but comets vary wildly. 
    // Actually, for the ellipse logic:
    // semiMajorAxis = (perihelion + aphelion) / 2
    // Halley: Perihelion ~0.6 AU, Aphelion ~35 AU -> SMA ~17.8 AU.
    size: number;
    color: string;
    speed: number;
    eccentricity: number;
    inclination: number;
    orbitOffset?: number; // Rotation around Y axis (degrees)
    orbitalPeriod: number; // in years (approx) or relative speed
    details: {
        description: string;
    };
}

export const COMETS: CometData[] = [
    {
        name: "Halley's Comet",
        distance: 135, // Scaled for game (Semi-major axis)
        size: 0.3, // Visually small
        color: '#ffffff', // Icy white
        speed: 0.8, // Base speed factor
        eccentricity: 0.77, // Perihelion ~31 units (Safe)
        inclination: 162.3, // Retrograde! (>90)
        orbitalPeriod: 75,
        orbitOffset: 58.4, // Longitude of Ascending Node
        details: {
            description: "Evidence of Halley's Comet dates back to 240 BC."
        }
    },
    {
        name: "Hale-Bopp",
        distance: 300, // Very long orbit, scaled
        size: 0.4, // Large nucleus
        color: '#aaddff', // Bluish
        speed: 0.6,
        eccentricity: 0.90, // Perihelion ~30 units (Safe)
        inclination: 89.4, // Nearly perpendicular
        orbitalPeriod: 2533,
        orbitOffset: 282.5, // Longitude of Ascending Node
        details: {
            description: "The Great Comet of 1997, visible to the naked eye for 18 months."
        }
    },
    {
        name: "Encke",
        distance: 70, // Increased slightly
        size: 0.2, // Small
        color: '#ccffcc', // Greenish (cyanogen)
        speed: 1.2, // Fast!
        eccentricity: 0.57, // Perihelion ~30 units (Safe)
        inclination: 11.7,
        orbitalPeriod: 3.3,
        orbitOffset: 334.6, // Longitude of Ascending Node
        details: {
            description: "Encke has the shortest orbital period of any known comet."
        }
    }
];
