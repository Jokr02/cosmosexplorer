# Cosmos Explorer

Cosmos Explorer is an interactive 3D solar system simulation built with **React**, **Three.js**, and **React Three Fiber**. It offers a visually stunning and scientifically inspired exploration of our solar system and beyond, featuring realistic orbital mechanics, dynamic lighting, and detailed planetary data.

## Features

### 🌌 Galaxy Navigation
-   **11 Star Systems**: Sol, Alpha Centauri, TRAPPIST-1, Kepler-186, Tau Ceti, Epsilon Eridani, 55 Cancri, Gliese 667C, HD 40307, Wolf 1061, TOI-700.
-   **Galaxy Map**: Billboard labels (always face camera), animated star glow halos, hover info panels, nebula particle cloud, cinematic fog.
-   **HUD**: Distance from Sol displayed in light years.

### 🪐 Interactive 3D Solar System
-   **Full Sol System**: Sun, 8 planets, Pluto, 20+ moons, asteroid belt, and comets.
-   **Dual Scale Modes**:
    -   **Game Scale**: Stylized view for easy navigation and visibility.
    -   **True Scale**: Scientifically accurate relative sizes and distances.
-   **Orbital Mechanics**: Real-time simulation with accurate relative speeds, eccentricity, and inclination.
-   **Detailed Info Panels**: Click any celestial body to view stats (gravity, temperature, composition, etc.) and 5 scientific facts each.

### 🎨 Visual Realism

#### Procedural Textures (Fractal Brownian Motion)
All planet textures are generated procedurally using a custom **value noise + fbm** system:
-   **Terrestrial** (Earth, Mars): Fractal coastlines, deep/shallow oceans, highlands, mountain snow lines, polar ice caps, cloud wisps.
-   **Gas Giant** (Jupiter, Saturn): Turbulent banded atmosphere with noise displacement, polar darkening, Great Red Spot-style storm features.
-   **Ice Giant** (Uranus, Neptune): Smooth pole-to-pole gradients with subtle banding and wispy cloud features.
-   **Cratered** (Mercury, Moon): 3-tier impact craters (large/medium/small) with rims, shadowed floors, and ejecta.
-   **Volcanic** (55 Cancri e): Dark rocky terrain with lava crack detection via noise gradients and volcanic hotspots.

#### Atmospheric Glow
Custom GLSL **Fresnel shader** creates realistic limb-scattering glow on 7 planets with atmospheres:
-   Uses `pow(1.0 - dot(viewDir, normal), 3.0)` for physically-based edge falloff.
-   Additive blending, back-face rendering, per-planet color/opacity tuning.

#### Habitable Zone
-   Translucent green ring around each star marking where liquid water could exist.
-   Boundaries calculated from stellar luminosity: `HZ_inner = √(L/1.1)`, `HZ_outer = √(L/0.53)`.

#### Axial Tilt
Real NASA values applied to all 9 Sol planets:
| Planet  | Tilt    | Notable                               |
|---------|---------|---------------------------------------|
| Mercury | 0.03°   | Almost perfectly upright              |
| Venus   | 177.4°  | Retrograde rotation (upside-down)     |
| Earth   | 23.4°   | Causes our seasons                    |
| Mars    | 25.2°   | Similar to Earth's                    |
| Jupiter | 3.1°    | Nearly upright                        |
| Saturn  | 26.7°   | Significant tilt, visible in rings    |
| Uranus  | 97.8°   | Rolls on its side                     |
| Neptune | 28.3°   | Similar to Earth's                    |
| Pluto   | 122.5°  | Tilted past sideways                  |

Rings and moons orbit in the planet's tilted plane, and self-rotation occurs around the tilted axis.

#### Other Visual Effects
-   **Asteroid Belt**: 1,500 procedural particles between Mars and Jupiter.
-   **Comet Trails**: Animated comets with glowing tails.
-   **Planet Rings**: Saturn and Uranus rings with correct tilt alignment.
-   **Starfield**: Procedurally generated background star particles.

### 🔭 Moon Exploration
-   View moons orbiting their parent planets with interactive labels.
-   Top-down camera mode for inspecting moon systems.

## Architecture

### Key Components

```
src/
├── components/
│   ├── 3d/
│   │   ├── SolarSystem.tsx      # Main scene: planets, orbits, moons, rings
│   │   ├── Sun.tsx              # Sun with glow shader
│   │   ├── HabitableZone.tsx    # Green translucent habitable zone ring
│   │   ├── AtmosphericGlow.tsx  # Fresnel atmospheric edge glow shader
│   │   ├── AsteroidBelt.tsx     # Procedural asteroid particle ring
│   │   ├── PlanetRing.tsx       # Saturn/Uranus ring component
│   │   └── Comet.tsx            # Animated comet with trail
│   └── ui/
│       ├── GalaxyMap.tsx        # 3D galaxy navigation with billboard labels
│       ├── HUD.tsx              # Top-left system info + distance from Sol
│       └── PlanetInfoPanel.tsx  # Detailed info sidebar on planet select
├── data/
│   ├── systems.ts               # All 11 star systems + star data
│   ├── planets.ts               # Sol planets with textures, atmospheres, facts
│   └── comets.ts                # Comet orbit definitions
└── utils/
    └── textureGenerator.ts      # Procedural texture generator (fbm noise)
```

### Scene Hierarchy (per Planet)

```
groupRef (orbital position — moves along elliptical path)
  └── Axial Tilt Group (static rotation matching real tilt)
        ├── Self-Rotation Group (meshRef — spins around tilted Y axis)
        │     ├── Hitbox (invisible, oversized for click detection)
        │     └── Planet Mesh (sphere + procedural texture)
        ├── Atmospheric Glow (Fresnel shader, additive blend)
        ├── Planet Rings (if applicable, inherits tilt)
        └── Moons (orbit in tilted plane, inherit tilt)
  └── Hover Tooltip (not tilted — always faces camera via Html)
```

## Tech Stack

-   **Frontend Framework**: React 19
-   **3D Engine**: Three.js
-   **React Integration**: @react-three/fiber, @react-three/drei
-   **Styling**: TailwindCSS
-   **Build Tool**: Vite
-   **Icons**: Lucide React
-   **Language**: TypeScript

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/cosmos-explorer.git
    cd cosmos-explorer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Controls

-   **Left Click + Drag**: Rotate Camera (Orbit Mode)
-   **Right Click + Drag**: Pan Camera
-   **Scroll**: Zoom In/Out
-   **Click Object**: Select planet/moon and fly to it.
-   **HUD Controls**:
    -   **Pause/Resume**: Toggle orbital simulation.
    -   **Scale Toggle**: Switch between Game Scale and True Scale modes.
    -   **Galaxy Map**: Open the 3D galaxy navigation view.
