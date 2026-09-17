import React, { useState, useEffect } from 'react';
import { PageId, UserProfile, DailyExercise } from '../types';
import { Sparkles, CheckCircle2, MessageSquareHeart, Wind, BookOpen, Headphones, Calendar } from 'lucide-react';

interface DailyDashboardProps {
  user: UserProfile | null;
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

const exercises: DailyExercise[] = [
  {
    id: 'gratitude',
    title: '3-Minute Gratitude Reset',
    desc: 'Pause for three quiet minutes and anchor yourself on small blessings that brought a smile today.',
    steps: [
      'Write down 3 specific things you are genuinely grateful for.',
      'Think of 1 friend or mentor you appreciate and silently send them good wishes.',
      'Take 3 slow, diaphragmatic breaths before continuing your day.',
    ],
  },
  {
    id: 'grounding',
    title: '5-Minute Sensory Grounding (5-4-3-2-1)',
    desc: 'Bring your racing thoughts back to the safe physical space of the present moment.',
    steps: [
      'Acknowledge 5 things you can see around your room.',
      'Notice 4 textures or surfaces you can touch right now.',
      'Listen for 3 distinct sounds in your environment.',
      'Notice 2 scents and 1 taste.',
    ],
  },
  {
    id: 'detox',
    title: 'Digital Screen Detox Pause',
    desc: 'Step away from notification overload and allow your mind to enter a natural resting state.',
    steps: [
      'Put your phone face down or in another room for 10 minutes.',
      'Slowly drink a full glass of cool or warm water.',
      'Gently roll your shoulders and stretch your neck muscles.',
      'Look out of a window at the furthest point on the horizon.',
    ],
  },
  {
    id: 'box-breathing',
    title: 'Calm 4-2-6 Rhythm Breath',
    desc: 'Activate your parasympathetic vagus nerve to lower heart rate and calm racing thoughts.',
    steps: [
      'Inhale gently through your nose for 4 counts.',
      'Hold the air softly in your lungs for 2 counts.',
      'Exhale slowly and completely through your mouth for 6 counts.',
      'Repeat this cycle 5 times with eyes softened.',
    ],
  },
];

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({ user, onNavigate, onShowToast }) => {
  const [completed, setCompleted] = useState(false);
  const todayKey = getTodayKey();

  const dayIndex = Math.floor(new Date().getTime() / 86400000) % exercises.length;
  const currentExercise = exercises[Math.abs(dayIndex)];

  useEffect(() => {
    const savedDate = localStorage.getItem('wellspring_task_date');
    const isComp = localStorage.getItem('wellspring_task_completed') === 'true';
    if (isComp && savedDate === todayKey) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  }, [todayKey]);

  const handleCompleteTask = () => {
    localStorage.setItem('wellspring_task_date', todayKey);
    localStorage.setItem('wellspring_task_completed', 'true');
    setCompleted(true);
    onShowToast('Today’s mental exercise completed! 🌟');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-white/15 shadow-xl shadow-sky-950/15">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#1a446c] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌸 Welcome Back</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#14395b] dark:text-sky-100 mt-1">
              <span id="userName" className="text-[#1b4875] dark:text-sky-200">
                {user?.name || 'Friend'}
              </span>
              , take a deep breath.
            </h1>
            <p className="text-xs sm:text-sm text-[#1e4974]/90 dark:text-sky-200/80 mt-1">
              You are here, you are safe, and every small mindful step counts.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 dark:bg-sky-950/50 border border-white/40 dark:border-white/10 text-[#14395b] dark:text-sky-200 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-[#1a446c] dark:text-sky-300" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Mental Exercise */}
      <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-white/15 shadow-xl shadow-sky-950/15">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#14395b] dark:text-sky-100">
              Today’s Mental Exercise
            </h2>
          </div>

          {completed && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed Today
            </span>
          )}
        </div>

        <h3 id="exerciseTitle" className="text-lg font-bold text-[#1a4b77] dark:text-sky-200 mt-3 font-serif">
          {currentExercise.title}
        </h3>

        <p id="exerciseDescription" className="text-sm text-[#204972]/90 dark:text-sky-200/80 mt-1">
          {currentExercise.desc}
        </p>

        {/* Steps */}
        <ul id="exerciseSteps" className="mt-4 space-y-2.5">
          {currentExercise.steps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 dark:bg-sky-950/50 border border-white/40 dark:border-white/10 text-sm text-[#14395b] dark:text-sky-100"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-200 dark:bg-sky-900 text-[#14395b] dark:text-sky-200 text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>

        {/* Action button */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <button
            id="completeExerciseBtn"
            type="button"
            onClick={handleCompleteTask}
            disabled={completed}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer ${
              completed
                ? 'bg-emerald-600 text-white cursor-default shadow-none'
                : 'bg-sky-100/90 dark:bg-sky-100 hover:bg-white text-[#133557] hover:scale-105'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{completed ? '✓ Completed Today' : 'Mark as Complete ✓'}</span>
          </button>

          {completed && (
            <span id="exerciseStatus" className="text-xs text-[#1e4870]/90 dark:text-sky-200/80 font-medium">
              🎉 Great job investing in your peace! Come back tomorrow for a new activity.
            </span>
          )}
        </div>
      </div>

      {/* Wellness Quick Hub */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#14395b] dark:text-sky-100 mb-3 px-1">
          Wellness Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('chat')}
            className="p-5 rounded-3xl backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 border border-white/50 dark:border-white/15 hover:border-white dark:hover:border-sky-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-md hover:shadow-lg hover:shadow-sky-950/15"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 mb-3">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#14395b] dark:text-sky-100">
              💬 AI Companion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Talk with Gemini about feelings, jokes, motivation, or venting.
            </p>
          </div>

          <div
            onClick={() => onNavigate('meditation')}
            className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-rose-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-600 cursor-pointer transition-all hover:-translate-y-1 shadow-md hover:shadow-lg hover:shadow-rose-100/40"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-500 mb-3">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              🧘 Zen Breathing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guided animated breath cycles & 528 Hz harmonic sine waves.
            </p>
          </div>

          <div
            onClick={() => onNavigate('journal')}
            className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-rose-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-600 cursor-pointer transition-all hover:-translate-y-1 shadow-md hover:shadow-lg hover:shadow-rose-100/40"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              📖 Mood Journal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Write your heart out; receive tailored Gemini self-care insights.
            </p>
          </div>

          <div
            onClick={() => onNavigate('voice-meditation')}
            className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-rose-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-600 cursor-pointer transition-all hover:-translate-y-1 shadow-md hover:shadow-lg hover:shadow-rose-100/40"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-500 mb-3">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              🎧 Voice Zen
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Listen to personalized guided audio sessions for sleep and calm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
