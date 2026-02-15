import { useState, useCallback, useEffect } from 'react';
import { GameCanvas } from './components/3d/GameCanvas';
import { HUD } from './components/ui/HUD';
import { GalaxyMap } from './components/ui/GalaxyMap';
import { WarpEffect } from './components/3d/WarpEffect';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { SYSTEMS } from './data/systems';
import { Canvas } from '@react-three/fiber';
import { useAudio } from './hooks/useAudio';
import { PhysicsAcademy } from './components/ui/PhysicsAcademy';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [selectedPlanetPosition, setSelectedPlanetPosition] = useState<[number, number, number] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSystemId, setCurrentSystemId] = useState('sol');
  const [isTrueScale, setIsTrueScale] = useState(false);
  const [viewMode, setViewMode] = useState<'ORBIT' | 'GALAXY'>('ORBIT');
  const [warpPhase, setWarpPhase] = useState<'IDLE' | 'Charging' | 'Warping' | 'Arrival'>('IDLE');
  const [isLoading, setIsLoading] = useState(true);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);

  console.log('App render:', { isLoading, warpPhase, currentSystemId });


  const audio = useAudio();

  const handlePlanetSelect = useCallback((planet: any, position?: [number, number, number]) => {
    setSelectedPlanet(planet);
    if (position) setSelectedPlanetPosition(position);
    else setSelectedPlanetPosition(null);
  }, []);

  const handleSystemChange = (systemId: string) => {
    // 1. Close Map & Prepare
    setViewMode('ORBIT');
    setWarpPhase('Charging');

    // Play warp sound
    audio.playWarp();

    // 2. Engage Warp (System vanishes)
    setTimeout(() => {
      setWarpPhase('Warping');
      setSelectedPlanet(null);
      setSelectedPlanetPosition(null);
    }, 500);

    // 3. Switch Data (Hidden) & Start Arrival
    setTimeout(() => {
      setCurrentSystemId(systemId);
      setWarpPhase('Arrival');
    }, 1500);

    // 4. Disengage Warp
    setTimeout(() => {
      setWarpPhase('IDLE');
    }, 3500);
  };

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Start ambient music after loading
    audio.startAmbient();
  }, [audio]);

  // Handle ambient sound based on view mode (v3.2)
  useEffect(() => {
    if (isLoading) return;

    if (viewMode === 'GALAXY') {
      audio.stopAmbient();
    } else if (viewMode === 'ORBIT' && warpPhase === 'IDLE') {
      audio.startAmbient();
    }
  }, [viewMode, warpPhase, isLoading, audio]);

  const currentSystem = SYSTEMS[currentSystemId] || SYSTEMS['sol'];

  // Debug check
  if (!currentSystem) {
    return <div className="text-white p-10">System '{currentSystemId}' Not Found</div>;
  }

  const isWarping = warpPhase !== 'IDLE';

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Warp Overlay */}
      {isWarping && (
        <div className="absolute inset-0 z-[100] pointer-events-none fade-in-out">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <WarpEffect />
          </Canvas>
        </div>
      )}

      {viewMode === 'ORBIT' ? (
        <>
          {/* Game Canvas with Transitions */}
          <div
            className={`transition-opacity duration-[2000ms] ease-out w-full h-full
                    ${warpPhase === 'Charging' ? 'opacity-0' : ''}
                    ${warpPhase === 'Warping' ? 'opacity-0' : ''}
                    ${warpPhase === 'Arrival' ? 'opacity-100' : ''}
                    ${warpPhase === 'IDLE' ? 'opacity-100' : ''}
                `}
          >
            <GameCanvas
              key={currentSystemId}
              onPlanetSelect={handlePlanetSelect}
              selectedPlanet={selectedPlanet}
              selectedPlanetPosition={selectedPlanetPosition}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              isTrueScale={isTrueScale}
              currentSystem={currentSystem}
              audio={audio}
            />
          </div>

          {/* Hide HUD during warp for immersion */}
          {!isWarping && (
            <HUD
              selectedPlanet={selectedPlanet}
              onBack={() => { setSelectedPlanet(null); setSelectedPlanetPosition(null); }}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              isTrueScale={isTrueScale}
              onToggleScale={() => setIsTrueScale(!isTrueScale)}
              currentSystemName={currentSystem.name}
              onSwitchSystem={() => setViewMode('GALAXY')}
              onOpenAcademy={() => setIsAcademyOpen(true)}
              distanceFromSol={currentSystem.distanceFromSol}
              audio={audio}
            />
          )}

          {isAcademyOpen && (
            <PhysicsAcademy onClose={() => setIsAcademyOpen(false)} />
          )}
        </>
      ) : (
        <GalaxyMap
          onSystemSelect={handleSystemChange}
          currentSystemId={currentSystemId}
          onClose={() => setViewMode('ORBIT')}
        />
      )}
    </div>
  );
}

export default App;
