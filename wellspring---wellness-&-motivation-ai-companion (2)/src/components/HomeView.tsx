import React from 'react';
import { PageId, NatureEffect } from '../types';
import {
  Wind,
  MessageSquareHeart,
  Compass,
  Headphones,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Heart,
  ShieldCheck,
  Feather,
  Quote,
  CloudRain,
  Leaf,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageId) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  natureEffect?: NatureEffect;
  onToggleNatureEffect?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAuth,
  natureEffect = 'bubbles-flowers',
  onToggleNatureEffect,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20 text-black dark:text-white transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[540px]">
        {/* Left Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10 space-y-6">
          {/* Main Title - Black in light, White in dark */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-black dark:text-white tracking-tight drop-shadow-sm">
            Wellspring
          </h1>

          {/* Subtitle - Black in light, White in dark */}
          <p className="text-lg sm:text-xl font-serif text-black/90 dark:text-white/90 leading-relaxed max-w-xl">
            A calm space to pause, reflect, breathe, and build gentle wellness habits.
          </p>

          {/* Frosted Glass Box for Mission & Story - High contrast Black text in light mode, White text in dark mode */}
          <div
            id="hero-story-box"
            className="backdrop-blur-md bg-white/75 dark:bg-[#0a233e]/75 border border-black/15 dark:border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-950/10 max-w-xl text-black dark:text-white transition-all"
          >
            {/* Box Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-black/10 dark:border-white/10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/20 select-none">
                <span className="text-sm">❀｡˚○</span>
                <span>Our Story & Mission</span>
              </div>
              <span className="text-[11px] text-black/75 dark:text-white/80 font-semibold tracking-wide uppercase">
                Mindful Living
              </span>
            </div>

            {/* Scrollable Container for the mission paragraphs */}
            <div className="max-h-48 overflow-y-auto pr-2 space-y-4 text-sm sm:text-[15px] leading-relaxed text-black dark:text-white custom-scrollbar">
              <p className="font-normal">
                Wellspring is a serene space designed to help you build lasting wellness habits
                through meditation, mindful reflection, and gentle motivation. WellSpring encourages
                you to pause and reconnect with yourself each day.
              </p>

              <p className="font-normal">
                WellSpring is created by three friends{' '}
                <strong className="font-bold text-black dark:text-white">Harini P</strong>,{' '}
                <strong className="font-bold text-black dark:text-white">Tanya Kukreti</strong> and{' '}
                <strong className="font-bold text-black dark:text-white">Yugashanmathi S</strong> who share a vision of making
                wellness accessible and nurturing for everyone.
              </p>

              {/* Founder Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-black/80 dark:text-white/80 font-semibold">Created with love by:</span>
                {['Harini P', 'Tanya Kukreti', 'Yugashanmathi S'].map((founder) => (
                  <span
                    key={founder}
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/20 backdrop-blur-sm"
                  >
                    🌸 {founder}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Nature Pill & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              id="hero-signup-btn"
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 text-base font-bold text-black dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
            >
              Sign Up
            </button>

            <button
              id="hero-signin-btn"
              onClick={() => onOpenAuth('signin')}
              className="px-8 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-base shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              Sign In
            </button>

            <button
              id="hero-journal-btn"
              onClick={() => onNavigate('journal')}
              className="px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/20 text-black dark:text-white font-bold text-sm backdrop-blur-md border border-black/20 dark:border-white/30 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Daily Diary</span>
            </button>

            {/* Bubble and Flower Quick Trigger Button */}
            {onToggleNatureEffect && (
              <button
                id="hero-nature-toggle-btn"
                onClick={onToggleNatureEffect}
                title="Click to toggle Rain 🌧️, Leaves 🍃, or Bubbles 🫧"
                className="px-4 py-2 rounded-full bg-white/80 dark:bg-sky-950/80 text-black dark:text-white font-bold text-xs border border-black/20 dark:border-white/20 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {natureEffect === 'bubbles-flowers' && (
                  <>
                    <span>🫧 🌸</span>
                    <span>Click for Rain</span>
                  </>
                )}
                {natureEffect === 'rain' && (
                  <>
                    <CloudRain className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300 animate-pulse" />
                    <span>Rain Active • Tap for Leaves</span>
                  </>
                )}
                {natureEffect === 'leaves' && (
                  <>
                    <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    <span>Leaves Active • Tap for Bubbles</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Crescent Moon Column */}
        <div className="lg:col-span-5 flex items-center justify-center relative py-6 lg:py-0">
          <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-white/25 dark:bg-sky-200/10 blur-3xl pointer-events-none" />

          {/* Glowing Crescent Moon */}
          <div
            className="relative group cursor-pointer animate-moon"
            onClick={() => onNavigate('meditation')}
            title="Click to begin Zen Breathing"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-56 h-56 sm:w-72 sm:h-72 lg:w-88 lg:h-88 filter drop-shadow-[0_0_35px_rgba(255,255,255,0.95)] drop-shadow-[0_0_75px_rgba(255,255,255,0.45)] transition-transform duration-700 hover:scale-105"
            >
              <path
                d="M 125 15 A 85 85 0 1 1 125 185 A 70 70 0 1 0 125 15 Z"
                fill="#ffffff"
              />
            </svg>

            <span className="absolute -top-2 left-6 text-white text-xl animate-pulse pointer-events-none">
              ✦
            </span>
            <span className="absolute bottom-6 left-12 text-white text-sm animate-pulse pointer-events-none">
              •
            </span>
          </div>
        </div>
      </section>

      {/* 2. IN THE FRONT: "WHY WELLSPRING?" SECTION */}
      <section className="relative pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/15 mb-2 shadow-xs">
              <span>❀｡˚○</span>
              <span>Our Purpose</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-black dark:text-white tracking-tight">
              Why WellSpring?
            </h2>
            <p className="text-sm sm:text-base text-black/90 dark:text-white/90 mt-1 max-w-2xl leading-relaxed">
              Why does our sanctuary exist? In a demanding world that asks for endless hustle,
              WellSpring is your gentle reminder to come home to yourself.
            </p>
          </div>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: A Gentle Sanctuary */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/75 rounded-3xl p-6 sm:p-7 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/10 flex flex-col justify-between hover:scale-101 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-center mb-4 shadow-sm">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-2 font-serif">
                A Haven Away from Noise
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Life often moves faster than our hearts can process. WellSpring creates an unhurried,
                peaceful oasis free from aggressive notifications, social comparison, and exhausting deadlines.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-xs font-bold text-black/90 dark:text-sky-300 flex items-center gap-1.5">
              <span>Breathe at your own pace</span>
              <span>•</span>
              <span>No rush</span>
            </div>
          </div>

          {/* Pillar 2: Honor Every Feeling */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/75 rounded-3xl p-6 sm:p-7 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/10 flex flex-col justify-between hover:scale-101 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-4 shadow-sm">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-2 font-serif">
                Zero Judgment for Emotions
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                We believe in honoring emotional truth, not forced positivity. Whether you are feeling
                radiant joy 😊, anxious tension 😰, quiet sadness 😔, or tears of grief 😭, you are always
                welcomed with unconditional kindness.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-xs font-bold text-black/90 dark:text-rose-300 flex items-center gap-1.5">
              <span>All 4 feelings are valid</span>
              <span>•</span>
              <span>Safe to feel</span>
            </div>
          </div>

          {/* Pillar 3: Holistic Healing */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/75 rounded-3xl p-6 sm:p-7 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/10 flex flex-col justify-between hover:scale-101 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-2 font-serif">
                Holistic Science & Solfeggio
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Blending diaphragmatic vagus nerve breathing, 528 Hz Love & 432 Hz Peace frequency tones,
                multimedia therapeutic diary logging, and Gemini AI emotional companionship.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-xs font-bold text-black/90 dark:text-indigo-300 flex items-center gap-1.5">
              <span>Sound, Mind & Reflection</span>
              <span>•</span>
              <span>Mindful harmony</span>
            </div>
          </div>
        </div>

        {/* Highlighted Thought Banner */}
        <div className="mt-6 backdrop-blur-md bg-white/60 dark:bg-sky-950/50 rounded-2xl p-4 sm:p-5 border border-black/15 dark:border-white/10 flex items-center gap-3 text-xs sm:text-sm italic text-black dark:text-white">
          <Quote className="w-5 h-5 text-sky-700 dark:text-sky-400 shrink-0 rotate-180" />
          <span>
            "Like a pure wellspring emerging in a quiet forest, your mind has its own natural clarity and peace
            when given the space to rest." — <strong className="font-bold not-italic text-black dark:text-white">WellSpring Philosophy ❀｡˚○</strong>
          </span>
        </div>
      </section>

      {/* 3. "WHAT WE PROVIDE / WHAT THE FEATURE WE HAVE" SECTION */}
      <section className="relative pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/15 mb-2 shadow-xs">
              <span>❀｡˚○</span>
              <span>Comprehensive Sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-black dark:text-white tracking-tight">
              What We Provide — Features
            </h2>
            <p className="text-sm sm:text-base text-black/90 dark:text-white/90 mt-1 max-w-2xl leading-relaxed">
              Explore our six mindful wellness tools, thoughtfully designed to restore calm, support emotional expression,
              and bring clarity to your everyday life.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/70 dark:bg-sky-950/70 text-black dark:text-white border border-black/15 dark:border-white/15 shadow-sm">
            <span>6 Complete Wellness Tools</span>
          </div>
        </div>

        {/* Feature Cards Grid (6 Modules) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Daily Mindfulness Diary */}
          <div
            id="feature-mood-journal"
            onClick={() => onNavigate('journal')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-3xl p-6 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-black dark:text-amber-200">
                  Multimedia Diary
                </span>
                <span className="text-xs">😊 😰 😔 😭</span>
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-1.5 font-serif">
                Daily Mindfulness Diary
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Express what happened today with 4 mood emojis, snap memories via device camera, dictate with voice-to-text,
                and record audio memos with instant Gemini self-care reflections.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Write in diary today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Voice Zen Meditation */}
          <div
            id="feature-voice-zen"
            onClick={() => onNavigate('voice-meditation')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-3xl p-6 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-900/60 text-black dark:text-sky-200">
                  Audio Immersion
                </span>
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-1.5 font-serif">
                Voice Zen Meditation 🎧
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Spoken personalized guided wind-downs, restorative affirmations, and soothing sleep journeys
                crafted dynamically for deep nervous system relief.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Listen to voice meditation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: AI Companion */}
          <div
            id="feature-ai-companion"
            onClick={() => onNavigate('chat')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-3xl p-6 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-200 dark:bg-pink-900/60 text-black dark:text-pink-200">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-1.5 font-serif">
                AI Empathy Companion ❀｡˚○
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Genuine, natural emotional support powered by Gemini AI with humor, gentle listening,
                voice readouts, and conversational comfort in English, Tamil, and Tanglish.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Talk with Companion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Zen Breathing */}
          <div
            id="feature-zen-mode"
            onClick={() => onNavigate('meditation')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-3xl p-6 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Wind className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-black dark:text-emerald-200">
                  Solfeggio Sound
                </span>
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-1.5 font-serif">
                Zen Breathing & Tones
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Harmonic Solfeggio sound therapy (528 Hz & 432 Hz) with visual expansion breathing cycles
                to reset heart rate variability and induce rapid peaceful stillness.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Enter Zen mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Daily Progress & Habits */}
          <div
            id="feature-daily-progress"
            onClick={() => onNavigate('dashboard')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-3xl p-6 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900/60 text-black dark:text-indigo-200">
                  Daily Tracker
                </span>
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-1.5 font-serif">
                Daily Wellness Habits
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Track hydration cups, mindful meditation minutes, streak days, weekly emotional trends,
                and self-compassion goals seamlessly on your private dashboard.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Open dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Holistic Assessment */}
          <div
            id="feature-wellness-check"
            onClick={() => onNavigate('assessment')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-3xl p-6 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900/60 text-black dark:text-rose-200">
                  Self-Check
                </span>
              </div>
              <h3 className="font-bold text-lg text-black dark:text-white mb-1.5 font-serif">
                Wellness Balance Assessment
              </h3>
              <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 leading-relaxed font-normal">
                Take a confidential, rapid 10-question self-check to evaluate sleep quality, emotional energy,
                mindfulness routines, and receive custom gentle recommendations.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Start assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. IN THE END: "MEET THE CREATORS" / CREATOR NAMES SECTION */}
      <section className="relative pt-6 pb-4">
        <div className="backdrop-blur-md bg-white/75 dark:bg-[#0a233e]/85 rounded-3xl p-7 sm:p-10 border border-black/15 dark:border-white/15 shadow-2xl shadow-sky-950/15 text-black dark:text-white">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/20 mb-2 shadow-xs">
              <span>❀｡˚○</span>
              <span>Vision & Heart</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-black dark:text-white tracking-tight">
              Meet the Creators of WellSpring
            </h2>
            <p className="text-xs sm:text-sm text-black/90 dark:text-white/90 mt-2 leading-relaxed">
              WellSpring was lovingly brought to life by three close friends who believe that mental wellness,
              calm reflection, and emotional healing should be accessible, comforting, and nurturing for everyone.
            </p>
          </div>

          {/* 3 Creator Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Creator 1: Harini P */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-sky-950/60 rounded-2xl p-5 border border-black/15 dark:border-white/15 text-center flex flex-col items-center justify-between hover:scale-102 transition-all shadow-sm">
              <div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-300 text-white flex items-center justify-center text-2xl font-serif font-bold mb-3 shadow-md">
                  H
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white mb-1.5 border border-black/10 dark:border-white/10">
                  <span>🌸 Creator</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-black dark:text-white">
                  Harini P
                </h3>
                <p className="text-xs font-bold text-black/85 dark:text-white/85 mb-2">
                  Empathetic AI &amp; Wellness Technology • Wellness Architecture
                </p>
                <p className="text-xs text-black/85 dark:text-white/85 leading-relaxed italic">
                  "Blending compassionate AI intelligence and wellness architecture to craft a truly safe emotional harbor."
                </p>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-widest text-black dark:text-white font-bold">
                ❀｡˚○ WellSpring Co-Founder
              </div>
            </div>

            {/* Creator 2: Tanya Kukreti */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-sky-950/60 rounded-2xl p-5 border border-black/15 dark:border-white/15 text-center flex flex-col items-center justify-between hover:scale-102 transition-all shadow-sm">
              <div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 text-white flex items-center justify-center text-2xl font-serif font-bold mb-3 shadow-md">
                  T
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white mb-1.5 border border-black/10 dark:border-white/10">
                  <span>🌸 Creator</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-black dark:text-white">
                  Tanya Kukreti
                </h3>
                <p className="text-xs font-bold text-black/85 dark:text-white/85 mb-2">
                  Mindful Experience &amp; Creative UI/UX Design
                </p>
                <p className="text-xs text-black/85 dark:text-white/85 leading-relaxed italic">
                  "Designing serene spaces and gentle sensory interactions that remind us to soften our shoulders and breathe."
                </p>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-widest text-black dark:text-white font-bold">
                ❀｡˚○ WellSpring Co-Founder
              </div>
            </div>

            {/* Creator 3: Yugashanmathi S */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-sky-950/60 rounded-2xl p-5 border border-black/15 dark:border-white/15 text-center flex flex-col items-center justify-between hover:scale-102 transition-all shadow-sm">
              <div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 text-white flex items-center justify-center text-2xl font-serif font-bold mb-3 shadow-md">
                  Y
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white mb-1.5 border border-black/10 dark:border-white/10">
                  <span>🌸 Creator</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-black dark:text-white">
                  Yugashanmathi S
                </h3>
                <p className="text-xs font-bold text-black/85 dark:text-white/85 mb-2">
                  Database &amp; System Architecture
                </p>
                <p className="text-xs text-black/85 dark:text-white/85 leading-relaxed italic">
                  "Engineering resilient database architecture and reliable systems to safeguard your personal wellness journey."
                </p>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-widest text-black dark:text-white font-bold">
                ❀｡˚○ WellSpring Co-Founder
              </div>
            </div>
          </div>

          {/* Creators Footer Statement */}
          <div className="pt-6 border-t border-black/15 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black dark:text-white text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm">❀｡˚○</span>
              <span>
                Envisioned with love and mindfulness by <strong className="font-bold">Harini P</strong>, <strong className="font-bold">Tanya Kukreti</strong>, and <strong className="font-bold">Yugashanmathi S</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('journal')}
                className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs hover:scale-105 transition-all cursor-pointer"
              >
                Write in Diary 📖
              </button>
              <button
                type="button"
                onClick={() => onNavigate('meditation')}
                className="px-4 py-1.5 rounded-full bg-black/10 dark:bg-white/15 text-black dark:text-white font-bold text-xs hover:bg-black/20 dark:hover:bg-white/25 transition-all cursor-pointer"
              >
                Zen Breathing 🌙
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
