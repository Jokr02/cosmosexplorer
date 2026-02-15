import type { TextureType } from '../utils/PlanetTextureGenerator';

export interface RingData {
    innerRadius: number;
    outerRadius: number;
    color: string;
    opacity: number;
    rotation?: [number, number, number];
}

export interface PlanetData {
    name: string;
    distance: number;
    size: number;
    color: string;
    description: string;
    temp: string;
    angle: number;
    composition?: Record<string, string>;
    atmosphere?: Record<string, string>;
    atmosphereSettings?: {
        color: string;
        scale?: number;
        opacity?: number;
    };
    textureType: TextureType;
    textureColors: { base: string, secondary: string };
    details: {
        gravity: string;
        orbitalPeriod: string;
        moons: number;
        dayLength: string;
        facts: string[];
    };
    moonsData: Array<{
        name: string;
        distance: number;
        size: number;
        speed: number;
        color: string;
        inclination?: number;
        textureType?: TextureType;
        textureColors?: { base: string, secondary: string };
        description?: string;
        temp?: string;
        composition?: Record<string, string>;
        atmosphere?: Record<string, string>;
        details?: {
            gravity: string;
            orbitalPeriod: string;
            moons: number;
            dayLength?: string;
            facts: string[];
        };
    }>;
    rings?: RingData;
    orbitSpeed: number;
    rotationSpeed: number;
    eccentricity: number;
    inclination?: number; // degrees
    axialTilt?: number; // degrees - planet's axial tilt relative to orbital plane
}

