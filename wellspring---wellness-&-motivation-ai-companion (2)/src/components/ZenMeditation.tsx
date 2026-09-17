import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Wind, Volume2 } from 'lucide-react';

interface ZenMeditationProps {
  onShowToast: (msg: string) => void;
}

export const ZenMeditation: React.FC<ZenMeditationProps> = ({ onShowToast }) => {
  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Ready' | 'Inhale...' | 'Hold...' | 'Exhale...' | 'Rest...'>('Ready');

  // Audio tone state
  const [frequency, setFrequency] = useState<number>(528);
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [toneStatus, setToneStatus] = useState<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Breathing interval
  useEffect(() => {
    let interval: any = null;
    if (isBreathing) {
      const phases: ('Inhale...' | 'Hold...' | 'Exhale...' | 'Rest...')[] = [
        'Inhale...',
        'Hold...',
        'Exhale...',
        'Rest...',
      ];
      let idx = 0;
      setBreathPhase(phases[0]);

      interval = setInterval(() => {
        idx = (idx + 1) % phases.length;
        setBreathPhase(phases[idx]);
      }, 3000);
    } else {
      setBreathPhase('Ready');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing]);

  // Audio Tone Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSineWave();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const toggleBreathing = () => {
    setIsBreathing((prev) => !prev);
    if (!isBreathing) {
      onShowToast('Zen breathing started 🧘');
    }
  };

  const startSineWave = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        setToneStatus('Web Audio API is not supported in this browser.');
        return;
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

      // Keep safe, comforting low volume
      gain.gain.setValueAtTime(0.035, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingTone(true);
      setToneStatus(`Playing ${frequency} Hz pure harmonic sine wave at gentle volume.`);
      onShowToast(`${frequency} Hz tone started 🎵`);
    } catch (err) {
      console.error(err);
      setToneStatus('Could not start sound tone.');
    }
  };

  const stopSineWave = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch (e) {}
      gainRef.current = null;
    }
    setIsPlayingTone(false);
    setToneStatus('Tone paused.');
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFrequency(val);

    if (isPlayingTone && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.03);
      setToneStatus(`Playing ${val} Hz tone.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-10 border border-white/50 dark:border-white/15 shadow-xl shadow-sky-950/15 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#14395b] dark:text-sky-100 mb-2 flex items-center justify-center gap-2">
          <Wind className="w-6 h-6 text-[#1a446c] dark:text-sky-300" />
          <span>Guided Zen Mode</span>
        </h2>
        <p className="text-sm text-[#204972]/90 dark:text-sky-200/80 max-w-md mx-auto mb-8">
          Follow the expanding rhythm to center your nervous system, or tune into the 528 Hz miracle frequency for calm.
        </p>

        {/* Breathing Circle */}
        <div className="flex justify-center items-center my-6">
          <div
            id="animeCircle"
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-400 text-white font-bold text-xl sm:text-2xl shadow-2xl shadow-sky-500/40 transition-transform duration-1000 select-none ${
              isBreathing ? 'animate-breathe' : ''
            }`}
          >
            <span id="breathingText">{breathPhase}</span>
          </div>
        </div>

        {/* Start/Stop Breathing Button */}
        <button
          id="startMeditation"
          type="button"
          onClick={toggleBreathing}
          className={`px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-lg cursor-pointer ${
            isBreathing
              ? 'bg-[#14395b] text-white hover:bg-[#1a456e]'
              : 'bg-sky-100/90 dark:bg-sky-100 hover:bg-white text-[#133557] hover:scale-105 shadow-sky-950/15'
          }`}
        >
          {isBreathing ? 'Stop Zen' : 'Start Zen'}
        </button>

        {/* 528 Hz Harmonic Frequency Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white/40 dark:bg-sky-950/50 border border-white/40 dark:border-white/10 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-200/60 dark:bg-sky-900/60 text-[#14395b] dark:text-sky-200 font-bold text-xs mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Harmonic Sound Therapy</span>
          </div>

          <h3 className="text-lg font-bold text-[#14395b] dark:text-sky-100 font-serif">
            🎵 528 Hz Solfeggio Sine Wave
          </h3>
          <p className="text-xs text-[#204972]/85 dark:text-sky-200/80 mt-1 mb-4">
            528 Hz is renowned as the transformational "Love Frequency". Kept at an ultra-low, peaceful volume.
          </p>

          <div className="text-3xl font-extrabold text-[#14395b] dark:text-sky-200 font-serif my-2">
            <span id="frequencyDisplay">{frequency}</span> Hz
          </div>

          {/* Slider */}
          <div className="px-4 py-2">
            <input
              id="frequencyRange"
              type="range"
              min={100}
              max={1000}
              step={1}
              value={frequency}
              onChange={handleFrequencyChange}
              className="w-full accent-[#1a4b77] h-2 bg-sky-200 dark:bg-sky-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#204972]/70 dark:text-sky-300/70 mt-1 font-medium">
              <span>100 Hz (Deep Bass)</span>
              <span>528 Hz (Default)</span>
              <span>1000 Hz (High)</span>
            </div>
          </div>

          {/* Tone Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              id="sineWaveBtn"
              type="button"
              onClick={isPlayingTone ? stopSineWave : startSineWave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                isPlayingTone
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-sky-100/90 dark:bg-sky-100 hover:bg-white text-[#133557] hover:scale-105 shadow-sm'
              }`}
            >
              {isPlayingTone ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlayingTone ? 'Stop Tone' : `▶ Start ${frequency} Hz`}</span>
            </button>
          </div>

          {toneStatus && (
            <p id="frequencyStatus" className="text-xs font-semibold text-[#1a4b77] dark:text-sky-300 mt-3">
              {toneStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
