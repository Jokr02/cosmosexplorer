export interface Formula {
    label: string;
    latex: string;
}

export interface PhysicsTopic {
    id: string;
    title: string;
    description: string;
    details: string[];
    formulas?: Formula[];
    funFact: string;
    category: 'Relativity' | 'Quantum' | 'Classical' | 'Cosmology' | 'Stellar' | 'Astrobiology';
}

export const PHYSICS_TOPICS: PhysicsTopic[] = [
    {
        id: 'chnops',
        title: 'CHNOPS: The Elements of Life',
        category: 'Astrobiology',
        description: 'The six key chemical elements whose covalent combinations make up most biological molecules on Earth.',
        details: [
            'CHNOPS stands for Carbon, Hydrogen, Nitrogen, Oxygen, Phosphorus, and Sulfur. These elements are the building blocks of proteins, nucleic acids, and lipids.',
            'Carbon is the most important due to its ability to form four stable covalent bonds, allowing for the construction of complex, stable organic molecules like DNA.',
            'Phosphorus is essential for energy transfer (ATP) and the backbone of genetic material, while Sulfur is critical for the structure of many proteins.'
        ],
        formulas: [
            { label: 'Organic Composition', latex: 'C_{600}H_{1000}N_{15}O_{40}P_1S_1' }
        ],
        funFact: 'About 98% of the mass of every living organism on Earth is made up of just these six elements!'
    },
    {
        id: 'biosignatures',
        title: 'Biosignatures',
        category: 'Astrobiology',
        description: 'Substances or phenomena that provide scientific evidence of past or present life.',
        details: [
            'Astronomers look for "Gaseous Biosignatures" in exoplanet atmospheres using spectroscopy. The presence of oxygen ($O_2$) and methane ($CH_4$) in the same atmosphere is a strong indicator of life, as they normally react and disappear.',
            'Technosignatures, such as radio signals or laser emissions, would indicate the presence of advanced civilizations.',
            'Phosphine ($PH_3$) was recently detected in Venus\'s clouds, sparking a debate because it is primarily produced by anaerobic life on Earth.'
        ],
        formulas: [
            { label: 'Photosynthesis Balance', latex: '6CO_2 + 6H_2O \\rightarrow C_6H_{12}O_6 + 6O_2' }
        ],
        funFact: 'The James Webb Space Telescope (JWST) is currently analyzing the atmosphere of TRAPPIST-1e for these very signals!'
    },
    {
        id: 'habitable-zone-science',
        title: 'Habitable Zone Dynamics',
        category: 'Astrobiology',
        description: 'The scientific parameters that define a planet\'s ability to host liquid water.',
        details: [
            'The Habitable Zone is not just about distance from a star; it depends on the star\'s luminosity and the planet\'s atmospheric composition (the Greenhouse Effect).',
            'Albedo (reflectivity) plays a major role. A highly reflective planet (like one covered in ice) would need to be closer to its star to remain warm enough for liquid water.',
            'Tidal heating, caused by gravitational tug-of-war from a host planet or nearby moons, can create habitable environments far outside the traditional Goldilocks zone (e.g., Europa).'
        ],
        formulas: [
            { label: 'Equilibrium Temperature', latex: 'T_{eq} = T_* \\sqrt{\\frac{R_*}{2d}} (1 - A)^{1/4}' }
        ],
        funFact: 'Earth would be a frozen ball of ice with a temperature of -18°C if it weren\'t for the natural Greenhouse Effect of our atmosphere!'
    },
    {
        id: 'extremophiles',
        title: 'Extremophiles',
        category: 'Astrobiology',
        description: 'Organisms that thrive in conditions that would be lethal to most life on Earth.',
        details: [
            'Thermophiles live in boiling hydrothermal vents, while Psychrophiles thrive in sub-zero Antarctic ice. Their existence suggests life could survive in the oceans of Europa or Enceladus.',
            'Tardigrades (Water Bears) can survive the vacuum of space, extreme radiation, and temperatures near absolute zero by entering a state of "cryptobiosis."',
            'Radio-resistant organisms like *Deinococcus radiodurans* can withstand radiation doses thousands of times higher than would kill a human, repairing their DNA on the fly.'
        ],
        funFact: 'Some bacteria on Earth have been found living 3 kilometers underground, "breathing" iron and living off chemical energy instead of sunlight!'
    },
    {
        id: 'rare-earth',
        title: 'The Rare Earth Hypothesis',
        category: 'Astrobiology',
        description: 'The theory that while microbial life may be common, complex multicellular life is exceedingly rare.',
        details: [
            'This hypothesis suggests a "Great Filter" of requirements for complex life: a large moon for axial stability, a Jupiter-like planet to deflect comets, and Plate Tectonics to recycle carbon.',
            'The "Galactic Habitable Zone" also limits where life can form—too close to the center and radiation from the black hole is too high; too far out and there aren\'t enough heavy elements (metals) to build planets.',
            'If this theory is correct, we might be the only technological civilization in our entire galaxy.'
        ],
        formulas: [
            { label: 'Rare Earth Equation', latex: 'N = N^* \\cdot f_p \\cdot f_{hz} \\cdot f_l \\cdot f_m \\cdot f_i \\cdot f_c' }
        ],
        funFact: 'Our Moon is unusually large for our planet; without it, Earth\'s tilt would wobble chaotically, making stable climates impossible for complex life!'
    },
    {
        id: 'astrobiology',
        title: 'Astrobiology',
        category: 'Astrobiology',
        description: 'The study of the origin, evolution, and distribution of life in the universe.',
        details: [
            'Astrobiology seeks to understand the conditions necessary for life as we know it—liquid water, a source of energy, and an inventory of organic molecules.',
            'Scientists look for "Biosignatures" in the atmospheres of exoplanets, such as the presence of oxygen, methane, and carbon dioxide in specific ratios that suggest biological activity.',
            'The "Habitable Zone" (or Goldilocks Zone) is the region around a star where liquid water can exist on a planet\'s surface, but life might also exist in subsurface oceans on moons like Europa or Enceladus.'
        ],
        formulas: [
            { label: 'Drake Equation', latex: 'N = R^* f_p n_e f_l f_i f_c L' }
        ],
        funFact: 'Water is one of the most common molecules in the universe, and we have already detected it in the atmospheres of several distant exoplanets!'
    },
    {
        id: 'cosmic-strings',
        title: 'Cosmic Strings',
        category: 'Cosmology',
        description: 'Hypothetical 1D topological defects that may have formed during the early universe.',
        details: [
            'Cosmic strings are theoretical one-dimensional defects in the fabric of spacetime, similar to cracks in ice forming as water freezes.',
            'They would be incredibly thin—much thinner than an atom—but could be light-years long and possess immense mass, warping spacetime around them.',
            'If they exist, cosmic strings would exert enormous gravitational pull and could potentially be detected through their effect on the Cosmic Microwave Background or through gravitational lensing.'
        ],
        formulas: [
            { label: 'String Tension (μ)', latex: '\\mu = \\frac{1}{G}' }
        ],
        funFact: 'Some theories suggest that cosmic strings could be used to create closed timelike curves, theoretically allowing for time travel!'
    },
    {
        id: 'gravitation',
        title: 'Gravitation',
        category: 'Classical',
        description: 'The force that pulls all objects with mass toward one another.',
        details: [
            'Newton\'s Law of Universal Gravitation states that any two bodies in the universe attract each other with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between them.',
            'This inverse-square law means that if you double the distance between two objects, the gravitational pull between them drops to one-fourth of its original strength.',
            'Gravity is the weakest of the four fundamental forces (compared to Electromagnetism, and the Strong and Weak Nuclear forces), yet it dominates the large-scale structure of the universe due to its infinite range and lack of "negative" gravity to cancel it out.'
        ],
        formulas: [
            { label: 'Newton\'s Law', latex: 'F = G \\frac{m_1 m_2}{r^2}' }
        ],
        funFact: 'Gravitational waves—ripples in spacetime caused by massive accelerated objects—were first detected in 2015, confirming a 100-year-old prediction by Einstein!'
    },
    {
        id: 'general-relativity',
        title: 'General Relativity',
        category: 'Relativity',
        description: 'Gravity interpreted as the geometry of space and time.',
        details: [
            'Einstein\'s field equations describe how energy and momentum warp the geometry of spacetime. In this view, gravity is not a "force" in the traditional sense, but a consequence of objects following the shortest path (geodesic) through curved spacetime.',
            'The theory has passed every experimental test to date, including the precise measurement of Mercury\'s orbital precession and the deflection of starlight by the Sun (gravitational lensing).',
            'It predicts the existence of frame-dragging, where a massive rotating object actually "drags" spacetime around with it as it spins.'
        ],
        formulas: [
            { label: 'Einstein Field Equation', latex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}' }
        ],
        funFact: 'Without General Relativity, GPS systems would fail within minutes; the satellites\' clocks run about 45 microseconds faster per day than ours!'
    },
    {
        id: 'time-dilation',
        title: 'Time Dilation',
        category: 'Relativity',
        description: 'The relative nature of time passage depending on velocity and gravity.',
        details: [
            'Special Relativity dictates that as an object approaches the speed of light ($c$), time appears to slow down for that object relative to a stationary observer. This is called Kinematic Time Dilation.',
            'General Relativity adds Gravitational Time Dilation: time passes more slowly in stronger gravitational fields. A person living at sea level technically ages slightly slower than someone living on a mountain peak.',
            'At the Event Horizon of a black hole, time dilation becomes infinite relative to an outside observer; an object falling in would appear to "freeze" at the edge forever.'
        ],
        formulas: [
            { label: 'Lorentz Factor ($\\gamma$)', latex: '\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}' },
            { label: 'Time Dilation Equation', latex: 't\' = t \\gamma' }
        ],
        funFact: 'Cosmic ray muons, which should decay high in the atmosphere, reach the ground only because their high speed causes time to slow down for them!'
    },
    {
        id: 'black-holes',
        title: 'Black Holes',
        category: 'Cosmology',
        description: 'Gravitational singularities with an escape velocity exceeding the speed of light.',
        details: [
            'A black hole forms when a massive stellar core collapses into a singularity—a point of infinite density. The "size" of a non-rotating black hole is determined by its Schwarzschild Radius ($R_s$).',
            'Quantum effects at the event horizon lead to Hawking Radiation, a theoretical process where black holes slowly lose mass and eventually evaporate over trillions of years.',
            'Rotating black holes (Kerr black holes) possess an Ergosphere, a region where spacetime itself is forced to rotate, allowing for theoretical energy extraction via the Penrose Process.'
        ],
        formulas: [
            { label: 'Schwarzschild Radius', latex: 'R_s = \\frac{2GM}{c^2}' },
            { label: 'Hawking Temperature', latex: 'T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}' }
        ],
        funFact: 'If the Sun were compressed into a black hole, its Schwarzschild Radius would be only 3 kilometers!'
    },
    {
        id: 'stellar-evolution',
        title: 'Stellar Evolution',
        category: 'Stellar',
        description: 'The lifecycle of stars, from nebulae to degenerate remnants.',
        details: [
            'Stars are born in giant molecular clouds (nebulae) and spend most of their lives on the "Main Sequence," fusing hydrogen into helium.',
            'The fate of a star depends entirely on its initial mass. Low-mass stars like the Sun become Red Giants and then White Dwarfs. High-mass stars explode as Supernovae, leaving behind Neutron Stars or Black Holes.',
            'Neutron stars are so dense that a teaspoon of their material would weigh a billion tons. They are supported against further collapse by "neutron degeneracy pressure."'
        ],
        formulas: [
            { label: 'Chandrasekhar Limit', latex: '1.44 M_{\\odot}' },
            { label: 'Mass-Luminosity Relation', latex: 'L \\propto M^{3.5}' }
        ],
        funFact: 'Most of the atoms in your body, including carbon and oxygen, were forged inside the cores of dying stars billions of years ago!'
    },
    {
        id: 'nuclear-fusion',
        title: 'Nuclear Fusion',
        category: 'Quantum',
        description: 'The process of combining atomic nuclei to release energy.',
        details: [
            'In the cores of stars, temperatures reach millions of degrees, allowing protons to overcome their electrical repulsion and fuse. This is governed by the Proton-Proton Chain or the CNO Cycle.',
            'The energy released comes from the "mass defect"—the resulting nucleus weighs slightly less than the sum of its parts. This lost mass is converted directly into energy via Einstein\'s most famous equation.',
            'Fusion requires overcoming the "Coulomb Barrier," which stars manage through a combination of extreme pressure and Quantum Tunneling.'
        ],
        formulas: [
            { label: 'Mass-Energy Equivalence', latex: 'E = mc^2' }
        ],
        funFact: 'Every second, the Sun converts 600 million tons of hydrogen into helium, losing 4 million tons of mass in the process!'
    },
    {
        id: 'dark-matter',
        title: 'Dark Matter & Energy',
        category: 'Cosmology',
        description: 'The invisible 95% of the universe that controls its expansion and structure.',
        details: [
            'Dark Matter is an invisible substance that does not emit, absorb, or reflect light, but exerts gravitational pull. It provides the "glue" that keeps galaxies from flying apart.',
            'Dark Energy is a mysterious pressure that appears to be accelerating the expansion of the universe. It is often modeled as the "Cosmological Constant" ($\Lambda$) in Einstein\'s equations.',
            'The current "$\Lambda$CDM" model suggests the universe is 68% Dark Energy, 27% Dark Matter, and only 5% "Normal" matter (everything we can see).'
        ],
        formulas: [
            { label: 'Critical Density', latex: '\\rho_c = \\frac{3 H^2}{8 \\pi G}' },
            { label: 'Hubble\'s Law', latex: 'v = H_0 d' }
        ],
        funFact: 'We are currently moving through a "Dark Matter Wind" as the Earth orbits the Sun and the Sun orbits the center of the Milky Way!'
    },
    {
        id: 'big-bang',
        title: 'The Big Bang',
        category: 'Cosmology',
        description: 'The rapid expansion of space from a state of extremely high density and temperature.',
        details: [
            'The Big Bang theory is the prevailing cosmological model of the observable universe from the earliest known periods through its subsequent large-scale evolution.',
            'It suggests that the universe began as a nearly infinite density and heat at a "singularity" approximately 13.8 billion years ago, and has been expanding ever since.',
            'Evidence for the Big Bang includes the expansion of the universe (Hubble\'s Law), the Cosmic Microwave Background radiation, and the abundance of light elements like hydrogen and helium.'
        ],
        formulas: [
            { label: 'Scale Factor Evolution', latex: 'H(a) = H_0 \\sqrt{\\Omega_{m,0} a^{-3} + \\Omega_{r,0} a^{-4} + \\Omega_{\\Lambda,0}}' }
        ],
        funFact: 'The afterglow of the Big Bang, the Cosmic Microwave Background, is still visible today as static on old analog televisions!'
    },
    {
        id: 'neutron-stars',
        title: 'Neutron Stars & Pulsars',
        category: 'Stellar',
        description: 'The collapsed cores of massive stars, composed almost entirely of neutrons.',
        details: [
            'Neutron stars are the remnants of massive stars that exploded as supernovae. They are so dense that protons and electrons are crushed together to form neutrons.',
            'A typical neutron star has a mass 1.4 times that of the Sun but a radius of only 10 kilometers. Their magnetic fields are trillions of times stronger than Earth\'s.',
            'Pulsars are highly magnetized, rotating neutron stars that emit beams of electromagnetic radiation from their magnetic poles. If these beams point toward Earth, we see them as regular pulses.'
        ],
        formulas: [
            { label: 'Neutron Star Density', latex: '\\rho \\approx 4 \\times 10^{17} \\text{ kg/m}^3' },
            { label: 'Magnetic Field Strength', latex: 'B \\approx 10^8 - 10^{15} \\text{ Gauss}' }
        ],
        funFact: 'A sugar-cube-sized piece of neutron star material would weigh about 1 billion tons—roughly the weight of Mount Everest!'
    },
    {
        id: 'quantum-entanglement',
        title: 'Quantum Entanglement',
        category: 'Quantum',
        description: 'A physical phenomenon where particles become interlinked such that the state of one instantly influences the other, regardless of distance.',
        details: [
            'Quantum entanglement is a property of quantum mechanics where the quantum states of two or more particles cannot be described independently of each other.',
            'Measurement of a property (like spin or polarization) of one entangled particle instantly determines the result for the other, even if they are separated by light-years.',
            'Einstein famously referred to this as "spooky action at a distance." It is a fundamental resource for quantum computing and secure communication.'
        ],
        formulas: [
            { label: 'Bell State (Example)', latex: '|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)' }
        ],
        funFact: 'Entanglement has been demonstrated over distances of more than 1,200 kilometers using satellite-to-ground links!'
    },
    {
        id: 'gravitational-lensing',
        title: 'Gravitational Lensing',
        category: 'Relativity',
        description: 'The bending of light from distant objects by the gravitational field of a massive foreground object.',
        details: [
            'As predicted by General Relativity, mass curves spacetime. Light traveling through this curved space follows the curve, causing it to appear bent to an observer.',
            'A massive object, like a galaxy cluster, acts as a cosmic "lens," magnifying and distorting the light of more distant galaxies behind it.',
            'This effect allows astronomers to study objects that would otherwise be too faint to see and provides a way to map the distribution of dark matter in the universe.'
        ],
        formulas: [
            { label: 'Einstein Radius', latex: '\\theta_E = \\sqrt{\\frac{4GM}{c^2} \\frac{d_{LS}}{d_L d_S}}' }
        ],
        funFact: 'Gravitational lensing can sometimes create "Einstein Rings" or "Einstein Crosses," where a single distant galaxy appears as multiple images!'
    },
    {
        id: 'entropy-heat-death',
        title: 'Entropy & The Heat Death',
        category: 'Cosmology',
        description: 'The ultimate fate of the universe based on the Second Law of Thermodynamics.',
        details: [
            'The Second Law of Thermodynamics states that the total entropy (disorder) of an isolated system always increases over time.',
            'In the far future, the universe may reach a state of maximum entropy, where all energy is evenly distributed and no further work can be done. This is known as the "Heat Death of the Universe."',
            'In this state, all stars will have burned out, black holes will have evaporated, and the universe will be a cold, dark, and empty void at nearly absolute zero.'
        ],
        formulas: [
            { label: 'Boltzmann\'s Entropy Formula', latex: 'S = k \\ln W' }
        ],
        funFact: 'The timeline for the Heat Death is staggeringly long—experts predict it could take $10^{100}$ years for the last black hole to evaporate!'
    },
    {
        id: 'orbital-mechanics',
        title: 'Orbital Mechanics',
        category: 'Classical',
        description: 'The application of ballistics and celestial mechanics to the practical problems concerning the motion of rockets and other spacecraft.',
        details: [
            'Orbital mechanics is governed by Kepler\'s Laws of Planetary Motion. The most important realization is that orbiting is actually "falling" toward a body but moving sideways fast enough to constantly miss it.',
            'Every orbit has a specific "Escape Velocity"—the minimum speed an object must reach to break free from a planet\'s gravitational pull without further propulsion.',
            'Conservation of Angular Momentum dictates that a planet or satellite moves faster at "Periapsis" (the closest point) and slower at "Apoapsis" (the farthest point).'
        ],
        formulas: [
            { label: 'Orbital Velocity', latex: 'v \\approx \\sqrt{\\frac{GM}{r}}' },
            { label: 'Escape Velocity', latex: 'v_e = \\sqrt{\\frac{2GM}{r}}' }
        ],
        funFact: 'To stay in orbit just 400 kilometers above Earth (like the ISS), you have to travel at a staggering 28,000 kilometers per hour!'
    },
    {
        id: 'lagrange-points',
        title: 'Lagrange Points',
        category: 'Classical',
        description: 'Specific positions in space where the gravitational pull of two large masses precisely equals the centripetal force required for a small object to move with them.',
        details: [
            'There are five Lagrange points for any system of two large bodies (like the Sun and Earth). $L_1$, $L_2$, and $L_3$ are unstable, while $L_4$ and $L_5$ are stable "gravity traps."',
            'The $L_2$ point, located 1.5 million kilometers "behind" the Earth from the Sun, is the perfect home for infrared telescopes like JWST because it allows for a clear, shadowed view of deep space.',
            'Stable $L_4$ and $L_5$ points often accumulate "Trojan" asteroids—objects that share an orbit with a planet but stay 60 degrees ahead or behind it.'
        ],
        formulas: [
            { label: 'Force Equilibrium', latex: 'F_g = F_c' }
        ],
        funFact: 'Jupiter has over 10,000 "Trojan" asteroids parked in its $L_4$ and $L_5$ Lagrange points!'
    },
    {
        id: 'wormholes',
        title: 'Wormholes',
        category: 'Relativity',
        description: 'Hypothetical structures linking disparate points in spacetime, also known as Einstein-Rosen bridges.',
        details: [
            'Wormholes are solutions to the Einstein Field Equations that act as "shortcuts" through the fabric of the universe, potentially allowing for faster-than-light travel without violating local relativity.',
            'Theoretically, a "Traversable Wormhole" would require a coating of "Exotic Matter" with negative energy density to prevent the throat from collapsing instantly.',
            'Kip Thorne famously showed that if a wormhole exists, it could potentially be used as a time machine by moving one "mouth" at relativistic speeds relative to the other.'
        ],
        formulas: [
            { label: 'Metric (Kerr-Schild)', latex: 'ds^2 = -(1-f)dt^2 + (1+f)dr^2 + r^2 d\\Omega^2' }
        ],
        funFact: 'While mathematically possible, no evidence of a wormhole has ever been found, and many physicists believe they are prohibited by the laws of quantum gravity.'
    },
    {
        id: 'fermi-paradox',
        title: 'The Fermi Paradox',
        category: 'Astrobiology',
        description: 'The discrepancy between the high probability of extraterrestrial life and the lack of evidence for, or contact with, such civilizations.',
        details: [
            'If the Drake Equation suggests the galaxy should be teeming with life, the Fermi Paradox asks: "Where is everybody?" Possible answers range from the "Great Filter" to the "Zoo Hypothesis."',
            'The "Great Filter" suggests there is a developmental step that is nearly impossible to pass (like the transition from single cells to complex life, or the discovery of nuclear power).',
            'Another theory is that advanced civilizations exist but have no interest in communicating or are actively hiding to avoid detection by "Apex" civilizations (The Dark Forest theory).'
        ],
        funFact: 'Enrico Fermi famously proposed this question in 1950 during a casual lunch conversation at Los Alamos National Laboratory!'
    },
    {
        id: 'magnetars',
        title: 'Magnetars',
        category: 'Stellar',
        description: 'A type of neutron star with an extremely powerful magnetic field.',
        details: [
            'Magnetars possess the strongest magnetic fields in the universe, up to $10^{15}$ Gauss. For comparison, Earth\'s magnetic field is about 0.5 Gauss.',
            'When the magnetic field of a magnetar decays or shifts, it can trigger "Starquakes" that release more energy in a fraction of a second than the Sun emits in 100,000 years.',
            'A magnetar within 1,000 kilometers would instantly dissolve your body by warping the electron clouds of your atoms, making life as we know it impossible.'
        ],
        formulas: [
            { label: 'Magnetic Energy Density', latex: 'u_B = \\frac{B^2}{2\\mu_0}' }
        ],
        funFact: 'A magnetar located halfway to the moon could strip the data from every credit card on Earth!'
    },
    {
        id: 'multiverse',
        title: 'The Multiverse',
        category: 'Cosmology',
        description: 'The hypothetical collection of potentially diverse observable universes.',
        details: [
            'The Multiverse hypothesis suggests our universe is just one of many. This arises from several theories, including "Eternal Inflation" and the "Many-Worlds Interpretation" of quantum mechanics.',
            'In "Level II" Multiverses, separate universes form as "bubbles" in an eternally inflating sea, each potentially having different physical constants (like the strength of gravity).',
            'If the universe is infinite, then mathematical probability dictates that there could be an identical copy of our universe—and you—somewhere out there.'
        ],
        formulas: [
            { label: 'Inflationary Potential', latex: 'V(\\phi) \\approx \\frac{1}{2}m^2\\phi^2' }
        ],
        funFact: 'Some versions of the Multiverse theory suggests that every time you make a decision, the universe splits into two separate realities!'
    }
];
