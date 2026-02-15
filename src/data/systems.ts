
import { PLANETS } from './planets';
import type { PlanetData } from './planets';

export interface StarData {
    name: string;
    size: number;
    color: string;
    temp: string; // Surface temperature
    mass: string; // Relative to Sol
    type: string;
    coronaColor?: string;
    lightIntensity?: number;
    age?: string;
    details?: string;
    composition?: Record<string, string>;
    luminosity: number; // Relative to Sol (Sol = 1.0)
}

export interface StarSystemData {
    id: string;
    name: string;
    description: string;
    star: StarData;
    planets: PlanetData[];
    distanceFromSol: number; // Light Years
    coordinates: [number, number, number]; // Galactic coordinates relative to Sol
    asteroidBelts?: AsteroidBeltData[]; // New: Optional asteroid belts
    comets?: CometData[]; // New: Optional comets
    habitableZone: { inner: number, outer: number }; // Relative to game units
}

export interface CometData {
    name: string;
    distance: number; // Semi-major axis (scaled)
    size: number;
    color: string;
    speed: number;
    eccentricity: number;
    inclination: number;
    orbitOffset?: number; // Rotation around Y axis (degrees)
    orbitalPeriod: number; // in years (approx)
    composition?: Record<string, string>;
    atmosphere?: Record<string, string>;
    details: {
        description: string;
        facts?: string[];
    };
}

export interface AsteroidBeltData {
    name: string;
    radius: number;      // Distance from star in AU
    width: number;       // Width of the belt in AU
    count: number;       // Number of asteroids to render
    minSize: number;     // Minimum size of asteroids
    maxSize: number;     // Maximum size of asteroids
    color: string;       // Overall color tint
}

