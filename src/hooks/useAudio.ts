import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * Generative audio hook using Web Audio API.
 * All sounds are synthesized — no external audio files needed.
 */

interface AudioEngine {
    ctx: AudioContext;
    masterGain: GainNode;
    ambientGain: GainNode;
    ambientOscs: OscillatorNode[];
    ambientLFOs: OscillatorNode[];
    isAmbientPlaying: boolean;
}

export function useAudio() {
    const engineRef = useRef<AudioEngine | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.5);

    // Lazy-init AudioContext (must be triggered by user gesture)
    const getEngine = useCallback((): AudioEngine => {
        if (engineRef.current) return engineRef.current;

        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(ctx.destination);

        const ambientGain = ctx.createGain();
        ambientGain.gain.value = 0;
        ambientGain.connect(masterGain);

        engineRef.current = {
            ctx,
            masterGain,
            ambientGain,
            ambientOscs: [],
            ambientLFOs: [],
            isAmbientPlaying: false,
        };

        return engineRef.current;
    }, []);

    // Resume context if suspended (browser autoplay policy)
    const ensureRunning = useCallback(async () => {
        const engine = getEngine();
        if (engine.ctx.state === 'suspended') {
            await engine.ctx.resume();
        }
    }, [getEngine]);

    // ─── AMBIENT SPACE DRONE ────────────────────────────────────────
    const startAmbient = useCallback(async () => {
        await ensureRunning();
        const engine = getEngine();
        if (engine.isAmbientPlaying) return;

        const { ctx, ambientGain } = engine;

        // Deep space drone: layered sine waves with slow LFO modulation
        const frequencies = [55, 82.5, 110, 73.4]; // Low A, E, A octave, D
        const oscs: OscillatorNode[] = [];
        const lfos: OscillatorNode[] = [];

        frequencies.forEach((freq, i) => {
            // Main oscillator
            const osc = ctx.createOscillator();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;

            // Individual gain for this voice
            const voiceGain = ctx.createGain();
            voiceGain.gain.value = 0.08 / (i + 1); // Progressively quieter

            // Low-pass filter for warmth
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200 + i * 50;
            filter.Q.value = 1;

            // LFO for subtle pitch wobble
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.05 + i * 0.02; // Very slow modulation
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 1.5; // ±1.5 Hz wobble

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.connect(filter);
            filter.connect(voiceGain);
            voiceGain.connect(ambientGain);

            osc.start();
            lfo.start();
            oscs.push(osc);
            lfos.push(lfo);
        });

        // Fade in
        ambientGain.gain.setValueAtTime(0, ctx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);

        engine.ambientOscs = oscs;
        engine.ambientLFOs = lfos;
        engine.isAmbientPlaying = true;
    }, [ensureRunning, getEngine]);

    const stopAmbient = useCallback(() => {
        const engine = engineRef.current;
        if (!engine || !engine.isAmbientPlaying) return;

        const { ctx, ambientGain } = engine;

        // Fade out
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

        // Stop oscillators after fade
        setTimeout(() => {
            engine.ambientOscs.forEach(o => { try { o.stop(); } catch { } });
            engine.ambientLFOs.forEach(o => { try { o.stop(); } catch { } });
            engine.ambientOscs = [];
            engine.ambientLFOs = [];
            engine.isAmbientPlaying = false;
        }, 2200);
    }, []);

    const toggleAmbient = useCallback(async () => {
        const engine = engineRef.current;
        if (engine?.isAmbientPlaying) {
            stopAmbient();
        } else {
            await startAmbient();
        }
    }, [startAmbient, stopAmbient]);

    // ─── UI CLICK SOUND ─────────────────────────────────────────────
    const playClick = useCallback(async () => {
        await ensureRunning();
        const { ctx, masterGain } = getEngine();

        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 1800;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    }, [ensureRunning, getEngine]);

    // ─── PANEL OPEN SOUND ───────────────────────────────────────────
    const playPanelOpen = useCallback(async () => {
        await ensureRunning();
        const { ctx, masterGain } = getEngine();

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }, [ensureRunning, getEngine]);

    // ─── PANEL CLOSE SOUND ──────────────────────────────────────────
    const playPanelClose = useCallback(async () => {
        await ensureRunning();
        const { ctx, masterGain } = getEngine();

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    }, [ensureRunning, getEngine]);

    // ─── SCAN SOUND ─────────────────────────────────────────────────
    const playScan = useCallback(async () => {
        await ensureRunning();
        const { ctx, masterGain } = getEngine();

        // Layer 1: Frequency sweep
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(100, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 1.2);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 1.2);
        filter.Q.value = 5;

        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0.06, ctx.currentTime);
        gain1.gain.setValueAtTime(0.06, ctx.currentTime + 0.8);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc1.connect(filter);
        filter.connect(gain1);
        gain1.connect(masterGain);

        // Layer 2: Beep pulses
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 1200;

        const lfo = ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 8; // 8 Hz pulsing

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.04;

        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.04, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        lfo.connect(lfoGain);
        osc2.connect(gain2);
        lfoGain.connect(gain2.gain);
        gain2.connect(masterGain);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.5);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 1.5);
        lfo.start(ctx.currentTime);
        lfo.stop(ctx.currentTime + 1.5);
    }, [ensureRunning, getEngine]);

    // ─── WARP DRIVE SOUND ───────────────────────────────────────────
    const playWarp = useCallback(async () => {
        await ensureRunning();
        const { ctx, masterGain } = getEngine();

        // Phase 1: Charging (0–0.5s) — rising whine (Lower pitch, lower volume)
        const charge = ctx.createOscillator();
        charge.type = 'sawtooth';
        charge.frequency.setValueAtTime(60, ctx.currentTime); // Lower start
        charge.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.5); // Lower end pitch (was 400)

        const chargeFilter = ctx.createBiquadFilter();
        chargeFilter.type = 'lowpass';
        chargeFilter.frequency.setValueAtTime(150, ctx.currentTime);
        chargeFilter.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.5); // Smoother filter sweep

        const chargeGain = ctx.createGain();
        chargeGain.gain.setValueAtTime(0.0, ctx.currentTime);
        chargeGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.4); // Reduced volume (was 0.12)
        chargeGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.5);

        charge.connect(chargeFilter);
        chargeFilter.connect(chargeGain);
        chargeGain.connect(masterGain);

        charge.start(ctx.currentTime);
        charge.stop(ctx.currentTime + 0.6);

        // Phase 2: Warp sustained (0.5–2.5s) — deep rumble + high tone
        const rumble = ctx.createOscillator();
        rumble.type = 'sawtooth';
        rumble.frequency.value = 35; // Deeper rumble

        const rumbleFilter = ctx.createBiquadFilter();
        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.value = 100;

        const rumbleGain = ctx.createGain();
        rumbleGain.gain.setValueAtTime(0, ctx.currentTime + 0.5);
        rumbleGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.8); // Reduced volume (was 0.15)
        rumbleGain.gain.setValueAtTime(0.12, ctx.currentTime + 2.5);
        rumbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.5);

        rumble.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(masterGain);

        // High tone - Reduced significantly to reduce ear stress
        const highTone = ctx.createOscillator();
        highTone.type = 'sine';
        highTone.frequency.value = 440; // Lower pitch (was 880)

        const highGain = ctx.createGain();
        highGain.gain.setValueAtTime(0, ctx.currentTime + 0.5);
        highGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.8); // Much quieter (was 0.04)
        highGain.gain.setValueAtTime(0.02, ctx.currentTime + 2.5);
        highGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.5);

        highTone.connect(highGain);
        highGain.connect(masterGain);

        rumble.start(ctx.currentTime + 0.5);
        rumble.stop(ctx.currentTime + 3.6);
        highTone.start(ctx.currentTime + 0.5);
        highTone.stop(ctx.currentTime + 3.6);

        // Phase 3: Arrival boom (3s) — short thump
        const boom = ctx.createOscillator();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(60, ctx.currentTime + 3.0);
        boom.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 3.5); // Deeper drop

        const boomGain = ctx.createGain();
        boomGain.gain.setValueAtTime(0, ctx.currentTime + 2.9);
        boomGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3.05); // Slightly quieter (was 0.2)
        boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

        boom.connect(boomGain);
        boomGain.connect(masterGain);

        boom.start(ctx.currentTime + 2.9);
        boom.stop(ctx.currentTime + 4.0);
    }, [ensureRunning, getEngine]);

    // ─── HOVER SOUND ────────────────────────────────────────────────
    const playHover = useCallback(async () => {
        await ensureRunning();
        const { ctx, masterGain } = getEngine();

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 2400;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
    }, [ensureRunning, getEngine]);

    // ─── VOLUME CONTROL ─────────────────────────────────────────────
    const setVolume = useCallback((v: number) => {
        setVolumeState(v);
        const engine = engineRef.current;
        if (engine) {
            engine.masterGain.gain.setValueAtTime(v, engine.ctx.currentTime);
        }
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            const engine = engineRef.current;
            if (engine) {
                engine.masterGain.gain.setValueAtTime(next ? 0 : volume, engine.ctx.currentTime);
            }
            return next;
        });
    }, [volume]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const engine = engineRef.current;
            if (engine) {
                engine.ambientOscs.forEach(o => { try { o.stop(); } catch { } });
                engine.ambientLFOs.forEach(o => { try { o.stop(); } catch { } });
                engine.ctx.close();
            }
        };
    }, []);

    return {
        playClick,
        playHover,
        playPanelOpen,
        playPanelClose,
        playScan,
        playWarp,
        startAmbient,
        stopAmbient,
        toggleAmbient,
        setVolume,
        toggleMute,
        isMuted,
        volume,
    };
}

export type AudioControls = ReturnType<typeof useAudio>;
