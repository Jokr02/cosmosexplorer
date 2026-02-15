import { useState, useEffect } from 'react';

export const CockpitOverlay = () => {
    const [fuelDigits, setFuelDigits] = useState('87.3');
    const [engTemp, setEngTemp] = useState('2847');

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate fluctuating readings
            const fuel = (85 + Math.random() * 5).toFixed(1);
            const temp = Math.floor(2800 + Math.random() * 100).toString();
            setFuelDigits(fuel);
            setEngTemp(temp);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-40">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black via-black/80 to-transparent border-b border-cyan-900/30"></div>

            {/* Bottom Dashboard */}
            <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-gray-900 via-black/90 to-transparent border-t border-cyan-900/50 flex justify-between items-end px-12 pb-6">
                {/* Left Instruments */}
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                        <div className="text-cyan-500 text-xs tracking-widest w-14">THRUST</div>
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 gauge-thrust rounded-full" />
                        </div>
                        <span className="text-cyan-400 text-xs font-mono w-8">72%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="text-cyan-500 text-xs tracking-widest w-14">SHIELD</div>
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 gauge-shield rounded-full" />
                        </div>
                        <span className="text-emerald-400 text-xs font-mono w-8">98%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="text-cyan-500 text-xs tracking-widest w-14">FUEL</div>
                        <div className="text-amber-400 font-mono text-sm number-tick">{fuelDigits}%</div>
                    </div>
                </div>

                {/* Center Console — Radar */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative w-16 h-16">
                        {/* Radar Background */}
                        <div className="absolute inset-0 rounded-full border border-cyan-900/40 bg-black/40" />
                        <div className="absolute inset-2 rounded-full border border-cyan-900/20" />
                        <div className="absolute inset-4 rounded-full border border-cyan-900/10" />
                        {/* Radar cross lines */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-900/20" />
                        <div className="absolute top-0 left-1/2 w-px h-full bg-cyan-900/20" />
                        {/* Sweep */}
                        <div
                            className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left radar-sweep"
                            style={{
                                background: 'linear-gradient(90deg, rgba(6,182,212,0.6) 0%, transparent 100%)',
                                boxShadow: '0 0 4px rgba(6,182,212,0.3)',
                            }}
                        />
                        {/* Center dot */}
                        <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full" />
                    </div>
                    <div className="w-1/3 h-px bg-cyan-500/30" />
                </div>

                {/* Right Instruments */}
                <div className="text-right">
                    <div className="text-cyan-400 font-mono text-xl flex items-center gap-2 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 led-active" />
                        SYS.NORMAL
                    </div>
                    <div className="text-cyan-700 text-xs mt-1">NO TARGET LOCKED</div>
                    <div className="text-amber-500/60 text-[10px] font-mono mt-2 number-tick">
                        ENG.TEMP: {engTemp}K
                    </div>
                </div>
            </div>

            {/* Left Pillar */}
            <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-black via-black/50 to-transparent border-r border-cyan-900/30" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%, 0 100%)' }}></div>

            {/* Right Pillar */}
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black via-black/50 to-transparent border-l border-cyan-900/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>

            {/* Subtle Glass Reflection */}
            <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay opacity-30 pointer-events-none"></div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,black_100%)] opacity-60"></div>

            {/* Edge glow */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent breathe-border" />
        </div>
    );
};
