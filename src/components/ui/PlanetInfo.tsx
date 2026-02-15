import { useState, useEffect, useCallback } from 'react';
import { X, Info, Shield, Thermometer, Globe2, Orbit } from 'lucide-react';
import type { AudioControls } from '../../hooks/useAudio';

interface PlanetInfoProps {
    planet: {
        name: string;
        description?: string;
        distance: number;
        distanceRange?: string;
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
        isMoon?: boolean;
        type?: string;
        parentName?: string;
        mass?: string;
        size?: number;
        age?: string;
        spectralType?: string;
    } | null;
    onClose: () => void;
    onDetailsClick?: () => void;
    isDetailedView?: boolean;
    onViewMoons?: () => void;
    viewingMoons?: boolean;
    audio?: AudioControls;
}

// Parse temperature string to number for habitability
function parseTempC(temp?: string): number | null {
    if (!temp) return null;
    const match = temp.match(/-?\d+/);
    return match ? parseInt(match[0]) : null;
}

function getHabitability(temp?: string): { label: string; color: string; bg: string } {
    const t = parseTempC(temp);
    if (t === null) return { label: 'UNKNOWN', color: 'text-gray-400', bg: 'bg-gray-600' };
    if (t >= -20 && t <= 50) return { label: 'HABITABLE', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (t >= -60 && t <= 80) return { label: 'MARGINAL', color: 'text-amber-400', bg: 'bg-amber-500' };
    return { label: 'HOSTILE', color: 'text-red-400', bg: 'bg-red-500' };
}

// Earth reference values
const EARTH = { gravity: 9.81, orbitalPeriod: 365.25, size: 1.6 };

function parseGravity(g?: string): number | null {
    if (!g) return null;
    const match = g.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
}

export const PlanetInfo = ({ planet, onClose, onDetailsClick, isDetailedView, onViewMoons, viewingMoons, audio }: PlanetInfoProps) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPOSITION' | 'TRIVIA'>('OVERVIEW');
    const [scanProgress, setScanProgress] = useState(0);
    const [isScanning, setIsScanning] = useState(false);

    // Play open sound on mount
    useEffect(() => {
        if (planet) {
            audio?.playPanelOpen();
        }
    }, [planet?.name]);

    // Reset scan state when planet changes
    useEffect(() => {

        setScanProgress(0);
        setIsScanning(false);
        setActiveTab('OVERVIEW');
    }, [planet?.name]);

    const handleClose = useCallback(() => {
        audio?.playPanelClose();
        onClose();
    }, [audio, onClose]);

    const handleScan = useCallback(() => {
        if (isScanning) return;
        setIsScanning(true);
        audio?.playScan();

        // Animate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);

                setIsScanning(false);
                onDetailsClick?.();
            }
        }, 25);
    }, [isScanning, audio, onDetailsClick]);

    const handleTabChange = useCallback((tab: 'OVERVIEW' | 'COMPOSITION' | 'TRIVIA') => {
        setActiveTab(tab);
        audio?.playClick();
    }, [audio]);

    if (!planet) return null;

    const habitability = getHabitability(planet.temp);
    const gravityRatio = parseGravity(planet.details?.gravity);
    const earthGravityMultiple = gravityRatio ? (gravityRatio / EARTH.gravity).toFixed(2) : null;

    return (
        <div className={`absolute top-4 bottom-4 right-0 mr-12 z-50 animate-slide-in-right flex items-center ${isDetailedView || planet.isMoon ? 'w-[600px]' : 'w-96'}`}>
            <div className={`bg-black/85 backdrop-blur-xl border-l-2 border-cyan-500 p-8 text-cyan-100 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 flex flex-col scanlines max-h-full overflow-y-auto custom-scrollbar w-full ${isDetailedView || planet.isMoon ? 'min-h-[550px]' : ''}`}>
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-cyan-500 hover:text-white transition-all duration-300 z-10 hover:rotate-90"
                    onMouseEnter={() => audio?.playHover()}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Planet/Moon Name */}
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1 pb-2 leading-tight">{planet.name}</h2>
                {planet.isMoon && planet.parentName && (
                    <div className="text-xs text-cyan-600 tracking-widest mb-2 flex items-center gap-1">
                        <Orbit size={10} />
                        Moon of {planet.parentName}
                    </div>
                )}
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-transparent mb-4"></div>

                {/* Habitability Badge / Type Badge */}
                <div className="flex items-center gap-2 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {planet.type === 'Comet' ? (
                        <>
                            <div className="w-2 h-2 rounded-full bg-blue-300 led-active" />
                            <span className="text-xs font-bold tracking-widest uppercase text-blue-300">
                                COMETARY BODY
                            </span>
                        </>
                    ) : planet.type === 'Star' ? (
                        <>
                            <div className="w-2 h-2 rounded-full bg-yellow-400 led-active" />
                            <span className="text-xs font-bold tracking-widest uppercase text-yellow-500">
                                STAR
                            </span>
                        </>
                    ) : (
                        <>
                            <div className={`w-2 h-2 rounded-full ${habitability.bg} ${habitability.label === 'HABITABLE' ? 'led-active' : ''}`} />
                            <span className={`text-xs font-bold tracking-widest uppercase ${habitability.color}`}>
                                {habitability.label}
                            </span>
                        </>
                    )}
                    {planet.temp && (
                        <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                            <Thermometer size={10} />
                            {planet.temp}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-300 mb-6 font-light border-l border-cyan-900/50 pl-4">
                    {planet.description}
                </p>

                {isDetailedView ? (
                    <div className="flex-1 flex flex-col">
                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-cyan-900/50 mb-6">
                            {(['OVERVIEW', 'COMPOSITION', 'TRIVIA'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    onMouseEnter={() => audio?.playHover()}
                                    className={`pb-2 text-sm font-bold tracking-widest transition-all duration-300 ${activeTab === tab
                                        ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-[0_2px_10px_rgba(6,182,212,0.3)]'
                                        : 'text-gray-500 hover:text-cyan-300'
                                        }`}
                                >
                                    {tab === 'OVERVIEW' ? 'PHYSICAL' : tab === 'TRIVIA' ? 'INTEL' : tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {activeTab === 'OVERVIEW' && (
                                <div className="space-y-3 animate-slide-up">
                                    {planet.type !== 'Star' && (
                                        <StatBar
                                            icon={<Globe2 size={14} />}
                                            label="Distance"
                                            value={planet.isMoon ? `${planet.distance} ×10³ KM` : `${planet.distance} AU`}
                                            delay={0}
                                        />
                                    )}
                                    <StatBar
                                        icon={<Thermometer size={14} />}
                                        label="Avg Temp"
                                        value={planet.temp || 'N/A'}
                                        delay={0.1}
                                    />
                                    {planet.type === 'Star' ? (
                                        <>
                                            <StatBar
                                                icon={<Shield size={14} />}
                                                label="Mass"
                                                value={planet.mass || 'N/A'}
                                                delay={0.2}
                                            />
                                            <StatBar
                                                icon={<Orbit size={14} />}
                                                label="Size Index"
                                                value={planet.size ? `${planet.size}` : 'N/A'}
                                                delay={0.3}
                                            />
                                            <StatBar
                                                icon={<Globe2 size={14} />}
                                                label="Spectral Type"
                                                value={planet.spectralType || 'Unknown'}
                                                delay={0.4}
                                            />
                                            <StatBar
                                                label="Age"
                                                value={planet.age || 'Unknown'}
                                                delay={0.5}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StatBar
                                                icon={<Shield size={14} />}
                                                label="Gravity"
                                                value={planet.details?.gravity || 'N/A'}
                                                earthComparison={earthGravityMultiple ? `${earthGravityMultiple}× Earth` : undefined}
                                                delay={0.2}
                                            />
                                            <StatBar
                                                icon={<Orbit size={14} />}
                                                label="Orbit Period"
                                                value={planet.details?.orbitalPeriod || 'N/A'}
                                                delay={0.3}
                                            />
                                            {planet.type !== 'Comet' && !planet.isMoon && (
                                                <StatBar
                                                    label="Moons"
                                                    value={planet.details?.moons?.toString() || '0'}
                                                    delay={0.4}
                                                />
                                            )}
                                            <StatBar
                                                label="Day Length"
                                                value={planet.details?.dayLength || 'Unknown'}
                                                delay={0.5}
                                            />
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === 'COMPOSITION' && (
                                <div className="space-y-6 animate-slide-up">
                                    {planet.composition && (
                                        <div>
                                            <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <div className="w-1 h-3 bg-cyan-500 rounded-full" />
                                                Surface
                                            </h3>
                                            <div className="space-y-2">
                                                {Object.entries(planet.composition).map(([key, value], i) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between items-center bg-cyan-900/10 px-3 py-2 rounded border border-cyan-900/30 hover:border-cyan-700/50 transition-all duration-300"
                                                        style={{ animationDelay: `${i * 0.1}s` }}
                                                    >
                                                        <span className="text-gray-300 text-sm">{key}</span>
                                                        <span className="font-mono text-cyan-400 text-sm">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {planet.atmosphere && (
                                        <div>
                                            <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <div className="w-1 h-3 bg-blue-500 rounded-full" />
                                                Atmosphere
                                            </h3>
                                            <div className="space-y-2">
                                                {Object.entries(planet.atmosphere).map(([key, value], i) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between items-center bg-cyan-900/10 px-3 py-2 rounded border border-cyan-900/30 hover:border-cyan-700/50 transition-all duration-300"
                                                        style={{ animationDelay: `${i * 0.1}s` }}
                                                    >
                                                        <span className="text-gray-300 text-sm">{key}</span>
                                                        <span className="font-mono text-cyan-400 text-sm">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'TRIVIA' && (
                                <div className="space-y-4 animate-slide-up">
                                    {planet.details?.facts.map((fact, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-4 p-4 bg-cyan-900/20 border-l-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 hover:bg-cyan-900/30"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        >
                                            <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                                            <p className="text-gray-300 text-sm italic">"{fact}"</p>
                                        </div>
                                    ))}
                                    {(!planet.details?.facts || planet.details.facts.length === 0) && (
                                        <p className="text-gray-500 italic">No intelligence data available.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Basic Stats (Summary) */
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {planet.type === 'Star' ? (
                            <>
                                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="text-xs tracking-widest text-cyan-600 mb-1">MASS</div>
                                    <div className="text-2xl font-mono text-white">{planet.mass || 'N/A'}</div>
                                </div>
                                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="text-xs tracking-widest text-cyan-600 mb-1">TEMP</div>
                                    <div className="text-2xl font-mono text-white">{planet.temp || 'N/A'}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="text-xs tracking-widest text-cyan-600 mb-1">DISTANCE</div>
                                    <div className="text-2xl font-mono text-white">
                                        {planet.distanceRange ? planet.distanceRange : (planet.isMoon ? `${planet.distance} ×10³ KM` : `${planet.distance} AU`)}
                                    </div>
                                </div>
                                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="text-xs tracking-widest text-cyan-600 mb-1">TEMP</div>
                                    <div className="text-2xl font-mono text-white">{planet.temp || 'N/A'}</div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Scan Progress Bar */}
                {isScanning && (
                    <div className="mt-4 mb-2">
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-100"
                                style={{ width: `${scanProgress}%`, boxShadow: '0 0 10px rgba(6,182,212,0.5)' }}
                            />
                        </div>
                        <div className="text-[10px] text-cyan-600 tracking-widest mt-1 typewriter-cursor inline-block">
                            SCANNING... {scanProgress}%
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-4 border-t border-cyan-900/30">
                    {!isDetailedView && onDetailsClick && !planet.isMoon && planet.type !== 'Comet' && (
                        <button
                            onClick={handleScan}
                            onMouseEnter={() => audio?.playHover()}
                            className={`flex-1 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 text-cyan-300 text-sm uppercase font-bold tracking-widest hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] ${isScanning ? 'animate-pulse pointer-events-none' : ''}`}
                        >
                            {isScanning ? 'Scanning...' : 'Initialize Scan'}
                        </button>
                    )}
                    {onViewMoons && planet.details && planet.details.moons > 0 && (
                        <button
                            onClick={() => { onViewMoons(); audio?.playClick(); }}
                            onMouseEnter={() => audio?.playHover()}
                            className={`flex-1 py-3 ${viewingMoons ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-cyan-900/30 hover:bg-cyan-900/50 border-cyan-500/30 hover:border-cyan-400 text-cyan-300'} border transition-all duration-300 text-sm uppercase font-bold tracking-widest`}
                        >
                            {viewingMoons ? 'Exit Top Down' : 'Top Down View'}
                        </button>
                    )}
                    <button
                        onClick={handleClose}
                        onMouseEnter={() => audio?.playHover()}
                        className="flex-1 py-3 border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 text-cyan-400 tracking-widest text-sm uppercase font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    >
                        {planet.type === 'Comet' || planet.type === 'Star' ? 'Resume Mission' : (planet.isMoon ? 'Back to Planet' : 'Resume Mission')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatBar = ({ icon, label, value, earthComparison, delay = 0 }: { icon?: React.ReactNode; label: string; value: string; earthComparison?: string; delay?: number }) => (
    <div
        className="bg-cyan-900/10 p-3 rounded border border-cyan-900/30 hover:border-cyan-700/40 transition-all duration-300"
        style={{ animation: `slide-up 0.4s ease-out ${delay}s forwards`, opacity: 0 }}
    >
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {icon && <span className="text-cyan-600">{icon}</span>}
                <span className="text-[10px] uppercase tracking-widest text-cyan-600">{label}</span>
            </div>
            <div className="text-right">
                <span className="text-lg font-mono text-white">{value}</span>
                {earthComparison && (
                    <span className="text-[10px] text-cyan-500 ml-2">({earthComparison})</span>
                )}
            </div>
        </div>
    </div>
);
