import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Headphones, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface VoiceMeditationProps {
  user: UserProfile | null;
  onShowToast: (msg: string) => void;
}

export const VoiceMeditation: React.FC<VoiceMeditationProps> = ({ user, onShowToast }) => {
  const [topic, setTopic] = useState('Deep Calm and Anxiety Relief');
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerate = async () => {
    const selectedTopic = topic === 'custom' ? customTopic : topic;
    if (!selectedTopic.trim()) {
      onShowToast('Please specify a meditation theme');
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }

    setLoading(true);
    try {
      const res = await fetch('/api/meditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic, userName: user?.name }),
      });

      let textScript = '';
      if (res.ok) {
        const data = await res.json();
        textScript = data.script;
      }
      
      if (!textScript) {
        textScript = `Welcome to this quiet moment, ${user?.name || 'my friend'}... Gently let your shoulders drop, unclench your jaw, and breathe deeply into your belly... Inhale peaceful calm... and exhale all lingering hurry or stress... You are doing your best, and that is more than enough... Feel grounded, safe, and at ease...`;
      }

      setScript(textScript);
      onShowToast('Personalized meditation ready 🎙️');
      startVoicePlayback(textScript);
    } catch (err) {
      console.error(err);
      const fallbackScript = `Take a gentle, slow breath in, ${user?.name || 'my friend'}... and softly release it all the way out... Allow your body to settle into complete relaxation... You are safe, supported, and at peace...`;
      setScript(fallbackScript);
      onShowToast('Personalized meditation ready 🎙️');
      startVoicePlayback(fallbackScript);
    } finally {
      setLoading(false);
    }
  };

  const startVoicePlayback = (textToPlay: string) => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Audio playback not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToPlay.replace(/\.{3,}/g, ', ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.82; // Calm, meditative pace
    utterance.pitch = 0.98;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const togglePlayback = () => {
    if (!script) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        startVoicePlayback(script);
      }
    }
  };

  const restartPlayback = () => {
    if (!script) return;
    startVoicePlayback(script);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-white/15 shadow-xl shadow-sky-950/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-[#143d66] dark:text-sky-200">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#14395b] dark:text-sky-100">
              AI Voice Guided Meditation
            </h2>
            <p className="text-xs sm:text-sm text-[#204972]/85 dark:text-sky-200/80">
              Listen to personalized, slow-paced affirmations and breath guidance crafted live by Gemini.
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="meditationTopic" className="block text-sm font-bold text-[#14395b] dark:text-sky-200 mb-1.5">
              Select Meditation Focus
            </label>
            <select
              id="meditationTopic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white/60 dark:bg-sky-950/60 border border-white/50 dark:border-white/20 text-[#14395b] dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium cursor-pointer"
            >
              <option value="Deep Calm and Anxiety Relief">Deep Calm & Anxiety Relief</option>
              <option value="Exam & Work Stress Release">Exam & Work Stress Release</option>
              <option value="Bedtime Sleep Wind-Down">Bedtime Sleep Wind-Down</option>
              <option value="Morning Self-Love & Confidence">Morning Self-Love & Confidence</option>
              <option value="custom">Custom Theme...</option>
            </select>
          </div>

          {topic === 'custom' && (
            <div>
              <label htmlFor="customTopic" className="block text-sm font-bold text-[#14395b] dark:text-sky-200 mb-1.5">
                Your Custom Focus Theme
              </label>
              <input
                id="customTopic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., Preparing for an interview, letting go of resentment..."
                className="w-full p-3.5 rounded-2xl bg-white/60 dark:bg-sky-950/60 border border-white/50 dark:border-white/20 text-[#14395b] dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          )}

          <button
            id="generateTtsBtn"
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-sky-100/90 dark:bg-sky-100 hover:bg-white disabled:opacity-50 text-[#133557] font-bold transition-all shadow-md shadow-sky-950/15 cursor-pointer hover:scale-105"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Writing Calming Words...</span>
              </>
            ) : (
              <>
                <Headphones className="w-4 h-4" />
                <span>🎙️ Generate Spoken Meditation</span>
              </>
            )}
          </button>
        </div>

        {/* Audio Player & Script Card */}
        {script && (
          <div
            id="audioPlayerContainer"
            className="mt-6 p-5 sm:p-6 rounded-2xl bg-white/50 dark:bg-sky-950/60 border border-white/50 dark:border-white/10 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#1a4b77] dark:text-sky-300 font-bold">
                  Active Session
                </span>
                <p id="audioStatusText" className="text-base font-bold text-[#14395b] dark:text-sky-100 font-serif">
                  {topic === 'custom' ? customTopic : topic}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayback}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-sm transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play Voice'}</span>
                </button>

                <button
                  onClick={restartPlayback}
                  title="Replay from beginning"
                  className="p-2 rounded-full bg-white dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-rose-200 dark:border-slate-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Script Viewer */}
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-slate-800 max-h-48 overflow-y-auto">
              <p className="text-xs font-semibold text-slate-400 mb-1">Meditation Script:</p>
              <p
                id="ttsScriptPreview"
                className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed italic whitespace-pre-wrap"
              >
                "{script}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