export const PLANETS: PlanetData[] = [
    {
        name: 'Mercury',
        distance: 30,
        size: 0.8,
        color: '#A5A5A5',
        description: 'A scorched, cratered world racing around the Sun every 88 days. With virtually no atmosphere, temperatures swing from 430°C in sunlight to -180°C in shadow.',
        temp: '167°C (avg)',
        angle: 0,
        composition: { 'Iron Core': '~70%', 'Silicate Mantle': '~30%' },
        atmosphere: { 'Oxygen': '42%', 'Sodium': '29%', 'Hydrogen': '22%', 'Helium': '6%' },
        details: {
            gravity: '3.7 m/s²',
            orbitalPeriod: '88 days',
            moons: 0,
            dayLength: '176 Earth days',
            facts: [
                'Mercury has the most eccentric orbit of all planets (0.205).',
                'Its iron core makes up about 70% of its mass — the largest core-to-body ratio in the solar system.',
                'MESSENGER spacecraft found water ice hiding in permanently shadowed craters near the poles.',
                'Mercury is shrinking — it has contracted by about 7 km in radius as its core cools.',
                'Despite being closest to the Sun, it is NOT the hottest planet — Venus is.'
            ]
        },
        moonsData: [],
        textureType: 'CRATERED',
        textureColors: { base: '#A5A5A5', secondary: '#808080' },
        orbitSpeed: 4.7,
        rotationSpeed: 0.003,
        eccentricity: 0.205,
        inclination: 7.0,
        axialTilt: 0.034
    },
    {
        name: 'Venus',
        distance: 45,
        size: 1.5,
        color: '#E3BB76',
        description: 'Earth\'s "evil twin" — a furnace world shrouded in thick sulfuric acid clouds. Surface pressure is 90× Earth\'s, enough to crush a submarine.',
        temp: '464°C',
        angle: 2.1,
        composition: { 'Carbon Dioxide': '96.5%', 'Nitrogen': '3.5%' },
        atmosphere: { 'CO2': '96.5%', 'N2': '3.5%', 'SO2': 'trace', 'H2O': 'trace' },
        atmosphereSettings: { color: '#d4c8a5', scale: 1.2, opacity: 0.8 },
        details: {
            gravity: '8.87 m/s²',
            orbitalPeriod: '225 days',
            moons: 0,
            dayLength: '243 Earth days (retrograde)',
            facts: [
                'Venus rotates backwards (retrograde) — the Sun rises in the west.',
                'A single Venusian day (243 Earth days) is longer than its year (225 Earth days).',
                'Surface temperature of 464°C makes it the hottest planet — hot enough to melt lead.',
                'The Soviet Venera probes are the only spacecraft to successfully land on Venus, surviving only minutes.',
                'Lightning storms rage constantly in Venus\'s clouds of sulfuric acid.'
            ]
        },
        moonsData: [],
        textureType: 'GAS_GIANT',
        textureColors: { base: '#E3BB76', secondary: '#Cca060' },
        orbitSpeed: 3.5,
        rotationSpeed: -0.002,
        eccentricity: 0.007,
        inclination: 3.4,
        axialTilt: 177.4
    },
    {
        name: 'Earth',
        distance: 60,
        size: 1.6,
        color: '#2233FF',
        description: 'The pale blue dot. A water-rich oasis teeming with life, protected by a magnetic field and a thin atmosphere. The only known world where life has emerged.',
        temp: '15°C (avg)',
        angle: 4.2,
        composition: { 'Iron Core': '32%', 'Oxygen': '30%', 'Silicon': '15%', 'Magnesium': '14%' },
        atmosphere: { 'N2': '78.1%', 'O2': '20.9%', 'Ar': '0.93%', 'CO2': '0.04%' },
        atmosphereSettings: { color: '#00aaff', scale: 1.25, opacity: 0.6 },
        details: {
            gravity: '9.81 m/s²',
            orbitalPeriod: '365.25 days',
            moons: 1,
            dayLength: '23h 56m 4s',
            facts: [
                'Earth is the only planet not named after a Greek or Roman deity.',
                'At 5.51 g/cm³, Earth is the densest planet in the Solar System.',
                '71% of Earth\'s surface is covered by liquid water — unique in our solar system.',
                'Earth\'s magnetic field extends 65,000 km into space, shielding us from solar wind.',
                'The Moon stabilizes Earth\'s axial tilt, preventing wild climate swings.'
            ]
        },
        moonsData: [
            {
                name: 'Moon',
                distance: 3,
                size: 0.4,
                speed: 0.5,
                color: '#cccccc',
                inclination: 28,
                textureType: 'CRATERED',
                textureColors: { base: '#cccccc', secondary: '#999999' },
                description: 'Earth\'s only natural satellite. It is the fifth largest satellite in the Solar System and the largest and most massive relative to its parent planet.',
                temp: '-53°C (avg)',
                composition: { 'Silicate Rock': 'Crust/Mantle', 'Iron-rich': 'Core' },
                atmosphere: { 'Exosphere': 'Trace' },
                details: {
                    gravity: '1.62 m/s²',
                    orbitalPeriod: '27.3 days',
                    moons: 0,
                    dayLength: '27.3 Earth days',
                    facts: [
                        'The Moon is drifting away from Earth at about 3.8 cm per year.',
                        'It is tidally locked to Earth, meaning we always see the same side.',
                        'The Moon has "moonquakes" caused by Earth\'s gravitational pull.',
                        'There is water ice in permanently shadowed craters at the poles.',
                        'Mankind first landed on the Moon on July 20, 1969.'
                    ]
                }
            }
        ],
        textureType: 'TERRESTRIAL',
        textureColors: { base: '#2233FF', secondary: '#228833' },
        orbitSpeed: 3,
        rotationSpeed: 0.02,
        eccentricity: 0.017,
        inclination: 0,
        axialTilt: 23.44
    },
    {
        name: 'Mars',
        distance: 75,
        size: 1.2,
        color: '#FF3300',
        description: 'The Red Planet — a frigid desert world with rusty iron oxide soil. Home to the tallest volcano and deepest canyon in the solar system. Humanity\'s next frontier.',
        temp: '-65°C (avg)',
        angle: 1.5,
        composition: { 'Iron Oxide': 'Surface', 'CO2 Ice': 'Polar Caps', 'Basalt': 'Crust' },
        atmosphere: { 'CO2': '95.3%', 'N2': '2.7%', 'Ar': '1.6%', 'O2': '0.13%' },
        atmosphereSettings: { color: '#ff5500', scale: 1.15, opacity: 0.5 },
        details: {
            gravity: '3.72 m/s²',
            orbitalPeriod: '687 days',
            moons: 2,
            dayLength: '24h 37m',
            facts: [
                'Olympus Mons is 21.9 km tall — nearly 2.5× the height of Mount Everest.',
                'Valles Marineris is 4,000 km long — it would stretch across the entire United States.',
                'Dust storms on Mars can engulf the entire planet for months.',
                'Sunsets on Mars appear blue due to fine dust scattering red light.',
                'Phobos orbits Mars faster than Mars rotates — it rises in the west and sets in the east.'
            ]
        },
        moonsData: [
            {
                name: 'Phobos',
                distance: 2,
                size: 0.2,
                speed: 0.8,
                color: '#886655',
                textureType: 'CRATERED',
                textureColors: { base: '#886655', secondary: '#554433' },
                description: 'The larger and closer of Mars\'s two moons. It orbits so close to Mars that it will eventually be destroyed by tidal forces.',
                temp: '-40°C (avg)',
                composition: { 'Carbonaceous Chondrite': 'Bulk' },
                details: {
                    gravity: '0.0057 m/s²',
                    orbitalPeriod: '7.6 hours',
                    moons: 0,
                    facts: [
                        'Phobos orbits Mars three times a day.',
                        'It is one of the least reflective bodies in the Solar System.',
                        'Stickney Crater is its most prominent feature, 9km across.',
                        'It is spiraling inward toward Mars at a rate of 1.8 meters every century.',
                        'It may eventually break apart and form a ring around Mars.'
                    ]
                }
            },
            {
                name: 'Deimos',
                distance: 3.5,
                size: 0.15,
                speed: 0.4,
                color: '#997766',
                textureType: 'CRATERED',
                textureColors: { base: '#997766', secondary: '#665544' },
                description: 'The smaller and more distant of the two Martian moons. It has a smoother appearance than Phobos due to a thick layer of regolith.',
                temp: '-40°C (avg)',
                composition: { 'Carbonaceous Chondrite': 'Bulk' },
                details: {
                    gravity: '0.003 m/s²',
                    orbitalPeriod: '30.3 hours',
                    moons: 0,
                    facts: [
                        'Deimos is only 12.4 km in diameter.',
                        'It takes 30 hours to orbit Mars.',
                        'Its surface is covered by at least 100m of dusty regolith.',
                        'It was discovered by Asaph Hall in 1877.',
                        'It is named after the Greek personification of dread.'
                    ]
                }
            }
        ],
        textureType: 'CRATERED',
        textureColors: { base: '#FF4400', secondary: '#882200' },
        orbitSpeed: 2.4,
        rotationSpeed: 0.018,
        eccentricity: 0.094,
        inclination: 1.85,
        axialTilt: 25.19
    },
    {
        name: 'Jupiter',
        distance: 110,
        size: 5,
        color: '#D8CA9D',
        description: 'King of the planets. This colossal gas giant contains more mass than all other planets combined. Its Great Red Spot — a storm larger than Earth — has been raging for centuries.',
        temp: '-110°C (cloud tops)',
        angle: 5.8,
        composition: { 'Hydrogen': '89.8%', 'Helium': '10.2%' },
        atmosphere: { 'H2': '89.8%', 'He': '10.2%', 'CH4': '0.3%', 'NH3': 'trace' },
        atmosphereSettings: { color: '#b0e0e6', scale: 1.1, opacity: 0.4 },
        details: {
            gravity: '24.79 m/s²',
            orbitalPeriod: '11.86 years',
            moons: 95,
            dayLength: '9h 56m',
            facts: [
                'Jupiter\'s mass is 318× Earth\'s — more than all other planets combined.',
                'The Great Red Spot is a storm 1.3× the diameter of Earth, active for 350+ years.',
                'Jupiter acts as a cosmic shield, deflecting asteroids away from the inner solar system.',
                'Its magnetosphere is the largest structure in the solar system (if visible, it would appear 5× the size of the full Moon).',
                'Io experiences tidal heating so extreme that it has over 400 active volcanoes.'
            ]
        },
        moonsData: [
            {
                name: 'Io',
                distance: 6,
                size: 0.5,
                speed: 0.6,
                color: '#eebb44',
                textureType: 'VOLCANIC',
                textureColors: { base: '#eebb44', secondary: '#aa4400' },
                description: 'The most geologically active body in the Solar System, with hundreds of active volcanoes.',
                temp: '-143°C (avg)',
                composition: { 'Silicate Rock': 'Crust', 'Molten Iron': 'Core' },
                atmosphere: { 'Sulfur Dioxide': 'Trace' },
                details: {
                    gravity: '1.796 m/s²',
                    orbitalPeriod: '1.77 days',
                    moons: 0,
                    facts: [
                        'Io has over 400 active volcanoes.',
                        'Its surface is constantly being reshaped by lava flows.',
                        'The yellow color comes from sulfur and sulfur dioxide frost.',
                        'Io is caught in a gravitational tug-of-war between Jupiter and other moons.',
                        'Volcanic plumes can rise 500 km above the surface.'
                    ]
                }
            },
            {
                name: 'Europa',
                distance: 8,
                size: 0.45,
                speed: 0.4,
                color: '#ccccff',
                textureType: 'VOLCANIC',
                textureColors: { base: '#ccccff', secondary: '#9999ff' },
                description: 'An icy moon with a smooth surface, believed to hide a vast liquid water ocean beneath its crust.',
                temp: '-160°C (avg)',
                composition: { 'Water Ice': 'Crust', 'Silicate Rock': 'Mantle' },
                atmosphere: { 'Oxygen': 'Trace' },
                details: {
                    gravity: '1.315 m/s²',
                    orbitalPeriod: '3.55 days',
                    moons: 0,
                    facts: [
                        'Europa is one of the highest priorities for the search for life.',
                        'Its subsurface ocean may contain twice as much water as all Earth\'s oceans.',
                        'The surface is covered in "chaos terrain" and linear cracks called lineae.',
                        'Radiation from Jupiter is intense on the surface.',
                        'Jupiter\'s icy moon has a very thin oxygen atmosphere.'
                    ]
                }
            },
            {
                name: 'Ganymede',
                distance: 10,
                size: 0.7,
                speed: 0.3,
                color: '#ddccaa',
                textureType: 'CRATERED',
                textureColors: { base: '#ddccaa', secondary: '#aa9977' },
                description: 'The largest moon in the Solar System, even larger than the planet Mercury.',
                temp: '-163°C (avg)',
                composition: { 'Silicate Rock': 'Mantle', 'Water Ice': 'Shell', 'Iron Core': 'Center' },
                atmosphere: { 'Oxygen': 'Trace' },
                details: {
                    gravity: '1.428 m/s²',
                    orbitalPeriod: '7.15 days',
                    moons: 0,
                    facts: [
                        'Ganymede is the only moon known to have its own magnetic field.',
                        'It has a surface layer of water ice and a silicate mantle.',
                        'Hubble found evidence of a thin oxygen atmosphere.',
                        'It has distinct dark and light regions of terrain.',
                        'Ganymede is 2.4 times more massive than the Moon.'
                    ]
                }
            },
            {
                name: 'Callisto',
                distance: 13,
                size: 0.6,
                speed: 0.2,
                color: '#998877',
                textureType: 'CRATERED',
                textureColors: { base: '#665544', secondary: '#443322' },
                description: 'The most heavily cratered object in the Solar System, with a very old and geologically dead surface.',
                temp: '-139°C (avg)',
                composition: { 'Water Ice': 'Bulk', 'Rock': 'Bulk' },
                details: {
                    gravity: '1.236 m/s²',
                    orbitalPeriod: '16.69 days',
                    moons: 0,
                    facts: [
                        'Callisto has the oldest surface in the Solar System.',
                        'It shows no signs of geological activity like volcanoes or tectonics.',
                        'Valhalla is its largest impact basin, 3,800 km across.',
                        'It is composed of roughly equal parts of ice and rock.',
                        'Callisto is the third-largest moon in the solar system.'
                    ]
                }
            }
        ],
        textureType: 'GAS_GIANT',
        textureColors: { base: '#D8CA9D', secondary: '#A89A6D' },
        orbitSpeed: 1.3,
        rotationSpeed: 0.05,
        eccentricity: 0.048,
        inclination: 1.3,
        axialTilt: 3.13
    },
    {
        name: 'Saturn',
        distance: 150,
        size: 4.5,
        color: '#EAD6B8',
        description: 'The jewel of the solar system. Saturn\'s iconic rings span 282,000 km but are only about 10 meters thick — a cosmic vinyl record of ice, rock, and dust.',
        temp: '-140°C (cloud tops)',
        angle: 3.4,
        composition: { 'Hydrogen': '96.3%', 'Helium': '3.25%' },
        atmosphere: { 'H2': '96.3%', 'He': '3.25%', 'CH4': '0.45%', 'NH3': 'trace' },
        atmosphereSettings: { color: '#f0e68c', scale: 1.1, opacity: 0.4 },
        details: {
            gravity: '10.44 m/s²',
            orbitalPeriod: '29.5 years',
            moons: 146,
            dayLength: '10h 34m',
            facts: [
                'Saturn\'s density (0.687 g/cm³) is less than water — it would float in a giant bathtub.',
                'The ring system is 282,000 km wide but only ~10 meters thick.',
                'Titan is the only moon in the solar system with a dense atmosphere and liquid lakes (of methane).',
                'Enceladus shoots geysers of water ice into space from a subsurface ocean — a prime target for life.',
                'Winds at Saturn\'s equator reach 1,800 km/h — the fastest in the solar system.'
            ]
        },
        moonsData: [
            {
                name: 'Titan',
                distance: 9,
                size: 0.7,
                speed: 0.3,
                color: '#eebb66',
                textureType: 'GAS_GIANT',
                textureColors: { base: '#eebb66', secondary: '#cc9944' },
                description: 'The second-largest moon in the solar system and the only one with a dense atmosphere and liquid lakes on its surface.',
                temp: '-179°C (avg)',
                composition: { 'Nitrogen': 'Atmosphere', 'Water Ice': 'Crust', 'Silicate Rock': 'Interior' },
                atmosphere: { 'Nitrogen': '95%', 'Methane': '5%' },
                details: {
                    gravity: '1.352 m/s²',
                    orbitalPeriod: '15.9 days',
                    moons: 0,
                    facts: [
                        'Titan is the only place besides Earth known to have liquids in the form of rivers and lakes on its surface.',
                        'The surface pressure is about 50% higher than Earth\'s.',
                        'The Huygens probe landed on Titan in 2005.',
                        'It has a thick, opaque orange atmosphere.',
                        'Titan\'s lakes are filled with liquid methane and ethane.'
                    ]
                }
            },
            {
                name: 'Rhea',
                distance: 6,
                size: 0.3,
                speed: 0.5,
                color: '#cccccc',
                textureType: 'CRATERED',
                textureColors: { base: '#cccccc', secondary: '#999999' },
                description: 'A heavily cratered, icy moon and the second-largest moon of Saturn.',
                temp: '-174°C (avg)',
                composition: { 'Water Ice': 'Bulk', 'Rock': 'Trace' },
                details: {
                    gravity: '0.264 m/s²',
                    orbitalPeriod: '4.5 days',
                    moons: 0,
                    facts: [
                        'Rhea is composed of about 75% water ice and 25% rock.',
                        'It has a very thin atmosphere of oxygen and carbon dioxide.',
                        'It is the first moon besides Earth found to have an atmosphere containing oxygen.',
                        'The surface is highly reflective due to the abundance of ice.',
                        'It has no known geological activity.'
                    ]
                }
            },
            {
                name: 'Enceladus',
                distance: 4.5,
                size: 0.2,
                speed: 0.7,
                color: '#ffffff',
                textureType: 'ICE_GIANT',
                textureColors: { base: '#ffffff', secondary: '#aaccee' },
                description: 'A small, icy moon that shoots massive geysers of water vapor and ice from its south pole.',
                temp: '-201°C (avg)',
                composition: { 'Water Ice': 'Crust', 'Silicate Rock': 'Core' },
                details: {
                    gravity: '0.113 m/s²',
                    orbitalPeriod: '1.37 days',
                    moons: 0,
                    facts: [
                        'Enceladus has a global subsurface ocean of liquid water.',
                        'The geysers suggest that the moon is geologically active.',
                        'It reflects almost 100% of the sunlight that hits it.',
                        'Cassini flew through the plumes and detected organic molecules.',
                        'It is one of the most promising places to search for life.'
                    ]
                }
            },
            {
                name: 'Iapetus',
                distance: 12,
                size: 0.35,
                speed: 0.2,
                color: '#ffffff',
                textureType: 'CRATERED',
                textureColors: { base: '#ffffff', secondary: '#444444' },
                description: 'The "yin-yang" moon, with one hemisphere as dark as charcoal and the other as bright as snow.',
                temp: '-143°C (dark) to -173°C (light)',
                composition: { 'Water Ice': 'Bulk', 'Dark Material': 'Coating' },
                details: {
                    gravity: '0.223 m/s²',
                    orbitalPeriod: '79.3 days',
                    moons: 0,
                    facts: [
                        'Iapetus has a giant equatorial ridge that gives it a walnut-like shape.',
                        'The dark material may come from dust falling from other moons.',
                        'It is the third-largest moon of Saturn.',
                        'It has a very slow rotation, taking 79 days for one turn.',
                        'The ridge is about 20 km high and 1,300 km long.'
                    ]
                }
            },
            {
                name: 'Mimas',
                distance: 3.5,
                size: 0.15,
                speed: 0.9,
                color: '#dddddd',
                textureType: 'CRATERED',
                textureColors: { base: '#dddddd', secondary: '#aaaaaa' },
                description: 'A small, icy moon famous for its resemblance to the Death Star from Star Wars.',
                temp: '-209°C (avg)',
                composition: { 'Water Ice': 'Bulk' },
                details: {
                    gravity: '0.064 m/s²',
                    orbitalPeriod: '0.94 days',
                    moons: 0,
                    facts: [
                        'Herschel Crater is 130 km wide, covering one-third of the moon\'s diameter.',
                        'Mimas is composed almost entirely of water ice.',
                        'It is the smallest spherical body in the Solar System.',
                        'The impact that created Herschel Crater nearly shattered the moon.',
                        'It has a very low density, only slightly higher than water.'
                    ]
                }
            }
        ],
        rings: {
            innerRadius: 6,
            outerRadius: 10,
            color: '#c0a080',
            opacity: 0.8,
            rotation: [Math.PI / 2, 0, 0] // Equatorial
        },
        textureType: 'GAS_GIANT',
        textureColors: { base: '#EAD6B8', secondary: '#C0B080' },
        orbitSpeed: 1,
        rotationSpeed: 0.045,
        eccentricity: 0.056,
        inclination: 2.48,
        axialTilt: 26.73
    },
    {
        name: 'Uranus',
        distance: 190,
        size: 3,
        color: '#D1E7E7',
        description: 'The sideways planet. Knocked onto its side by a cataclysmic ancient collision, Uranus rolls around the Sun like a bowling ball. Its blue-green color comes from methane in the atmosphere.',
        temp: '-224°C (coldest planet)',
        angle: 0.5,
        composition: { 'Hydrogen': '83%', 'Helium': '15%', 'Methane': '2.3%' },
        atmosphere: { 'H2': '82.5%', 'He': '15.2%', 'CH4': '2.3%' },
        atmosphereSettings: { color: '#00ffff', scale: 1.15, opacity: 0.5 },
        details: {
            gravity: '8.69 m/s²',
            orbitalPeriod: '84 years',
            moons: 28,
            dayLength: '17h 14m',
            facts: [
                'Uranus is tilted 97.8° — it essentially orbits on its side, likely from a massive ancient impact.',
                'At -224°C, Uranus holds the record for coldest planetary atmosphere in the solar system.',
                'Uranus was the first planet discovered with a telescope (by William Herschel in 1781).',
                'Its moons are named after characters from Shakespeare and Alexander Pope.',
                'Diamond rain may fall through its high-pressure interior.'
            ]
        },
        moonsData: [
            {
                name: 'Miranda',
                distance: 3.5,
                size: 0.15,
                speed: 0.8,
                color: '#cccccc',
                textureType: 'CRATERED',
                textureColors: { base: '#cccccc', secondary: '#999999' },
                description: 'The innermost and smallest of Uranus\'s five major moons, known for its extreme and varied topography.',
                temp: '-201°C (avg)',
                composition: { 'Water Ice': 'Bulk', 'Silicate Rock': 'Bulk' },
                details: {
                    gravity: '0.079 m/s²',
                    orbitalPeriod: '1.4 days',
                    moons: 0,
                    facts: [
                        'Miranda has some of the deepest canyons in the Solar System (up to 20 km deep).',
                        'Its surface looks like a patchwork quilt of different geological types.',
                        'Verona Rupes is the highest cliff in the Solar System, about 20 km high.',
                        'It may have been shattered and reassembled several times.',
                        'Voyager 2 is the only spacecraft to have visited Miranda.'
                    ]
                }
            },
            {
                name: 'Ariel',
                distance: 4.5,
                size: 0.22,
                speed: 0.6,
                color: '#dddddd',
                textureType: 'CRATERED',
                textureColors: { base: '#dddddd', secondary: '#aaaaaa' },
                description: 'The brightest and possibly youngest of Uranus\'s major moons.',
                temp: '-213°C (avg)',
                composition: { 'Water Ice': 'Bulk', 'Silicate Rock': 'Bulk' },
                details: {
                    gravity: '0.269 m/s²',
                    orbitalPeriod: '2.5 days',
                    moons: 0,
                    facts: [
                        'Ariel has many complex networks of canyons and valleys.',
                        'Its surface is the most reflective of all the moons of Uranus.',
                        'It is composed of roughly equal parts of water ice and silicate rock.',
                        'It shows signs of tectonic and cryovolcanic activity.',
                        'Most of the craters on Ariel appear to be partially buried.'
                    ]
                }
            },
            {
                name: 'Titania',
                distance: 5.5,
                size: 0.3,
                speed: 0.4,
                color: '#dddddd',
                textureType: 'CRATERED',
                textureColors: { base: '#dddddd', secondary: '#aaaaaa' },
                description: 'The largest moon of Uranus and the eighth-largest moon in the Solar System.',
                temp: '-213°C (avg)',
                composition: { 'Water Ice': 'Bulk', 'Silicate Rock': 'Bulk' },
                details: {
                    gravity: '0.379 m/s²',
                    orbitalPeriod: '8.7 days',
                    moons: 0,
                    facts: [
                        'Titania has a very small atmosphere of carbon dioxide.',
                        'Its surface is scarred by giant faults and canyons.',
                        'It is composed of roughly equal amounts of rock and ice.',
                        'Messina Chasma is a canyon system that stretches 1,500 km.',
                        'Titania was discovered by William Herschel in 1787.'
                    ]
                }
            },
            {
                name: 'Oberon',
                distance: 7,
                size: 0.28,
                speed: 0.3,
                color: '#cccccc',
                textureType: 'CRATERED',
                textureColors: { base: '#cccccc', secondary: '#999999' },
                description: 'The outermost major moon of Uranus and its second-largest.',
                temp: '-213°C (avg)',
                composition: { 'Water Ice': 'Bulk', 'Silicate Rock': 'Bulk' },
                details: {
                    gravity: '0.346 m/s²',
                    orbitalPeriod: '13.5 days',
                    moons: 0,
                    facts: [
                        'Oberon is heavily cratered, indicating a very old surface.',
                        'Many of its large craters have dark material at their centers.',
                        'It has a mountain that rises about 6 km above the surface.',
                        'Oberon consists of about half rock and half ice.',
                        'It was also discovered by William Herschel in 1787.'
                    ]
                }
            }
        ],
        rings: {
            innerRadius: 4,
            outerRadius: 6,
            color: '#a0b0c0',
            opacity: 0.4,
            rotation: [Math.PI / 2, 0, 0] // Equatorial
        },
        textureType: 'ICE_GIANT',
        textureColors: { base: '#D1E7E7', secondary: '#B0E0E0' },
        orbitSpeed: 0.7,
        rotationSpeed: 0.03,
        eccentricity: 0.046,
        inclination: 0.77,
        axialTilt: 97.77
    },
    {
        name: 'Neptune',
        distance: 220,
        size: 2.8,
        color: '#3f54ba',
        description: 'The windiest world. This deep-blue ice giant was found through math before it was ever seen through a telescope. Its winds reach a screaming 2,100 km/h.',
        temp: '-214°C',
        angle: 2.8,
        composition: { 'Hydrogen': '80%', 'Helium': '19%', 'Methane': '1.5%' },
        atmosphere: { 'H2': '80%', 'He': '19%', 'CH4': '1.5%' },
        atmosphereSettings: { color: '#4169e1', scale: 1.15, opacity: 0.5 },
        details: {
            gravity: '11.15 m/s²',
            orbitalPeriod: '164.8 years',
            moons: 16,
            dayLength: '16h 6m',
            facts: [
                'Neptune\'s winds reach 2,100 km/h — fastest in the solar system, despite being farthest from the Sun.',
                'It was discovered in 1846 through mathematical predictions — the first planet found by calculation.',
                'Triton is the only large moon that orbits backwards (retrograde), suggesting it was captured from the Kuiper Belt.',
                'Neptune completes one orbit every 164.8 years — it has only completed one orbit since its discovery.',
                'Triton has active geysers that shoot nitrogen gas 8 km into the sky.'
            ]
        },
        moonsData: [
            {
                name: 'Triton',
                distance: 5.5,
                size: 0.4,
                speed: 0.3,
                color: '#ffdddd',
                inclination: 157,
                textureType: 'ICE_GIANT',
                textureColors: { base: '#ffdddd', secondary: '#ffaaaa' },
                description: 'Neptune\'s largest moon and the only large moon in the Solar System that orbits in the opposite direction of its planet\'s rotation.',
                temp: '-235°C (coldest known object)',
                composition: { 'Nitrogen Ice': 'Crust', 'Water Ice': 'Bulk', 'Rock/Metal Core': 'Center' },
                atmosphere: { 'Nitrogen': 'Trace' },
                details: {
                    gravity: '0.779 m/s²',
                    orbitalPeriod: '5.87 days',
                    moons: 0,
                    facts: [
                        'Triton is believed to be a captured Kuiper Belt object.',
                        'It has active nitrogen geysers discovered by Voyager 2.',
                        'The surface resembles the skin of a cantaloupe.',
                        'It is slowly spiraling toward Neptune and will one day be torn apart.',
                        'Triton is one of the few geologically active moons.'
                    ]
                }
            },
            {
                name: 'Nereid',
                distance: 8,
                size: 0.15,
                speed: 0.15,
                color: '#aaaaaa',
                inclination: 27,
                textureType: 'CRATERED',
                textureColors: { base: '#aaaaaa', secondary: '#888888' },
                description: 'A small, irregular moon of Neptune with an extremely eccentric orbit.',
                temp: '-213°C (avg)',
                composition: { 'Water Ice': 'Bulk' },
                details: {
                    gravity: '0.071 m/s²',
                    orbitalPeriod: '360.1 days',
                    moons: 0,
                    facts: [
                        'Nereid has the most eccentric orbit of any moon in the Solar System.',
                        'It orbits at a distance that ranges from 1.3 to 9.6 million km.',
                        'Because of its distance, it takes nearly a year to orbit Neptune.',
                        'It was discovered by Gerard Kuiper in 1949.',
                        'It is named after the sea nymphs of Greek mythology.'
                    ]
                }
            }
        ],
        textureType: 'ICE_GIANT',
        textureColors: { base: '#3f54ba', secondary: '#2a40a0' },
        orbitSpeed: 0.5,
        rotationSpeed: 0.032,
        eccentricity: 0.010,
        inclination: 1.77,
        axialTilt: 28.32
    },
    {
        name: 'Pluto',
        distance: 290,
        size: 0.7,
        color: '#d1c6ad',
        description: 'The heart of the Kuiper Belt. This dwarf planet\'s famous heart-shaped nitrogen glacier (Tombaugh Regio) captivated the world when New Horizons flew past in 2015.',
        temp: '-229°C',
        angle: 1.0,
        composition: { 'Nitrogen Ice': '98%', 'Methane': '1.5%', 'Carbon Monoxide': '0.5%' },
        atmosphere: { 'N2': '99%', 'CH4': '0.25%', 'CO': 'trace' },
        details: {
            gravity: '0.62 m/s²',
            orbitalPeriod: '248 years',
            moons: 5,
            dayLength: '153 hours (6.4 days)',
            facts: [
                'Pluto\'s heart-shaped glacier Tombaugh Regio is 1,000 km across and made of nitrogen ice.',
                'Pluto and Charon are tidally locked to each other — they always show the same face.',
                'Pluto was reclassified as a dwarf planet by the IAU in 2006, sparking worldwide debate.',
                'New Horizons revealed Pluto has blue skies, red ice, and mountain ranges rivaling the Rockies.',
                'Pluto\'s orbit is so eccentric it sometimes comes closer to the Sun than Neptune.'
            ]
        },
        moonsData: [
            {
                name: 'Charon',
                distance: 3,
                size: 0.35,
                speed: 0.2,
                color: '#a0a090',
                textureType: 'CRATERED',
                textureColors: { base: '#909080', secondary: '#707060' },
                description: 'The largest moon of Pluto and so large that they orbit each other as a double dwarf planet system.',
                temp: '-153°C to -233°C',
                composition: { 'Water Ice': 'Surface', 'Rock': 'Interior' },
                details: {
                    gravity: '0.288 m/s²',
                    orbitalPeriod: '6.4 days',
                    moons: 0,
                    facts: [
                        'Charon and Pluto always face each other with the same sides.',
                        'Mordor Macula is a giant dark region at its north pole.',
                        'It is about half the diameter and one-eighth the mass of Pluto.',
                        'Charon was discovered in 1978 by James Christy.',
                        'Its surface seems to be covered in water ice and tholins.'
                    ]
                }
            },
            {
                name: 'Nix',
                distance: 4.5,
                size: 0.08,
                speed: 0.3,
                color: '#cccccc',
                textureType: 'CRATERED',
                textureColors: { base: '#cccccc', secondary: '#aaaaaa' },
                description: 'A small, icy moon of Pluto that has an irregular shape and rotates chaotically.',
                temp: '-223°C (avg)',
                composition: { 'Water Ice': 'Bulk' },
                details: {
                    gravity: '0.002 m/s²',
                    orbitalPeriod: '24.9 days',
                    moons: 0,
                    facts: [
                        'Nix is about 50 km long and 35 km wide.',
                        'It rotates chaotically like a football tumble.',
                        'It was discovered by the Hubble Space Telescope in 2005.',
                        'The surface is likely covered by very clean water ice.',
                        'It is named after the Greek goddess of darkness.'
                    ]
                }
            },
            {
                name: 'Hydra',
                distance: 5.5,
                size: 0.08,
                speed: 0.25,
                color: '#bbbbbb',
                textureType: 'CRATERED',
                textureColors: { base: '#bbbbbb', secondary: '#999999' },
                description: 'The outermost known natural satellite of Pluto, with a highly reflective surface.',
                temp: '-223°C (avg)',
                composition: { 'Water Ice': 'Bulk' },
                details: {
                    gravity: '0.002 m/s²',
                    orbitalPeriod: '38.2 days',
                    moons: 0,
                    facts: [
                        'Hydra is Pluto\'s outermost moon.',
                        'Its surface is composed almost entirely of water ice.',
                        'Like Nix, it has an irregular shape and chaotic rotation.',
                        'It was also discovered by Hubble in 2005.',
                        'It is named after the nine-headed serpent from Greek mythology.'
                    ]
                }
            }
        ],
        textureType: 'CRATERED',
        textureColors: { base: '#d1c6ad', secondary: '#8b7d6b' },
        orbitSpeed: 0.3,
        rotationSpeed: 0.01,
        eccentricity: 0.244,
        inclination: 17.2,
        axialTilt: 122.53
    },
];
