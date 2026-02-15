import { useState, useEffect } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [phase, setPhase] = useState<'LOADING' | 'FADING' | 'DONE'>('LOADING');
    const title = 'COSMOS EXPLORER';
    const [statusText, setStatusText] = useState('INITIALIZING SYSTEMS');

    useEffect(() => {
        console.log('LoadingScreen MOUNTED');
        const statuses = [
            'INITIALIZING SYSTEMS',
            'CALIBRATING SENSORS',
            'LOADING STAR CHARTS',
            'ACTIVATING WARP DRIVE',
            'SYSTEMS ONLINE'
        ];

        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            if (idx < statuses.length) {
                setStatusText(statuses[idx]);
            }
        }, 500);

        const fadeTimer = setTimeout(() => {
            setPhase('FADING');
        }, 2800);

        const doneTimer = setTimeout(() => {
            setPhase('DONE');
            onComplete();
        }, 3500);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [onComplete]);

    if (phase === 'DONE') return null;

    return (
        <div
            className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${phase === 'FADING' ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Logo */}
            <div className="flex gap-1 mb-8">
                {title.split('').map((letter, i) => (
                    <span
                        key={i}
                        className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600"
                        style={{
                            animation: `logo-letter 0.5s ease-out ${i * 0.08}s forwards`,
                            opacity: 0,
                        }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}
            </div>

            {/* Subtitle */}
            <div
                className="text-cyan-700 text-xs tracking-[0.5em] uppercase mb-12"
                style={{
                    animation: 'logo-letter 0.5s ease-out 1.2s forwards',
                    opacity: 0,
                }}
            >
                DEEP SPACE NAVIGATION SYSTEM v2.1
            </div>

            {/* Progress bar */}
            <div className="w-80 md:w-96 relative">
                <div className="h-px bg-cyan-900/50 w-full" />
                <div
                    className="h-px bg-gradient-to-r from-cyan-500 to-blue-500 loading-progress-bar absolute top-0 left-0"
                    style={{ boxShadow: '0 0 10px rgba(6,182,212,0.5)' }}
                />
            </div>

            {/* Status text */}
            <div className="mt-6 text-cyan-600 text-xs tracking-[0.3em] font-mono status-pulse">
                {statusText}...
            </div>

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-cyan-800/50" />
            <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-cyan-800/50" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-cyan-800/50" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-cyan-800/50" />

            {/* Version */}
            <div className="absolute bottom-6 text-cyan-900 text-[10px] tracking-widest">
                CLEARANCE LEVEL: COMMANDER
            </div>
        </div>
    );
};
