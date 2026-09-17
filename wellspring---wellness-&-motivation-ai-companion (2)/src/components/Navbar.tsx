import React from 'react';
import { PageId, UserProfile, NatureEffect } from '../types';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  natureEffect: NatureEffect;
  onToggleNatureEffect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onSignOut,
  darkMode,
  onToggleDarkMode,
  onOpenAuth,
  natureEffect,
  onToggleNatureEffect,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-[#07192d]/80 border-b border-black/10 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Name - Black in Light Mode, White in Dark Mode */}
        <button
          id="nav-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white hover:opacity-85 transition-opacity tracking-tight"
        >
          <span>Wellspring</span>
        </button>

        {/* Navigation Items - Black in Light Mode, White in Dark Mode */}
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-5 text-sm font-medium">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`transition-colors ${
              currentPage === 'home'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-sky-500'
                : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}
          >
            Home
          </button>

          {!user ? (
            <>
              <button
                id="nav-signin-btn"
                onClick={() => onOpenAuth('signin')}
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => onOpenAuth('signup')}
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors"
              >
                Sign Up
              </button>
            </>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/15 text-black dark:text-white font-bold">
              {user.name}
            </span>
          )}

          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors ${
              currentPage === 'dashboard'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-sky-500'
                : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>

          <button
            id="nav-chat-btn"
            onClick={() => onNavigate('chat')}
            className={`transition-colors ${
              currentPage === 'chat'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-sky-500'
                : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}
          >
            AI Companion
          </button>

          <button
            id="nav-journal-btn"
            onClick={() => onNavigate('journal')}
            className={`transition-colors ${
              currentPage === 'journal'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-sky-500'
                : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}
          >
            Mood Journal
          </button>

          <button
            id="nav-voice-meditation-btn"
            onClick={() => onNavigate('voice-meditation')}
            className={`flex items-center gap-1 transition-colors ${
              currentPage === 'voice-meditation'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-sky-500'
                : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>Voice Zen</span>
            <span>🎧</span>
          </button>

          <button
            id="nav-meditation-btn"
            onClick={() => onNavigate('meditation')}
            className={`transition-colors ${
              currentPage === 'meditation'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-sky-500'
                : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}
          >
            Zen Mode
          </button>

          {/* Theme Toggle Button */}
          <button
            id="nav-theme-toggle"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to daylight theme' : 'Switch to twilight theme'}
            className="p-1.5 rounded-full text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-300" />
            ) : (
              <Moon className="w-5 h-5 text-black" />
            )}
          </button>

          {/* User Requested: Bubble and Flower toggle button: 1-click Rain, tap again Leaf fall */}
          <button
            id="nav-bubble-flower-toggle"
            onClick={onToggleNatureEffect}
            title={
              natureEffect === 'bubbles-flowers'
                ? 'Bubble & Flower: Click for Rain 🌧️'
                : natureEffect === 'rain'
                ? 'Rain active: Tap again for Falling Leaves 🍃'
                : 'Leaves active: Tap again for Bubbles & Flowers 🫧🌸'
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-sky-950/80 text-black dark:text-white border border-black/20 dark:border-white/20 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
          >
            {natureEffect === 'bubbles-flowers' && (
              <>
                <span className="text-sm">🫧 🌸</span>
                <span className="font-semibold text-black dark:text-white">Bubble & Flower</span>
              </>
            )}
            {natureEffect === 'rain' && (
              <>
                <span className="text-sm animate-pulse">🌧️ 💧</span>
                <span className="font-bold text-black dark:text-sky-300">Rain Falling</span>
              </>
            )}
            {natureEffect === 'leaves' && (
              <>
                <span className="text-sm">🍃 🍂</span>
                <span className="font-bold text-black dark:text-emerald-300">Leaves Falling</span>
              </>
            )}
          </button>

          {/* Logout button */}
          <button
            id="nav-logout-btn"
            onClick={user ? onSignOut : () => onOpenAuth('signin')}
            className="text-rose-600 dark:text-rose-400 font-semibold hover:underline transition-all text-xs sm:text-sm"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};
