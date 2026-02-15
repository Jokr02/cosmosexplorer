import { Play, Pause, Maximize2, Map, Volume2, VolumeX, BookOpen } from 'lucide-react';
import type { AudioControls } from '../../hooks/useAudio';

interface HUDProps {
    selectedPlanet: any;
    onBack: () => void;
    isPaused: boolean;
    onTogglePause: () => void;
    isTrueScale: boolean;
    onToggleScale: () => void;
    currentSystemName: string;
    onSwitchSystem: () => void;
    distanceFromSol: number;
    onOpenAcademy: () => void;
    audio?: AudioControls;
}

export const HUD = ({ isPaused, onTogglePause, isTrueScale, onToggleScale, currentSystemName, onSwitchSystem, onOpenAcademy, distanceFromSol, audio }: HUDProps) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-4 font-mono text-cyan-400 z-50">
            <div className="flex justify-between items-start">
                {/* Top Left: Logo / Status */}
                <div className="border border-cyan-500/30 bg-black/60 p-3 rounded backdrop-blur-md pulse-glow scanlines relative overflow-hidden">
                    <h1 className="text-xl font-bold tracking-widest text-cyan-400 glitch-text">COSMOS EXPLORER</h1>
                    <div className="flex flex-col mt-1 border-t border-cyan-500/20 pt-1">
                        <div className="text-sm text-white font-semibold tracking-wider uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 led-active inline-block" />
                            {currentSystemName}
                        </div>
                        <div className="text-[10px] text-cyan-600 tracking-widest mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 inline-block" />
                            <span>SECTOR {currentSystemName === 'Sol System' ? '001' : 'UNKNOWN'}</span>
                            <span className="mx-1 text-cyan-800">|</span>
                            <span className="text-cyan-700">NAV ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* Top Right: Distance from Sol */}
                <div className="border border-cyan-500/30 bg-black/60 p-3 rounded backdrop-blur-md text-right breathe-border">
                    <div className="text-4xl font-bold number-tick">
                        {distanceFromSol === 0 ? '0' : distanceFromSol.toFixed(1)} <span className="text-sm font-normal text-cyan-500">LY</span>
                    </div>
                    <div className="text-xs text-cyan-600 tracking-widest">DIST. FROM SOL</div>
                    <div className="mt-1 flex justify-end gap-1">
                        <span className="w-1 h-1 rounded-full bg-cyan-500/40 inline-block" />
                        <span className="w-1 h-1 rounded-full bg-cyan-500/40 inline-block" />
                        <span className="w-1 h-1 rounded-full bg-cyan-400/80 inline-block led-active" />
                    </div>
                </div>
            </div>

            {/* Time Controls */}
            <div className="absolute bottom-4 left-4 flex gap-4 pointer-events-auto">
                <button
                    onClick={() => { onTogglePause(); audio?.playClick(); }}
                    className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-all duration-300 border border-gray-600 backdrop-blur-sm hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    title={isPaused ? "Resume Orbit" : "Pause Orbit"}
                    onMouseEnter={() => audio?.playHover()}
                >
                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>

                <button
                    onClick={() => { onToggleScale(); audio?.playClick(); }}
                    className={`px-4 py-2 rounded-full hover:bg-gray-700/80 transition-all duration-300 border backdrop-blur-sm flex items-center gap-2 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] ${isTrueScale ? 'bg-indigo-900/80 text-indigo-200 border-indigo-500/50' : 'bg-gray-800/80 border-gray-600 hover:border-cyan-500/50'}`}
                    title="Toggle True Scale Mode"
                    onMouseEnter={() => audio?.playHover()}
                >
                    <Maximize2 size={18} />
                    <span className="text-sm font-bold">{isTrueScale ? 'TRUE SCALE: ON' : 'Scale: Game'}</span>
                </button>

                {/* Volume Toggle */}
                {audio && (
                    <button
                        onClick={() => { audio.toggleMute(); }}
                        className={`p-2 rounded-full transition-all duration-300 border backdrop-blur-sm ${audio.isMuted ? 'bg-red-900/40 border-red-500/30 text-red-400' : 'bg-gray-800/80 border-gray-600 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]'}`}
                        title={audio.isMuted ? "Unmute" : "Mute"}
                        onMouseEnter={() => audio?.playHover()}
                    >
                        {audio.isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                )}
            </div>

            {/* Bottom Center: Galaxy Map & System Name */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
                <div className="border border-cyan-500/30 bg-black/60 p-2 rounded backdrop-blur-md px-6 flex items-center gap-4 breathe-border">
                    <button
                        onClick={() => { onSwitchSystem(); audio?.playPanelOpen(); }}
                        className="p-2 hover:bg-slate-700 rounded transition-all duration-300 hover:shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        title="Open Galaxy Map"
                        onMouseEnter={() => audio?.playHover()}
                    >
                        <Map size={24} className="text-blue-400" />
                    </button>
                    <h1 className="text-2xl font-bold tracking-widest text-blue-100 uppercase">{currentSystemName}</h1>
                    <button
                        onClick={() => { onOpenAcademy(); audio?.playPanelOpen(); }}
                        className="p-2 hover:bg-emerald-700/50 rounded transition-all duration-300 hover:shadow-[0_0_8px_rgba(16,185,129,0.3)] group"
                        title="Open Physics Academy"
                        onMouseEnter={() => audio?.playHover()}
                    >
                        <BookOpen size={24} className="text-emerald-400 group-hover:text-emerald-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};