export const SYSTEMS: Record<string, StarSystemData> = {
    'sol': {
        id: 'sol',
        name: 'Sol System',
        description: 'Our home system. A G-type main-sequence star hosting 8 planets, 5 dwarf planets, and billions of smaller bodies. The only known system harboring life.',
        star: {
            name: 'Sun',
            size: 15,
            color: '#FDB813',
            temp: '5,778 K',
            mass: '1.0 Solar Masses',
            type: 'G2V Main Sequence',
            coronaColor: '#ffaa00',
            lightIntensity: 6,
            age: '4.6 Billion Years',
            details: 'A yellow dwarf star containing 99.86% of all mass in the Solar System. Its core fuses 600 million tons of hydrogen into helium every second.',
            composition: {
                Hydrogen: '73.46%',
                Helium: '24.85%',
                Oxygen: '0.77%',
                Carbon: '0.29%',
                Iron: '0.16%',
                Neon: '0.12%',
                Nitrogen: '0.09%',
                Silicon: '0.07%',
                Magnesium: '0.05%',
                Sulfur: '0.04%'
            },
            luminosity: 1.0
        },
        asteroidBelts: [
            {
                name: "Main Belt",
                radius: 92, // Scaled for game view
                width: 15,
                count: 1500,
                minSize: 0.1,
                maxSize: 0.4,
                color: "#888888"
            },
            {
                name: "Kuiper Belt",
                radius: 450,
                width: 150,
                count: 3000,
                minSize: 0.2,
                maxSize: 0.6,
                color: "#667788"
            }
        ],
        planets: PLANETS,
        comets: [
            {
                name: "Halley's Comet",
                distance: 135,
                size: 0.3,
                color: '#ffffff',
                speed: 0.8,
                eccentricity: 0.77,
                inclination: 162.3,
                orbitalPeriod: 75,
                orbitOffset: 58.4,
                composition: {
                    'Water Ice': '80%',
                    'Carbon Monoxide': '10%',
                    'Methane/Ammonia': '5%',
                    'Silicates': 'Dust'
                },
                atmosphere: {
                    'Comma': 'Water Vapor/Dust',
                    'Ion Tail': 'Ionized Gases'
                },
                details: {
                    description: "The most famous comet in history, returning every 75-76 years.",
                    facts: [
                        "Evidence of Halley's Comet dates back to 240 BC.",
                        "It is the only naked-eye comet that might appear twice in a human lifetime.",
                        "Last seen in 1986, it will return in 2061."
                    ]
                }
            },
            {
                name: "Hale-Bopp",
                distance: 300,
                size: 0.4,
                color: '#aaddff',
                speed: 0.6,
                eccentricity: 0.90,
                inclination: 89.4,
                orbitalPeriod: 2533,
                orbitOffset: 282.5,
                composition: {
                    'Water Ice': '75%',
                    'Frozen Gases': '20%',
                    'Organic Silicates': 'Trace'
                },
                atmosphere: {
                    'Extended Coma': 'Cyanogen/Carbon Flux',
                    'Sodium Tail': 'Atomic Sodium'
                },
                details: {
                    description: "The Great Comet of 1997, visible to the naked eye for a record 18 months.",
                    facts: [
                        "It was one of the brightest comets of the 20th century.",
                        "It has an exceptionally large nucleus, estimated at 60 km in diameter.",
                        "Its orbital period is approximately 2,500 years."
                    ]
                }
            },
            {
                name: "Encke",
                distance: 70,
                size: 0.2,
                color: '#ccffcc',
                speed: 1.2,
                eccentricity: 0.57,
                inclination: 11.7,
                orbitalPeriod: 3.3,
                orbitOffset: 334.6,
                details: {
                    description: "A periodic comet with the shortest orbital period of any known comet.",
                    facts: [
                        "It completes an orbit around the Sun in just 3.3 years.",
                        "It is the progenitor of the Taurid meteor showers.",
                        "First identified as a periodic comet by Johann Franz Encke in 1819."
                    ]
                }
            }
        ],
        distanceFromSol: 0,
        coordinates: [0, 0, 0],
        habitableZone: { inner: 55, outer: 95 }
    },
    'alpha-centauri': {
        id: 'alpha-centauri',
        name: 'Alpha Centauri',
        description: 'The closest star system to the Sun at just 4.24 light years. A triple-star system — we visit Proxima Centauri, the smallest and closest of the three stars.',
        star: {
            name: 'Proxima Centauri',
            size: 5,
            color: '#ff4400',
            temp: '3,042 K',
            mass: '0.12 Solar Masses',
            type: 'M5.5Ve Red Dwarf',
            coronaColor: '#ff0000',
            lightIntensity: 3,
            age: '4.85 Billion Years',
            details: 'The closest star to the Sun. A flare star that randomly erupts with dramatic X-ray bursts, potentially stripping atmospheres from orbiting planets.',
            composition: {
                Hydrogen: '74.5%',
                Helium: '24.1%',
                Oxygen: '0.8%',
                Carbon: '0.3%',
                Iron: '0.2%',
                Neon: '0.1%'
            },
            luminosity: 0.0017
        },
        planets: [
            {
                name: 'Proxima b',
                distance: 25,
                size: 1.5,
                color: '#d4a373',
                description: 'The closest known exoplanet to Earth. Orbiting in the habitable zone of Proxima Centauri, this rocky world is tidally locked — one face baked in eternal daylight, the other frozen in perpetual night.',
                temp: '-39°C (avg)',
                angle: 0,
                composition: { 'Silicates': '~45%', 'Iron': '~35%', 'Water': 'Unknown' },
                atmosphere: { 'N2': 'Possible', 'CO2': 'Possible', 'O2': 'Unknown' },
                atmosphereSettings: { color: '#cd7f32', scale: 1.1, opacity: 0.4 },
                details: {
                    gravity: '10.5 m/s²',
                    orbitalPeriod: '11.2 days',
                    moons: 0,
                    dayLength: 'Tidally Locked',
                    facts: [
                        'Proxima b is the closest known exoplanet to Earth at 4.24 light years.',
                        'It orbits in the habitable zone but faces intense stellar flares from its red dwarf host.',
                        'Being tidally locked, the terminator line (day-night boundary) may be the most habitable zone.',
                        'A probe traveling at 20% the speed of light would reach Proxima b in about 20 years.',
                        'It receives about 65% of the energy Earth gets from the Sun.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#d4a373', secondary: '#8b5a2b' },
                orbitSpeed: 5,
                rotationSpeed: 0,
                eccentricity: 0.05,
                inclination: 0,
                axialTilt: 3
            },
            {
                name: 'Proxima d',
                distance: 12,
                size: 0.8,
                color: '#bbaa99',
                description: 'A sub-Earth mass planet orbiting very close to its star. Likely a scorched, airless rock baked by stellar radiation.',
                temp: '87°C',
                angle: 2.5,
                composition: { 'Silicates': '~60%', 'Iron': '~40%' },
                atmosphere: { 'None': 'Likely stripped' },
                details: {
                    gravity: '~5 m/s²',
                    orbitalPeriod: '5.1 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Proxima d is one of the lightest exoplanets ever detected (~0.26 Earth masses).',
                        'It orbits so close to its star that a year lasts just 5 days.',
                        'Confirmed in 2022 using radial velocity measurements.',
                        'Too hot for liquid water on its surface.'
                    ]
                },
                moonsData: [],
                textureType: 'CRATERED',
                textureColors: { base: '#bbaa99', secondary: '#887766' },
                orbitSpeed: 8,
                rotationSpeed: 0,
                eccentricity: 0.04,
                inclination: 0.5,
                axialTilt: 5
            }
        ],
        asteroidBelts: [
            {
                name: "Inner Dust Belt",
                radius: 40,
                width: 20,
                count: 1200,
                minSize: 0.1,
                maxSize: 0.3,
                color: "#998877"
            },
            {
                name: "Outer Cold Belt",
                radius: 300,
                width: 80,
                count: 2500,
                minSize: 0.2,
                maxSize: 0.5,
                color: "#778899"
            }
        ],
        distanceFromSol: 4.24,
        coordinates: [3, 2, 1],
        habitableZone: { inner: 18, outer: 32 }
    },
    'trappist-1': {
        id: 'trappist-1',
        name: 'TRAPPIST-1',
        description: 'A remarkable ultra-cool red dwarf hosting 7 Earth-sized temperate planets — the most found in any system. Three orbit in the habitable zone.',
        star: {
            name: 'TRAPPIST-1',
            size: 4,
            color: '#ff2222',
            temp: '2,566 K',
            mass: '0.09 Solar Masses',
            type: 'M8V Ultra-Cool Dwarf',
            coronaColor: '#aa0000',
            lightIntensity: 2,
            age: '7.6 Billion Years',
            details: 'An ultra-cool red dwarf barely larger than Jupiter. Despite its tiny size, it hosts 7 known terrestrial worlds — the most ever found around a single star.',
            composition: {
                Hydrogen: '75.2%',
                Helium: '24.5%',
                Lithium: 'Trace',
                Oxygen: '0.1%',
                Iron: '0.1%'
            },
            luminosity: 0.00052
        },
        planets: [
            {
                name: 'TRAPPIST-1b',
                distance: 15,
                size: 1.4,
                color: '#bbaadd',
                description: 'The innermost and hottest TRAPPIST-1 planet. A scorched rocky world likely covered in magma oceans on its star-facing side.',
                temp: '127°C',
                angle: 1,
                composition: { 'Iron': '~32%', 'Magnesium Silicate': '~30%', 'Silicon': '~15%' },
                atmosphere: { 'CO2': 'Possible', 'H2O': 'Unknown' },
                details: {
                    gravity: '9.0 m/s²',
                    orbitalPeriod: '1.51 days',
                    moons: 0,
                    dayLength: 'Tidally Locked',
                    facts: [
                        'TRAPPIST-1b completes an orbit in just 36 hours.',
                        'JWST observations in 2023 suggest it has little to no atmosphere.',
                        'It receives about 4× the radiation Earth gets from the Sun.',
                        'All 7 TRAPPIST-1 planets would fit inside Mercury\'s orbit.'
                    ]
                },
                moonsData: [],
                textureType: 'CRATERED',
                textureColors: { base: '#885544', secondary: '#442211' },
                orbitSpeed: 6, rotationSpeed: 0, eccentricity: 0.01, inclination: 0, axialTilt: 0
            },
            {
                name: 'TRAPPIST-1d',
                distance: 22,
                size: 1.0,
                color: '#aaccee',
                description: 'Sitting at the inner edge of the habitable zone, this small rocky world may have a thin atmosphere and traces of water.',
                temp: '15°C',
                angle: 2.5,
                composition: { 'Rock': '~55%', 'Iron': '~30%', 'Water': '~15%' },
                atmosphere: { 'N2': 'Possible', 'CO2': 'Possible' },
                atmosphereSettings: { color: '#aaccee', scale: 1.1, opacity: 0.3 },
                details: {
                    gravity: '5.7 m/s²',
                    orbitalPeriod: '4.05 days',
                    moons: 0,
                    dayLength: 'Tidally Locked',
                    facts: [
                        'TRAPPIST-1d is the lightest of the 7 planets (~0.39 Earth masses).',
                        'It sits at the inner edge of the habitable zone.',
                        'A year on TRAPPIST-1d is shorter than a work week.',
                        'Its density suggests a significant water content.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#aaccee', secondary: '#778899' },
                orbitSpeed: 4.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            },
            {
                name: 'TRAPPIST-1e',
                distance: 35,
                size: 1.2,
                color: '#44aa88',
                description: 'The most Earth-like world in the TRAPPIST-1 system. Located squarely in the habitable zone, it is the strongest candidate for liquid surface water and potential life.',
                temp: '-20°C',
                angle: 3,
                composition: { 'Rock': '~50%', 'Water/Ice': '~50%' },
                atmosphere: { 'N2': 'Possible', 'O2': 'Unknown', 'H2O': 'Possible' },
                atmosphereSettings: { color: '#00ddff', scale: 1.2, opacity: 0.6 },
                details: {
                    gravity: '9.2 m/s²',
                    orbitalPeriod: '6.1 days',
                    moons: 0,
                    dayLength: 'Tidally Locked',
                    facts: [
                        'TRAPPIST-1e is considered the best candidate for habitability in the system.',
                        'Its density is very close to Earth\'s, suggesting a rocky composition with water.',
                        'JWST is actively studying its atmosphere for biosignatures.',
                        'Standing on TRAPPIST-1e, you could see all 6 sister planets — some larger than the Moon.',
                        'The star would appear salmon-pink and 3× larger than the Sun appears from Earth.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#F4E4BC', secondary: '#E6D6A8' },
                orbitSpeed: 2.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.2, axialTilt: 0
            },
            {
                name: 'TRAPPIST-1f',
                distance: 45,
                size: 1.3,
                color: '#88bbdd',
                description: 'An icy world at the outer edge of the habitable zone. With a thick ice shell, it may harbor a subsurface ocean powered by tidal heating.',
                temp: '-55°C',
                angle: 4.5,
                composition: { 'Rock': '~40%', 'Water/Ice': '~60%' },
                atmosphere: { 'CO2': 'Possible', 'N2': 'Possible' },
                atmosphereSettings: { color: '#88bbdd', scale: 1.15, opacity: 0.4 },
                details: {
                    gravity: '9.5 m/s²',
                    orbitalPeriod: '9.2 days',
                    moons: 0,
                    dayLength: 'Tidally Locked',
                    facts: [
                        'TRAPPIST-1f may be an ocean world covered by a global ice shell.',
                        'Tidal heating from gravitational interactions could maintain liquid water beneath the ice.',
                        'It has the highest water mass fraction of any known rocky planet.',
                        'Each TRAPPIST-1 planet is in nearly perfect orbital resonance with its neighbors.'
                    ]
                },
                moonsData: [],
                textureType: 'ICE_GIANT',
                textureColors: { base: '#88bbdd', secondary: '#aaddff' },
                orbitSpeed: 2.0, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            }
        ],
        distanceFromSol: 39,
        coordinates: [-10, 5, 35],
        habitableZone: { inner: 18, outer: 55 }
    },
    'kepler-186': {
        id: 'kepler-186',
        name: 'Kepler-186',
        description: 'A red dwarf system that made history — home to the first Earth-sized planet ever confirmed in a star\'s habitable zone.',
        distanceFromSol: 582,
        coordinates: [40, 15, -60],
        star: {
            name: 'Kepler-186',
            type: 'M1V Red Dwarf',
            size: 6,
            color: '#ff6644',
            temp: '3,788 K',
            mass: '0.54 Solar Masses',
            lightIntensity: 4,
            coronaColor: '#ff4400',
            age: '4 Billion Years',
            details: 'A dim red dwarf star about half the mass of the Sun. Despite its faintness, it hosts at least 5 confirmed planets.',
            composition: {
                Hydrogen: '74.2%',
                Helium: '24.8%',
                Metals: '1.0%'
            },
            luminosity: 0.041
        },
        planets: [
            {
                name: 'Kepler-186b',
                distance: 18,
                size: 1.3,
                color: '#cc8866',
                description: 'The innermost planet — a scorched rocky world orbiting far too close to its star for liquid water.',
                temp: '200°C',
                angle: 0.5,
                composition: { 'Rock': '~70%', 'Iron': '~30%' },
                atmosphere: { 'None': 'Likely stripped' },
                details: {
                    gravity: '~10 m/s²',
                    orbitalPeriod: '3.9 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Kepler-186b was one of the first confirmed planets in this system.',
                        'It orbits its star in under 4 days.',
                        'Too hot for habitability but confirms the system is planet-rich.'
                    ]
                },
                moonsData: [],
                textureType: 'CRATERED',
                textureColors: { base: '#cc8866', secondary: '#885533' },
                orbitSpeed: 7, rotationSpeed: 0, eccentricity: 0.02, inclination: 0, axialTilt: 0
            },
            {
                name: 'Kepler-186f',
                distance: 45,
                size: 2.1,
                color: '#cc4422',
                description: 'The first Earth-sized planet ever found in the habitable zone of another star. Under a dim red sun, any photosynthetic life here would likely use red and infrared light.',
                temp: '-85°C',
                angle: 2,
                composition: { 'Rock': '~60%', 'Ice': '~40%' },
                atmosphere: { 'N2': 'Possible', 'CO2': 'Possible' },
                atmosphereSettings: { color: '#ffaaaa', scale: 1.1, opacity: 0.4 },
                details: {
                    gravity: '~11 m/s²',
                    orbitalPeriod: '130 days',
                    moons: 0,
                    dayLength: 'Unknown',
                    facts: [
                        'Kepler-186f was the first Earth-sized planet confirmed in a habitable zone (2014).',
                        'Plants here might be black or dark red to absorb the dim red starlight efficiently.',
                        'It receives about one-third the energy Earth gets from the Sun.',
                        'At 582 light years away, it would take current spacecraft ~15 million years to reach.',
                        'It is roughly 10% larger than Earth.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#aa5544', secondary: '#224466' },
                orbitSpeed: 3, rotationSpeed: 0.01, eccentricity: 0.04, inclination: 0, axialTilt: 20
            }
        ],
        habitableZone: { inner: 40, outer: 55 }
    },
    'tau-ceti': {
        id: 'tau-ceti',
        name: 'Tau Ceti',
        description: 'A Sun-like star visible to the naked eye. One of the nearest solar analogs, it has been a staple of science fiction for decades.',
        distanceFromSol: 11.9,
        coordinates: [-12, -5, 8],
        star: {
            name: 'Tau Ceti',
            type: 'G8.5V',
            size: 13,
            color: '#ffeeaa',
            temp: '5,344 K',
            mass: '0.78 Solar Masses',
            lightIntensity: 9,
            coronaColor: '#ffcc00',
            age: '5.8 Billion Years',
            details: 'One of the most Sun-like stars in our neighborhood. At 78% solar mass and 52% luminosity, it is slightly cooler and dimmer than the Sun. A 10× denser debris disk suggests frequent cometary bombardment.',
            composition: {
                Hydrogen: '75.5%',
                Helium: '23.5%',
                Oxygen: '0.4%',
                Carbon: '0.2%',
                Iron: '0.1%',
                'Other Metals': '0.3%'
            },
            luminosity: 0.52
        },
        asteroidBelts: [
            {
                name: "Debris Disk",
                radius: 110,
                width: 40,
                count: 2500,
                minSize: 0.1,
                maxSize: 0.5,
                color: "#AA9988"
            }
        ],
        planets: [
            {
                name: 'Tau Ceti e',
                distance: 50,
                size: 3.8,
                color: '#ffee88',
                description: 'A super-Earth at the inner edge of the habitable zone. With 3.9× Earth\'s mass, it may have a thick atmosphere creating a powerful greenhouse effect.',
                temp: '70°C',
                angle: 0,
                composition: { 'Rock': '~70%', 'Iron': '~30%' },
                atmosphere: { 'CO2': 'Likely thick', 'N2': 'Possible', 'H2O': 'Possible steam' },
                atmosphereSettings: { color: '#ffee88', scale: 1.1, opacity: 0.3 },
                details: {
                    gravity: '~14 m/s²',
                    orbitalPeriod: '168 days',
                    moons: 0,
                    dayLength: 'Unknown',
                    facts: [
                        'Tau Ceti e sits at the inner edge of the habitable zone — warm but possibly livable.',
                        'At 3.9 Earth masses, its surface gravity would make walking feel noticeably heavier.',
                        'Tau Ceti is a favorite target system in science fiction, appearing in Star Trek, The Expanse, and more.',
                        'The system\'s dense debris disk may mean frequent asteroid impacts.'
                    ]
                },
                moonsData: [],
                textureType: 'GAS_GIANT',
                textureColors: { base: '#ddaa55', secondary: '#aa7744' },
                orbitSpeed: 2, rotationSpeed: 0.02, eccentricity: 0.05, inclination: 0.1, axialTilt: 25
            },
            {
                name: 'Tau Ceti f',
                distance: 85,
                size: 3.9,
                color: '#88ccff',
                description: 'A cold super-Earth in the outer habitable zone. If it has a thick hydrogen atmosphere, greenhouse heating could allow liquid water on the surface.',
                temp: '-40°C',
                angle: 3,
                composition: { 'Ice': '~50%', 'Rock': '~50%' },
                atmosphere: { 'H2': 'Possibly thick', 'He': 'Possible', 'N2': 'Possible' },
                atmosphereSettings: { color: '#88ccff', scale: 1.2, opacity: 0.6 },
                details: {
                    gravity: '~15 m/s²',
                    orbitalPeriod: '642 days',
                    moons: 1,
                    dayLength: 'Unknown',
                    facts: [
                        'Tau Ceti f may be habitable if it has a thick enough atmosphere for greenhouse warming.',
                        'At 3.9 Earth masses, it could be a "mini-Neptune" or a rocky super-Earth — we don\'t yet know.',
                        'Its year is almost twice as long as Earth\'s.',
                        'Could harbor liquid water under high atmospheric pressure.'
                    ]
                },
                moonsData: [{ name: 'Moon-f1', size: 0.8, distance: 6, color: '#aaaaaa', speed: 1, textureType: 'CRATERED', textureColors: { base: '#aaaaaa', secondary: '#888888' } }],
                textureType: 'ICE_GIANT',
                textureColors: { base: '#99ccff', secondary: '#ffffff' },
                orbitSpeed: 1.2, rotationSpeed: 0.015, eccentricity: 0.03, inclination: 0.2, axialTilt: 12
            }
        ],
        comets: [
            {
                name: "Tau Ceti-C1",
                distance: 180,
                size: 0.3,
                color: '#ccffff',
                speed: 0.7,
                eccentricity: 0.85,
                inclination: 45,
                orbitalPeriod: 120,
                details: {
                    description: "A large comet likely originating from the system's massive debris disk.",
                    facts: [
                        "Tau Ceti has 10x more cometary material than Sol.",
                        "Frequent comet impacts may be a significant hazard for life in this system.",
                        "This comet is one of many that periodically dive into the inner system."
                    ]
                }
            }
        ],
        habitableZone: { inner: 45, outer: 95 }
    },
    'epsilon-eridani': {
        id: 'epsilon-eridani',
        name: 'Epsilon Eridani',
        description: 'A young, active star system just 800 million years old — a solar system still in its turbulent youth, complete with active debris disks and migrating gas giants.',
        distanceFromSol: 10.5,
        coordinates: [8, -8, -4],
        star: {
            name: 'Ran',
            type: 'K2V',
            size: 11,
            color: '#ffcc66',
            temp: '5,084 K',
            mass: '0.82 Solar Masses',
            lightIntensity: 7,
            coronaColor: '#ffaa44',
            age: '800 Million Years',
            details: 'A young, active K-type star named "Ran" after the Norse sea goddess. At only 800 million years old, it is still developing — featuring dual debris belts analogous to our asteroid belt and Kuiper belt.',
            composition: {
                Hydrogen: '73.2%',
                Helium: '25.1%',
                Iron: '0.8%',
                Oxygen: '0.5%',
                Carbon: '0.4%'
            },
            luminosity: 0.34
        },
        asteroidBelts: [
            {
                name: "Inner Belt",
                radius: 60,
                width: 10,
                count: 800,
                minSize: 0.1,
                maxSize: 0.3,
                color: "#776655"
            },
            {
                name: "Outer Belt",
                radius: 140,
                width: 25,
                count: 2000,
                minSize: 0.2,
                maxSize: 0.6,
                color: "#667788"
            }
        ],
        planets: [
            {
                name: 'AEgir',
                distance: 120,
                size: 14,
                color: '#ddccaa',
                description: 'A Jupiter-class gas giant named after the Norse sea giant. Orbiting a young star, this may be a system where terrestrial planets are still forming in the inner disk.',
                temp: '-150°C',
                angle: 1,
                composition: { 'Hydrogen': '~90%', 'Helium': '~10%' },
                atmosphere: { 'H2': '~90%', 'He': '~10%', 'CH4': 'trace' },
                atmosphereSettings: { color: '#ddccaa', scale: 1.1, opacity: 0.4 },
                details: {
                    gravity: '~22 m/s²',
                    orbitalPeriod: '7.4 years',
                    moons: 4,
                    dayLength: '~10 hours',
                    facts: [
                        'AEgir (Epsilon Eridani b) orbits at 3.4 AU — similar to Jupiter\'s 5.2 AU orbit.',
                        'The system has two debris belts at 3 AU and 20 AU, resembling a younger version of our solar system.',
                        'Named after the Norse jötunn (giant) of the sea.',
                        'Epsilon Eridani was the target of Project Ozma (1960), the first modern SETI search.',
                        'Being only 800 million years old, any life here would be in its earliest stages — like Earth\'s Precambrian era.'
                    ]
                },
                moonsData: [
                    {
                        name: 'Val', size: 1.2, distance: 20, color: '#aa8888', speed: 1.2, textureType: 'VOLCANIC', textureColors: { base: '#888888', secondary: '#aa4444' },
                        description: 'A young, volcanically active moon powered by intense tidal heating from its host giant.',
                        temp: '120°C',
                        composition: { Silicates: '60%', Iron: '30%', Sulfur: '10%' },
                        details: { gravity: '1.4 m/s²', orbitalPeriod: '1.8 days', moons: 0, facts: ['Most active volcanic body in the system.', 'Covered in sulfur frost and lava lakes.'] }
                    },
                    {
                        name: 'Hald', size: 1.0, distance: 24, color: '#777777', speed: 0.9, textureType: 'CRATERED', textureColors: { base: '#777777', secondary: '#555555' },
                        description: 'A heavily cratered moon, preserving a record of the early, violent years of the Epsilon Eridani system.',
                        temp: '-120°C',
                        composition: { Rock: '80%', Water: '20%' },
                        details: { gravity: '1.2 m/s²', orbitalPeriod: '2.4 days', moons: 0, facts: ['Older than most surfaces in the system.', 'Features a massive impact basin near its south pole.'] }
                    },
                    {
                        name: 'Aegir-III', size: 0.5, distance: 28, color: '#666666', speed: 1.5, textureType: 'CRATERED', textureColors: { base: '#666666', secondary: '#444444' },
                        description: 'A small, captured asteroid moon with an irregular shape.',
                        temp: '-140°C',
                        composition: { Carbonaceous: '90%', Ice: '10%' },
                        details: { gravity: '0.4 m/s²', orbitalPeriod: '3.1 days', moons: 0, facts: ['Highly irregular shape.', 'Rich in organic compounds.'] }
                    },
                    {
                        name: 'Aegir-IV', size: 0.4, distance: 32, color: '#555555', speed: 1.8, textureType: 'CRATERED', textureColors: { base: '#555555', secondary: '#333333' },
                        description: 'The outermost moon of the Aegir system, likely a recent capture from the outer debris belt.',
                        temp: '-150°C',
                        composition: { Ice: '70%', Rock: '30%' },
                        details: { gravity: '0.3 m/s²', orbitalPeriod: '4.2 days', moons: 0, facts: ['Surface is mostly pristine water ice.', 'Orbits in the same direction as the system disk.'] }
                    }
                ],
                textureType: 'GAS_GIANT',
                textureColors: { base: '#8B7355', secondary: '#4A3B2A' },
                orbitSpeed: 0.5, rotationSpeed: 0.1, eccentricity: 0.07, inclination: 0.5, axialTilt: 15
            }
        ],
        comets: [
            {
                name: "The Norse Wanderer",
                distance: 250,
                size: 0.4,
                color: '#ffffff',
                speed: 0.5,
                eccentricity: 0.92,
                inclination: 30,
                orbitalPeriod: 450,
                details: {
                    description: "A young, bright exocomet in the developing Epsilon Eridani system.",
                    facts: [
                        "Epsilon Eridani is a young system (800M years old).",
                        "Exocomets like this one are remnants of the system's active formation phase.",
                        "It possesses a massive, glowing tail of gas and dust."
                    ]
                }
            }
        ],
        habitableZone: { inner: 45, outer: 95 }
    },
    '55-cancri': {
        id: '55-cancri',
        name: '55 Cancri',
        description: 'A binary star system hosting 5 known planets — including the infamous "Diamond Planet" where carbon crystallizes under extreme pressure.',
        distanceFromSol: 41,
        coordinates: [-25, 30, 10],
        star: {
            name: 'Copernicus',
            type: 'G8V (Binary)',
            size: 14,
            color: '#ffffaa',
            temp: '5,196 K',
            mass: '0.95 Solar Masses',
            lightIntensity: 9.5,
            coronaColor: '#ffff88',
            age: '10.2 Billion Years',
            details: 'One of the oldest Sun-like stars with known planets. At 10.2 billion years, it is more than twice the age of the Sun. Enriched in heavy metals, which favored planet formation.',
            composition: {
                Hydrogen: '71.5%',
                Helium: '23.5%',
                Carbon: '2.5%',
                Oxygen: '1.2%',
                Iron: '1.0%',
                Neon: '0.3%'
            },
            luminosity: 0.63
        },
        planets: [
            {
                name: 'Janssen',
                distance: 20,
                size: 2.2,
                color: '#ff8888',
                description: 'The Diamond Planet. This hellish super-Earth is so carbon-rich that its interior may be crystallized diamond. Surface temperatures exceed 2,400°C — hot enough to glow red.',
                temp: '2,400°C',
                angle: 4,
                composition: { 'Carbon (Diamond/Graphite)': '~33%', 'Iron': '~30%', 'Silicon Carbide': '~37%' },
                atmosphere: { 'CO2': 'Possible', 'CO': 'Possible', 'HCN': 'Possible' },
                details: {
                    gravity: '~20 m/s²',
                    orbitalPeriod: '17.7 hours',
                    moons: 0,
                    dayLength: 'Tidally Locked',
                    facts: [
                        'Janssen (55 Cancri e) completes an orbit in under 18 hours — a year shorter than an Earth day.',
                        'Its dayside may be covered in flowing lava oceans.',
                        'The carbon-rich interior could contain a layer of crystallized diamond.',
                        'JWST detected evidence of a secondary atmosphere being constantly replenished by volcanic outgassing.',
                        'It was one of the first super-Earths discovered (2004).'
                    ]
                },
                moonsData: [],
                textureType: 'VOLCANIC',
                textureColors: { base: '#440000', secondary: '#ffaa00' },
                orbitSpeed: 8, rotationSpeed: 0, eccentricity: 0.0, inclination: 0.1, axialTilt: 0
            },
            {
                name: 'Brahe',
                distance: 55,
                size: 6,
                color: '#ccddaa',
                description: 'A warm-Neptune orbiting in what would be Venus\'s territory in our solar system. Too hot for habitability, but an interesting transitional world.',
                temp: '260°C',
                angle: 1.5,
                composition: { 'Hydrogen': '~70%', 'Helium': '~25%', 'Heavy Elements': '~5%' },
                atmosphere: { 'H2': '~70%', 'He': '~25%', 'H2O': 'Possible' },
                atmosphereSettings: { color: '#ccddaa', scale: 1.15, opacity: 0.4 },
                details: {
                    gravity: '~12 m/s²',
                    orbitalPeriod: '44.4 days',
                    moons: 0,
                    dayLength: 'Unknown',
                    facts: [
                        'Brahe (55 Cancri b) was one of the first exoplanets ever discovered (1996).',
                        'Its discovery helped establish the existence of "hot Jupiters" and "warm Neptunes".',
                        'Named after Tycho Brahe, the Danish astronomer.'
                    ]
                },
                moonsData: [],
                textureType: 'GAS_GIANT',
                textureColors: { base: '#aabb88', secondary: '#889966' },
                orbitSpeed: 4, rotationSpeed: 0.04, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            },
            {
                name: 'Galileo',
                distance: 150,
                size: 14,
                color: '#ddeeff',
                description: 'A massive gas giant in the outer system, orbiting at a Jupiter-like distance. With 4× Jupiter\'s mass, it dominates the outer 55 Cancri system.',
                temp: '-100°C',
                angle: 2,
                composition: { 'Hydrogen': '~85%', 'Helium': '~14%', 'Methane': '~1%' },
                atmosphere: { 'H2': '~85%', 'He': '~14%', 'CH4': 'trace' },
                atmosphereSettings: { color: '#ddeeff', scale: 1.1, opacity: 0.3 },
                details: {
                    gravity: '~20 m/s²',
                    orbitalPeriod: '14 years',
                    moons: 3,
                    dayLength: '~12 hours',
                    facts: [
                        'Galileo (55 Cancri d) is ~4× Jupiter\'s mass — a supergiant planet.',
                        'It was the 4th planet found in the system, discovered in 2002.',
                        'Named after Galileo Galilei, who first observed Jupiter\'s moons.',
                        'Its orbit is nearly circular despite its enormous mass.'
                    ]
                },
                moonsData: [
                    { name: 'Galileo-I', size: 1.0, distance: 18, color: '#aaaaaa', speed: 1.0, textureType: 'VOLCANIC', textureColors: { base: '#aaaaaa', secondary: '#aa8800' } },
                    { name: 'Galileo-II', size: 0.8, distance: 22, color: '#999999', speed: 0.8, textureType: 'CRATERED', textureColors: { base: '#999999', secondary: '#777777' } },
                    { name: 'Galileo-III', size: 0.6, distance: 26, color: '#888888', speed: 0.6, textureType: 'CRATERED', textureColors: { base: '#888888', secondary: '#666666' } }
                ],
                textureType: 'GAS_GIANT',
                textureColors: { base: '#aabbcc', secondary: '#8899aa' },
                orbitSpeed: 0.4, rotationSpeed: 0.1, eccentricity: 0.02, inclination: 0, axialTilt: 3.1
            }
        ],
        asteroidBelts: [
            {
                name: "Massive Debris Disk",
                radius: 120,
                width: 100,
                count: 3500,
                minSize: 0.2,
                maxSize: 0.8,
                color: "#9988aa"
            }
        ],
        habitableZone: { inner: 45, outer: 75 }
    },

    // === NEW SYSTEMS ===

    'gliese-667c': {
        id: 'gliese-667c',
        name: 'Gliese 667C',
        description: 'A red dwarf in a TRIPLE star system. Two brilliant companion suns blaze in its skies. Up to 3 super-Earths may orbit in the habitable zone.',
        distanceFromSol: 23.6,
        coordinates: [15, -20, 12],
        star: {
            name: 'Gliese 667C',
            type: 'M1.5V Red Dwarf',
            size: 5,
            color: '#ff5533',
            temp: '3,350 K',
            mass: '0.33 Solar Masses',
            lightIntensity: 3,
            coronaColor: '#ff3300',
            age: '2-10 Billion Years',
            details: 'The smallest star in a triple-star system. From its planets, two additional suns (Gliese 667A and B) would be visible as brilliant stars in the sky — brighter than any star seen from Earth.',
            composition: {
                Hydrogen: '74.0%',
                Helium: '24.5%',
                Metals: '1.5%'
            },
            luminosity: 0.0137
        },
        planets: [
            {
                name: 'Gliese 667Cb',
                distance: 18,
                size: 2.5,
                color: '#dd8855',
                description: 'A hot super-Earth too close to its star for comfort. Any water would have boiled away long ago, leaving a scorched surface.',
                temp: '130°C',
                angle: 0.8,
                composition: { 'Rock': '~65%', 'Iron': '~35%' },
                atmosphere: { 'CO2': 'Likely', 'SO2': 'Possible' },
                details: {
                    gravity: '~13 m/s²',
                    orbitalPeriod: '7.2 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Gliese 667Cb is a scorching super-Earth with ~3.7× Earth\'s mass.',
                        'It orbits inside the inner edge of the habitable zone.',
                        'Two additional suns would appear as brilliant points in its sky.',
                        'The triple-star system creates fascinating orbital dynamics.'
                    ]
                },
                moonsData: [],
                textureType: 'CRATERED',
                textureColors: { base: '#dd8855', secondary: '#aa6633' },
                orbitSpeed: 5, rotationSpeed: 0, eccentricity: 0.03, inclination: 0, axialTilt: 0
            },
            {
                name: 'Gliese 667Cc',
                distance: 32,
                size: 2.2,
                color: '#55aa77',
                description: 'One of the most promising habitable worlds known. Squarely in the habitable zone with the right temperature for liquid water. Sunsets here feature three suns.',
                temp: '-3°C',
                angle: 2.8,
                composition: { 'Rock': '~55%', 'Iron': '~25%', 'Water': '~20%' },
                atmosphere: { 'N2': 'Likely', 'CO2': 'Likely', 'H2O': 'Possible' },
                atmosphereSettings: { color: '#55aa77', scale: 1.15, opacity: 0.5 },
                details: {
                    gravity: '~11 m/s²',
                    orbitalPeriod: '28.1 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Gliese 667Cc receives about 90% of the light Earth gets — almost ideal for habitability.',
                        'It was ranked among the top 5 most habitable exoplanets by the Habitable Exoplanets Catalog.',
                        'Being tidally locked, a permanent "twilight zone" ring may have the best conditions for life.',
                        'From its surface, two brilliant companion stars would be visible — up to 100× brighter than Venus from Earth.',
                        'At 3.8 Earth masses, its stronger gravity could support a thicker atmosphere.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#55aa77', secondary: '#336644' },
                orbitSpeed: 2.5, rotationSpeed: 0, eccentricity: 0.02, inclination: 0.5, axialTilt: 0
            },
            {
                name: 'Gliese 667Ce',
                distance: 48,
                size: 1.8,
                color: '#7799cc',
                description: 'An icy super-Earth at the outer edge of the habitable zone. If it has a thick atmosphere, greenhouse warming could keep water liquid beneath the ice.',
                temp: '-60°C',
                angle: 5.0,
                composition: { 'Ice': '~45%', 'Rock': '~45%', 'Iron': '~10%' },
                atmosphere: { 'CO2': 'Thick (Possible)', 'N2': 'Possible' },
                atmosphereSettings: { color: '#7799cc', scale: 1.1, opacity: 0.3 },
                details: {
                    gravity: '~9 m/s²',
                    orbitalPeriod: '62 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Gliese 667Ce sits at the outer edge of the habitable zone — cold but possibly livable.',
                        'A thick CO2 atmosphere could provide enough greenhouse warming for liquid water.',
                        'This compact system packs multiple habitable-zone candidates around one tiny star.',
                        'It may be covered by a global ice sheet with a subsurface ocean.'
                    ]
                },
                moonsData: [],
                textureType: 'ICE_GIANT',
                textureColors: { base: '#7799cc', secondary: '#aaccee' },
                orbitSpeed: 1.5, rotationSpeed: 0, eccentricity: 0.02, inclination: 0.3, axialTilt: 0
            }
        ],
        habitableZone: { inner: 25, outer: 45 }
    },
    'hd-40307': {
        id: 'hd-40307',
        name: 'HD 40307',
        description: 'A quiet, stable K-type star hosting 6 confirmed planets — including a super-Earth in the habitable zone that is NOT tidally locked.',
        distanceFromSol: 42,
        coordinates: [-30, -15, 25],
        star: {
            name: 'HD 40307',
            type: 'K2.5V',
            size: 10,
            color: '#ffbb66',
            temp: '4,956 K',
            mass: '0.77 Solar Masses',
            lightIntensity: 5,
            coronaColor: '#ff9944',
            age: '4.5 Billion Years',
            details: 'A remarkably quiet K-type star — low stellar activity makes it an excellent host for potentially habitable worlds. Its 6 planets were revealed through careful observation of tiny gravitational wobbles.',
            composition: {
                Hydrogen: '74.2%',
                Helium: '24.2%',
                Metals: '1.6%'
            },
            luminosity: 0.23
        },
        planets: [
            {
                name: 'HD 40307b',
                distance: 20,
                size: 2.0,
                color: '#dd9966',
                description: 'The innermost planet — a scorching super-Earth whipping around its star in just 4 days.',
                temp: '400°C',
                angle: 0,
                composition: { 'Rock': '~70%', 'Iron': '~30%' },
                atmosphere: { 'None': 'Likely stripped' },
                details: {
                    gravity: '~12 m/s²',
                    orbitalPeriod: '4.3 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'HD 40307b has ~4× Earth\'s mass.',
                        'It orbits so close that its surface is likely molten.',
                        'Part of one of the most tightly packed known planetary systems.'
                    ]
                },
                moonsData: [],
                textureType: 'VOLCANIC',
                textureColors: { base: '#664422', secondary: '#ff8800' },
                orbitSpeed: 7, rotationSpeed: 0, eccentricity: 0.02, inclination: 0, axialTilt: 0
            },
            {
                name: 'HD 40307f',
                distance: 55,
                size: 2.5,
                color: '#88bb88',
                description: 'A super-Earth at the inner edge of the habitable zone. Warm but potentially life-bearing.',
                temp: '30°C',
                angle: 2.5,
                composition: { 'Rock': '~55%', 'Iron': '~25%', 'Water': '~20%' },
                atmosphere: { 'N2': 'Possible', 'CO2': 'Possible', 'H2O': 'Possible' },
                atmosphereSettings: { color: '#88bb88', scale: 1.1, opacity: 0.4 },
                details: {
                    gravity: '~13 m/s²',
                    orbitalPeriod: '51.6 days',
                    moons: 0,
                    dayLength: 'Unknown',
                    facts: [
                        'HD 40307f sits comfortably in the habitable zone.',
                        'With a mass ~5.2× Earth, it has strong enough gravity to retain a thick atmosphere.',
                        'Its star is remarkably quiet, reducing the threat of atmospheric stripping.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#88bb88', secondary: '#557755' },
                orbitSpeed: 3, rotationSpeed: 0.015, eccentricity: 0.03, inclination: 0.1, axialTilt: 5
            },
            {
                name: 'HD 40307g',
                distance: 85,
                size: 2.8,
                color: '#6699bb',
                description: 'The crown jewel — a super-Earth in the habitable zone that is far enough from its star to NOT be tidally locked. This means it could have Earth-like day-night cycles.',
                temp: '-10°C',
                angle: 4.8,
                composition: { 'Rock': '~50%', 'Iron': '~20%', 'Water/Ice': '~30%' },
                atmosphere: { 'N2': 'Likely', 'CO2': 'Likely', 'H2O': 'Possible clouds' },
                atmosphereSettings: { color: '#6699bb', scale: 1.2, opacity: 0.5 },
                details: {
                    gravity: '~14 m/s²',
                    orbitalPeriod: '197.8 days',
                    moons: 1,
                    dayLength: 'Unknown (NOT tidally locked)',
                    facts: [
                        'HD 40307g is one of the few habitable-zone super-Earths NOT expected to be tidally locked.',
                        'Day-night cycles could allow more uniform temperature distribution — favorable for life.',
                        'At 7.1 Earth masses, it straddles the line between super-Earth and mini-Neptune.',
                        'Its 198-day year is similar to Venus\'s orbital period.',
                        'The host star\'s quietness means less radiation bombardment than most red dwarf systems.'
                    ]
                },
                moonsData: [
                    {
                        name: 'HD 40307g-I', size: 0.5, distance: 5, color: '#999999', speed: 0.6, textureType: 'CRATERED', textureColors: { base: '#999999', secondary: '#777777' },
                        description: 'A small rocky moon orbiting the super-Earth HD 40307g. It provides a stable night sky for the potential inhabitants of its host.',
                        temp: '-30°C',
                        composition: { Silicates: '75%', Iron: '20%', Trace: '5%' },
                        details: { gravity: '0.5 m/s²', orbitalPeriod: '2.1 days', moons: 0, facts: ['Helps stabilize the axial tilt of its host planet.', 'Would appear 2x larger in the host sky than our Moon does from Earth.'] }
                    }
                ],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#6699bb', secondary: '#445577' },
                orbitSpeed: 1.5, rotationSpeed: 0.02, eccentricity: 0.04, inclination: 0.2, axialTilt: 23.5
            }
        ],
        habitableZone: { inner: 45, outer: 95 }
    },
    'wolf-1061': {
        id: 'wolf-1061',
        name: 'Wolf 1061',
        description: 'One of the closest systems with a habitable-zone planet. At just 14.1 light years, it\'s a realistic target for future interstellar probes.',
        distanceFromSol: 14.1,
        coordinates: [10, 5, -10],
        star: {
            name: 'Wolf 1061',
            type: 'M3V Red Dwarf',
            size: 5,
            color: '#ff4422',
            temp: '3,342 K',
            mass: '0.25 Solar Masses',
            lightIntensity: 2.5,
            coronaColor: '#cc2200',
            age: '> 1 Billion Years',
            details: 'A quiet red dwarf with 3 confirmed planets. Its proximity to Earth and relatively low stellar activity make it an exciting target for atmospheric characterization by JWST.',
            composition: {
                Hydrogen: '74.5%',
                Helium: '24.5%',
                Metals: '1.0%'
            },
            luminosity: 0.001
        },
        planets: [
            {
                name: 'Wolf 1061b',
                distance: 18,
                size: 1.8,
                color: '#cc8877',
                description: 'A warm super-Earth orbiting too close to its star for habitability. Receives 2.5× the energy Earth gets from the Sun.',
                temp: '80°C',
                angle: 0.5,
                composition: { 'Rock': '~65%', 'Iron': '~35%' },
                atmosphere: { 'CO2': 'Possible', 'Steam': 'Possible' },
                details: {
                    gravity: '~10 m/s²',
                    orbitalPeriod: '4.9 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Wolf 1061b orbits inside the inner edge of the habitable zone.',
                        'At 1.9 Earth masses, it\'s likely a rocky world.',
                        'It is tidally locked, with one hemisphere in permanent day.'
                    ]
                },
                moonsData: [],
                textureType: 'CRATERED',
                textureColors: { base: '#cc8877', secondary: '#995544' },
                orbitSpeed: 6, rotationSpeed: 0, eccentricity: 0.02, inclination: 0, axialTilt: 0
            },
            {
                name: 'Wolf 1061c',
                distance: 30,
                size: 2.2,
                color: '#55aa99',
                description: 'A super-Earth in the habitable zone and one of the closest known potentially habitable exoplanets. At just 14.1 light years, future telescopes may directly image this world.',
                temp: '-20°C',
                angle: 2.8,
                composition: { 'Rock': '~50%', 'Iron': '~25%', 'Water/Ice': '~25%' },
                atmosphere: { 'N2': 'Possible', 'CO2': 'Possible', 'H2O': 'Possible' },
                atmosphereSettings: { color: '#55aa99', scale: 1.15, opacity: 0.5 },
                details: {
                    gravity: '~12 m/s²',
                    orbitalPeriod: '17.9 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'Wolf 1061c is one of the closest habitable-zone exoplanets at 14.1 light years.',
                        'At 4.3 Earth masses, it could retain a substantial atmosphere.',
                        'It may experience a runaway greenhouse effect similar to Venus — or it may be temperate.',
                        'Its proximity makes it a prime target for next-generation telescopes and interstellar missions.',
                        'Wolf 1061 is so close that a signal sent at the speed of light would arrive in just 14 years.'
                    ]
                },
                moonsData: [
                    {
                        name: 'Fenrir', size: 0.6, distance: 4, color: '#aaaaaa', speed: 1.2, textureType: 'CRATERED', textureColors: { base: '#888888', secondary: '#444444' },
                        description: 'A cold, icy moon orbiting the red dwarf habitable-zone candidate Wolf 1061c.',
                        temp: '-70°C',
                        composition: { 'Water Ice': '60%', Rock: '40%' },
                        details: { gravity: '0.6 m/s²', orbitalPeriod: '1.2 days', moons: 0, facts: ['Named after the Norse wolf.', 'Surface is dominated by frozen methane and water ice.'] }
                    },
                    {
                        name: 'Skoll', size: 0.4, distance: 6, color: '#999999', speed: 0.9, textureType: 'CRATERED', textureColors: { base: '#777777', secondary: '#333333' },
                        description: 'The companion moon to Fenrir, likely shares a common origin but features a more pristine icy surface.',
                        temp: '-85°C',
                        atmosphere: { Methane: 'Trace' },
                        composition: { 'Water Ice': '80%', Silicates: '20%' },
                        details: { gravity: '0.4 m/s²', orbitalPeriod: '2.5 days', moons: 0, facts: ['Possesses one of the highest albedos in the system.', 'Exhibits evidence of weak cryovolcanism in the past.'] }
                    }
                ],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#55aa99', secondary: '#337755' },
                orbitSpeed: 3.5, rotationSpeed: 0, eccentricity: 0.03, inclination: 0.3, axialTilt: 0
            },
            {
                name: 'Wolf 1061d',
                distance: 50,
                size: 3.0,
                color: '#8899bb',
                description: 'The outermost known planet — a cold super-Earth or mini-Neptune beyond the habitable zone. Too cold for surface liquid water.',
                temp: '-90°C',
                angle: 5.2,
                composition: { 'Ice': '~40%', 'Rock': '~40%', 'H2/He': '~20%' },
                atmosphere: { 'H2': 'Possible thick', 'He': 'Possible' },
                atmosphereSettings: { color: '#8899bb', scale: 1.2, opacity: 0.4 },
                details: {
                    gravity: '~14 m/s²',
                    orbitalPeriod: '67.3 days',
                    moons: 0,
                    dayLength: 'Unknown',
                    facts: [
                        'Wolf 1061d is a 7.7 Earth-mass world — borderline between super-Earth and mini-Neptune.',
                        'It orbits beyond the outer edge of the habitable zone.',
                        'A thick hydrogen atmosphere could provide some greenhouse warming.',
                        'This cold world may have a subsurface ocean beneath an ice shell.'
                    ]
                },
                moonsData: [],
                textureType: 'ICE_GIANT',
                textureColors: { base: '#8899bb', secondary: '#aabbdd' },
                orbitSpeed: 1.5, rotationSpeed: 0.01, eccentricity: 0.04, inclination: 0.4, axialTilt: 10
            }
        ],
        habitableZone: { inner: 22, outer: 42 }
    },
    'toi-700': {
        id: 'toi-700',
        name: 'TOI-700',
        description: 'A TESS discovery — a small, quiet red dwarf harboring the first Earth-sized planet found in the habitable zone by the TESS mission.',
        distanceFromSol: 101.4,
        coordinates: [50, 40, -70],
        star: {
            name: 'TOI-700',
            type: 'M2V Red Dwarf',
            size: 5,
            color: '#ff4444',
            temp: '3,480 K',
            mass: '0.42 Solar Masses',
            lightIntensity: 3,
            coronaColor: '#cc2222',
            age: '~1.5 Billion Years',
            details: 'A quiet, well-behaved red dwarf discovered by TESS to host multiple rocky planets. Its low flare activity sets it apart from most red dwarfs and makes its planets more likely to retain atmospheres.',
            composition: {
                Hydrogen: '75.0%',
                Helium: '24.0%',
                Metals: '1.0%'
            },
            luminosity: 0.02
        },
        planets: [
            {
                name: 'TOI-700 d',
                distance: 30,
                size: 1.6,
                color: '#66aa88',
                description: 'An Earth-sized world in the habitable zone of a quiet red dwarf. The first such discovery by the TESS mission, it receives 86% of the sunlight Earth gets.',
                temp: '-15°C (estimated)',
                angle: 1.5,
                composition: { 'Rock': '~55%', 'Iron': '~30%', 'Water': '~15%' },
                atmosphere: { 'N2': 'Possible', 'CO2': 'Possible' },
                atmosphereSettings: { color: '#66aa88', scale: 1.1, opacity: 0.4 },
                details: {
                    gravity: '~10 m/s²',
                    orbitalPeriod: '37.4 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'TOI-700 d was the first Earth-sized habitable-zone planet found by the TESS mission (2020).',
                        'It receives 86% of the solar energy Earth gets — tantalizingly close to Earth-like conditions.',
                        'Climate models suggest it could support liquid water with the right atmospheric composition.',
                        'The star\'s low flare rate is unusual for a red dwarf and favorable for atmospheric retention.',
                        'TOI-700 d\'s discovery was initially missed and found by a high school student reviewing TESS data.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#66aa88', secondary: '#446655' },
                orbitSpeed: 2.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0, axialTilt: 0
            },
            {
                name: 'TOI-700 e',
                distance: 22,
                size: 1.3,
                color: '#aa8866',
                description: 'A small rocky planet orbiting just inside the habitable zone. Discovered in 2023, it bridges the gap between the inner rocky planets and the habitable TOI-700 d.',
                temp: '40°C',
                angle: 4.0,
                composition: { 'Rock': '~60%', 'Iron': '~35%', 'Water': '~5%' },
                atmosphere: { 'CO2': 'Possible', 'Steam': 'Possible' },
                details: {
                    gravity: '~9 m/s²',
                    orbitalPeriod: '28.4 days',
                    moons: 0,
                    dayLength: 'Likely Locked',
                    facts: [
                        'TOI-700 e was confirmed in 2023 using additional TESS data.',
                        'It is 95% the size of Earth — essentially Earth-twins in terms of size.',
                        'It orbits in the "optimistic" habitable zone — warm but possibly livable.',
                        'Its discovery makes TOI-700 one of the best-characterized multi-planet systems from TESS.'
                    ]
                },
                moonsData: [],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#aa8866', secondary: '#886644' },
                orbitSpeed: 3.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.2, axialTilt: 0
            }
        ],
        habitableZone: { inner: 18, outer: 40 }
    },
    'k2-138': {
        id: 'k2-138',
        name: 'K2-138',
        description: 'The first multi-planet system discovered entirely by citizen scientists. It features a rare, tightly packed chain of planets in near-perfect resonance.',
        distanceFromSol: 597,
        coordinates: [60, -20, 40],
        star: {
            name: 'K2-138',
            type: 'K1V Orange Dwarf',
            size: 12,
            color: '#ff9933',
            temp: '5,378 K',
            mass: '0.93 Solar Masses',
            lightIntensity: 5,
            coronaColor: '#ff7700',
            age: '2.1 Billion Years',
            details: 'An orange dwarf slightly smaller and cooler than the Sun. Its planetary system is remarkably orderly, suggesting a very calm birth environment.',
            composition: { Hydrogen: '72%', Helium: '26%', Metals: '2%' },
            luminosity: 0.5
        },
        planets: [
            {
                name: 'K2-138b',
                distance: 12, size: 1.5, color: '#cc6644',
                description: 'A hot super-Earth orbiting in just 2.3 days. Likely a scorched, rocky world.',
                temp: '800°C', angle: 0,
                composition: { Rock: '70%', Iron: '30%' },
                atmosphere: { None: 'Stripped by proximity' },
                details: { gravity: '12 m/s²', orbitalPeriod: '2.35 days', moons: 0, dayLength: 'Locked', facts: ['Discovered by citizen scientists via the Zooniverse project.', 'Part of a 3:2 resonance chain.'] },
                moonsData: [], textureType: 'CRATERED', textureColors: { base: '#cc6644', secondary: '#994422' },
                orbitSpeed: 8, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            },
            {
                name: 'K2-138c',
                distance: 18, size: 2.2, color: '#aa88bb',
                description: 'A sub-Neptune planet with a thick atmosphere. Part of the system\'s resonant chain.',
                temp: '600°C', angle: 1.2,
                composition: { Rock: '50%', Ice: '30%', Gas: '20%' },
                atmosphere: { H2: 'Thick', He: 'Trace' },
                details: { gravity: '10 m/s²', orbitalPeriod: '3.56 days', moons: 0, dayLength: 'Locked', facts: ['Orbits 1.5x slower than K2-138b.'] },
                moonsData: [], textureType: 'GAS_GIANT', textureColors: { base: '#aa88bb', secondary: '#886699' },
                orbitSpeed: 6.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.2, axialTilt: 0
            },
            {
                name: 'K2-138d',
                distance: 25, size: 2.3, color: '#88aabb',
                description: 'Another sub-Neptune in the tightly packed system. Its orbit is precisely timed with its neighbors.',
                temp: '450°C', angle: 2.5,
                composition: { Rock: '40%', Ice: '40%', Gas: '20%' },
                atmosphere: { H2: 'Thick', CH4: 'Trace' },
                details: { gravity: '11 m/s²', orbitalPeriod: '5.40 days', moons: 0, dayLength: 'Locked', facts: ['Maintains a 3:2 resonance with planet c.'] },
                moonsData: [], textureType: 'GAS_GIANT', textureColors: { base: '#88aabb', secondary: '#668899' },
                orbitSpeed: 5.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            },
            {
                name: 'K2-138e',
                distance: 34, size: 2.8, color: '#77bbcc',
                description: 'The largest confirmed planet in the K2-138 resonant chain.',
                temp: '320°C', angle: 3.8,
                composition: { Rock: '30%', Ice: '50%', Gas: '20%' },
                atmosphere: { H2: 'Deep', He: 'Trace' },
                details: { gravity: '13 m/s²', orbitalPeriod: '8.26 days', moons: 0, dayLength: 'Locked', facts: ['Its gravity helps stabilize the entire resonant chain.'] },
                moonsData: [], textureType: 'ICE_GIANT', textureColors: { base: '#77bbcc', secondary: '#5599aa' },
                orbitSpeed: 4.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.3, axialTilt: 0
            },
            {
                name: 'K2-138f',
                distance: 45, size: 2.5, color: '#6699bb',
                description: 'The fifth planet in the resonance chain. Its atmosphere likely contains significant water vapor.',
                temp: '200°C', angle: 5.1,
                composition: { Rock: '20%', Water: '60%', Gas: '20%' },
                atmosphere: { H2O: 'High', H2: 'Deep' },
                details: { gravity: '11 m/s²', orbitalPeriod: '12.76 days', moons: 0, dayLength: 'Locked', facts: ['Completes 2 orbits for every 3 orbits of planet e.'] },
                moonsData: [], textureType: 'GAS_GIANT', textureColors: { base: '#6699bb', secondary: '#447799' },
                orbitSpeed: 3.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.2, axialTilt: 0
            },
            {
                name: 'K2-138g',
                distance: 90, size: 3.2, color: '#5588aa',
                description: 'The outermost planet, orbiting much further out than the inner five.',
                temp: '50°C', angle: 4.5,
                composition: { Ice: '60%', Rock: '20%', Gas: '20%' },
                atmosphere: { H2: 'Thick', NH3: 'Possible' },
                details: { gravity: '15 m/s²', orbitalPeriod: '41 days', moons: 1, dayLength: 'Unknown', facts: ['Sits slightly outside the main resonance chain.', 'May have captured a large moon during its migration.'] },
                moonsData: [
                    {
                        name: 'K2-138g-I', size: 0.6, distance: 6, color: '#999999', speed: 0.8, textureType: 'CRATERED', textureColors: { base: '#999999', secondary: '#666666' },
                        description: 'A hypothetical moon discovered by analyzing the transit timing variations of its host Neptune-like planet.',
                        temp: '20°C',
                        atmosphere: { 'Nitrogen (Possible)': 'Trace' },
                        composition: { 'Rock': '50%', 'Water Ice': '40%', 'Nitrogen Ice': '10%' },
                        details: { gravity: '0.7 m/s²', orbitalPeriod: '1.4 days', moons: 0, facts: ['Its existence was predicted before direct detection.', 'Provides the best vantage point for viewing the resonant chain planets.'] }
                    }
                ],
                textureType: 'ICE_GIANT',
                textureColors: { base: '#5588aa', secondary: '#336688' },
                orbitSpeed: 1.8, rotationSpeed: 0.15, eccentricity: 0.05, inclination: 0.5, axialTilt: 15
            }
        ],
        habitableZone: { inner: 65, outer: 110 }
    },
    'hr-8799': {
        id: 'hr-8799',
        name: 'HR 8799',
        description: 'A young, massive star famous for being the first multi-planet system directly imaged. Because the system is only 42 million years old, its giants are still glowing with intense heat from their formation.',
        distanceFromSol: 133,
        coordinates: [-40, 50, 60],
        star: {
            name: 'HR 8799',
            type: 'F0V Gamma Doradu star',
            size: 20,
            color: '#ffffff',
            temp: '7,430 K',
            mass: '1.47 Solar Masses',
            lightIntensity: 8,
            coronaColor: '#eeeeff',
            age: '42 Million Years',
            details: 'A young, hot star that is 5 times more luminous than the Sun. Its surrounding debris disk and massive planets provide a glimpse into the early stages of planetary evolution. Its "habitable zone" represents where a world would receive Earth-like flux, though its young planets are far hotter than that flux alone suggests.',
            composition: { Hydrogen: '70%', Helium: '28%', Metals: '2%' },
            luminosity: 5.0
        },
        asteroidBelts: [
            { name: 'Inner Dust Disk', radius: 40, width: 10, count: 800, minSize: 0.05, maxSize: 0.2, color: '#bb9977' }
        ],
        planets: [
            {
                name: 'HR 8799e',
                distance: 80, size: 7.0, color: '#ff8844',
                description: 'A massive gas giant, 7 times more massive than Jupiter. Direct spectra show carbon dioxide in its atmosphere.',
                temp: '900°C', angle: 0.8,
                composition: { Gas: '95%', Rock: '5%' },
                atmosphere: { CO2: 'Confirmed', CO: 'High', CH4: 'Low' },
                details: { gravity: '180 m/s²', orbitalPeriod: '45 years', moons: 0, dayLength: 'Unknown', facts: ['Discovered via direct imaging in 2010.', 'Still glowing with heat from its formation.'] },
                moonsData: [], textureType: 'GAS_GIANT', textureColors: { base: '#ff8844', secondary: '#cc6622' },
                orbitSpeed: 1.2, rotationSpeed: 0.5, eccentricity: 0.1, inclination: 0.5, axialTilt: 3
            },
            {
                name: 'HR 8799d',
                distance: 130, size: 7.2, color: '#eeaa66',
                description: 'A giant planet orbiting in a 2:1 resonance with HR 8799e. Its heat makes it appear bright in infrared.',
                temp: '800°C', angle: 2.1,
                composition: { Gas: '95%', Rock: '5%' },
                atmosphere: { H2: 'Dominant', Clouds: 'Silicate' },
                details: { gravity: '185 m/s²', orbitalPeriod: '100 years', moons: 0, dayLength: 'Unknown', facts: ['Part of a 1:2:4:8 resonance chain.', 'Orbital "Goldilocks": It receives almost exactly the same amount of starlight as Earth.', 'Internal Furnace: Despite the temperate distance, it glows at 800°C due to its extreme youth.'] },
                moonsData: [], textureType: 'GAS_GIANT', textureColors: { base: '#eeaa66', secondary: '#cc8844' },
                orbitSpeed: 0.8, rotationSpeed: 0.45, eccentricity: 0.11, inclination: 0.6, axialTilt: 4
            },
            {
                name: 'HR 8799c',
                distance: 190, size: 7.5, color: '#ddccaa',
                description: 'One of the first exoplanets to have its orbit observed directly over years.',
                temp: '750°C', angle: 3.5,
                composition: { Gas: '95%', Rock: '5%' },
                atmosphere: { H2O: 'Traces', CO: 'Detected' },
                details: { gravity: '190 m/s²', orbitalPeriod: '190 years', moons: 0, dayLength: 'Unknown', facts: ['Orbits in 190 years, exactly matched by its distance in AU.'] },
                moonsData: [], textureType: 'GAS_GIANT', textureColors: { base: '#ddccaa', secondary: '#bb9977' },
                orbitSpeed: 0.6, rotationSpeed: 0.4, eccentricity: 0.05, inclination: 0.4, axialTilt: 5
            },
            {
                name: 'HR 8799b',
                distance: 280, size: 6.8, color: '#aabbcc',
                description: 'The outermost massive giant in the HR 8799 system. Its wide orbit takes over 450 years.',
                temp: '600°C', angle: 5.2,
                composition: { Gas: '98%', Rock: '2%' },
                atmosphere: { H2: 'Dominant', CH4: 'Possible' },
                details: { gravity: '150 m/s²', orbitalPeriod: '460 years', moons: 0, dayLength: 'Unknown', facts: ['The furthest of the four directly imaged giants.', 'Far outside the system\'s habitable zone.'] },
                moonsData: [], textureType: 'ICE_GIANT', textureColors: { base: '#aabbcc', secondary: '#8899aa' },
                orbitSpeed: 0.4, rotationSpeed: 0.35, eccentricity: 0.02, inclination: 0.3, axialTilt: 8
            }
        ],
        habitableZone: { inner: 105, outer: 185 }
    },
    'teegardens-star': {
        id: 'teegardens-star',
        name: 'Teegarden\'s Star',
        description: 'A very cool and dim red dwarf, just 12.5 light years away. It hosts two Earth-sized planets in its habitable zone.',
        distanceFromSol: 12.5,
        coordinates: [-10, -5, -8],
        star: {
            name: 'Teegarden\'s Star',
            type: 'M7V Red Dwarf',
            size: 4,
            color: '#ff3311',
            temp: '2,637 K',
            mass: '0.09 Solar Masses',
            lightIntensity: 2,
            coronaColor: '#aa2200',
            age: '8 Billion Years',
            details: 'An ultra-cool red dwarf with remarkably low magnetic activity. This makes its habitable zone planets much more likely to support life than those orbiting more active red dwarfs.',
            composition: { Hydrogen: '75%', Helium: '24%', Metals: '1.0%' },
            luminosity: 0.0007
        },
        planets: [
            {
                name: 'Teegarden\'s Star b',
                distance: 15, size: 1.1, color: '#66aa99',
                description: 'An Earth-sized world in the habitable zone. It receives about 1.15x the solar flux of Earth.',
                temp: '25°C', angle: 1.2,
                composition: { Rock: '60%', Iron: '30%', Water: '10%' },
                atmosphere: { N2: 'Possible', CO2: 'Trace' },
                atmosphereSettings: { color: '#66aa99', scale: 1.1, opacity: 0.4 },
                details: { gravity: '9.5 m/s²', orbitalPeriod: '4.9 days', moons: 0, dayLength: 'Locked', facts: ['Ranked as one of the most habitable exoplanets yet found.', 'Likely has liquid water oceans on its day side.'] },
                moonsData: [], textureType: 'TERRESTRIAL', textureColors: { base: '#66aa99', secondary: '#447755' },
                orbitSpeed: 4.5, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            },
            {
                name: 'Teegarden\'s Star c',
                distance: 25, size: 1.1, color: '#5588cc',
                description: 'A temperate world in the habitable zone, receiving about 37% of the solar flux Earth gets.',
                temp: '-10°C', angle: 3.5,
                composition: { Rock: '50%', Iron: '25%', Water: '25%' },
                atmosphere: { N2: 'Possible', CO2: 'High' },
                atmosphereSettings: { color: '#5588cc', scale: 1.15, opacity: 0.5 },
                details: { gravity: '9.8 m/s²', orbitalPeriod: '11.4 days', moons: 0, dayLength: 'Locked', facts: ['May be a snowball world if it has a thin atmosphere.', 'Ideal for detecting biosignatures with future telescopes.'] },
                moonsData: [], textureType: 'ICE_GIANT', textureColors: { base: '#5588cc', secondary: '#335588' },
                orbitSpeed: 3.2, rotationSpeed: 0, eccentricity: 0.02, inclination: 0.3, axialTilt: 0
            },
            {
                name: 'Teegarden\'s Star d',
                distance: 40, size: 1.2, color: '#8899aa',
                description: 'A cold rocky planet orbiting on the outer edge of the system.',
                temp: '-60°C', angle: 5.4,
                composition: { Rock: '60%', Ice: '40%' },
                atmosphere: { CH4: 'Possible', N2: 'Trace' },
                details: { gravity: '10.5 m/s²', orbitalPeriod: '26.1 days', moons: 0, dayLength: 'Unknown', facts: ['Orbiting in the cold outer regions of the dim M-dwarf.'] },
                moonsData: [], textureType: 'CRATERED', textureColors: { base: '#8899aa', secondary: '#556677' },
                orbitSpeed: 2.1, rotationSpeed: 0.1, eccentricity: 0.04, inclination: 0.4, axialTilt: 5
            }
        ],
        habitableZone: { inner: 12, outer: 28 }
    },
    'luytens-star': {
        id: 'luytens-star',
        name: 'Luyten\'s Star',
        description: 'A nearby red dwarf 12.2 light years away in the constellation Canis Minor. Its super-Earth b is a prime target for biosignature searches.',
        distanceFromSol: 12.2,
        coordinates: [5, -12, 8],
        star: {
            name: 'Luyten\'s Star',
            type: 'M5V Red Dwarf',
            size: 5,
            color: '#ff4422',
            temp: '3,150 K',
            mass: '0.26 Solar Masses',
            lightIntensity: 2.5,
            coronaColor: '#cc2211',
            age: '2.5 Billion Years',
            details: 'A relatively quiet red dwarf star. Its low activity profile makes its planets attractive for potential long-term habitability discussions.',
            composition: { Hydrogen: '74%', Helium: '25%', Metals: '1.0%' },
            luminosity: 0.004
        },
        planets: [
            {
                name: 'Luyten b',
                distance: 22, size: 2.1, color: '#55aa99',
                description: 'A super-Earth in the habitable zone. Some models suggest it could be a global "ocean world" with potential for life.',
                temp: '10°C', angle: 2.2,
                composition: { Rock: '40%', Iron: '20%', Water: '40%' },
                atmosphere: { N2: 'High', O2: 'Possible Trace', H2O: 'High' },
                atmosphereSettings: { color: '#55aa99', scale: 1.2, opacity: 0.6 },
                details: { gravity: '12 m/s²', orbitalPeriod: '18.6 days', moons: 1, dayLength: 'Locked', facts: ['One of the most Earth-like planets found around a quiet red dwarf.', 'Speculated to have deep oceans under a thick nitrogen atmosphere.'] },
                moonsData: [
                    {
                        name: 'Nautilus', size: 0.5, distance: 3.5, color: '#99aa99', speed: 1.5, textureType: 'CRATERED', textureColors: { base: '#889988', secondary: '#556655' },
                        description: 'A dense, icy moon orbiting Luyten b. Speculated to harbor a deep subsurface ocean beneath its thick crust.',
                        temp: '-45°C',
                        composition: { 'Water Ice': '70%', 'Rock': '20%', 'Organic Compounds': '10%' },
                        details: { gravity: '0.6 m/s²', orbitalPeriod: '0.9 days', moons: 0, facts: ['Named after the legendary submarine.', 'Likely maintains its ocean via tidal heating from the nearby red dwarf and Luyten b.'] }
                    }
                ],
                textureType: 'TERRESTRIAL',
                textureColors: { base: '#55aa99', secondary: '#336655' },
                orbitSpeed: 3.8, rotationSpeed: 0, eccentricity: 0.03, inclination: 0.2, axialTilt: 0
            },
            {
                name: 'Luyten c',
                distance: 12, size: 1.3, color: '#ccaa88',
                description: 'A small super-Earth orbiting very close to the star. Scorchingly hot despite the star\'s low temperature.',
                temp: '180°C', angle: 0.5,
                composition: { Rock: '70%', Iron: '30%' },
                atmosphere: { CO2: 'Deep', N2: 'Trace' },
                details: { gravity: '10 m/s²', orbitalPeriod: '4.7 days', moons: 0, dayLength: 'Locked', facts: ['Receives much more radiation than Earth.', 'Likely a dry, desolate rock.'] },
                moonsData: [], textureType: 'CRATERED', textureColors: { base: '#ccaa88', secondary: '#997755' },
                orbitSpeed: 6.2, rotationSpeed: 0, eccentricity: 0.01, inclination: 0.1, axialTilt: 0
            }
        ],
        habitableZone: { inner: 16, outer: 32 }
    }
};
