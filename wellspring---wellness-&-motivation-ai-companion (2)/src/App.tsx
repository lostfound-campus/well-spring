import React, { useState, useEffect } from 'react';
import { PageId, UserProfile, NatureEffect } from './types';
import { Navbar } from './components/Navbar';
import { SakuraBackground } from './components/SakuraBackground';
import { HomeView } from './components/HomeView';
import { AuthView } from './components/AuthView';
import { DailyDashboard } from './components/DailyDashboard';
import { ChatCompanion } from './components/ChatCompanion';
import { MoodJournal } from './components/MoodJournal';
import { VoiceMeditation } from './components/VoiceMeditation';
import { ZenMeditation } from './components/ZenMeditation';
import { MentalAssessment, AssessmentResult } from './components/MentalAssessment';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [natureEffect, setNatureEffect] = useState<NatureEffect>('bubbles-flowers');

  // Assessment results
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    status: string;
    summary: string;
  } | null>(null);

  // Load user profile & theme preference from localStorage on mount
  useEffect(() => {
    try {
      const isLogged = localStorage.getItem('wellspring_logged_in') === 'true';
      const name = localStorage.getItem('wellspring_username');
      const email = localStorage.getItem('wellspring_email');
      const age = localStorage.getItem('wellspring_age');

      if (isLogged && email) {
        setUser({
          name: name || email.split('@')[0],
          email,
          age: age || undefined,
        });
      }

      const savedTheme = localStorage.getItem('wellspring_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('wellspring_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('wellspring_theme', 'light');
      }
      return next;
    });
  };

  const handleNavigate = (page: PageId) => {
    const protectedPages: PageId[] = [
      'dashboard',
    ];

    if (protectedPages.includes(page) && !user) {
      showToast('Please sign in to access your personal dashboard 🔐');
      setAuthMode('signin');
      setCurrentPage('auth');
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    localStorage.setItem('wellspring_logged_in', 'true');
    localStorage.setItem('wellspring_username', authenticatedUser.name);
    localStorage.setItem('wellspring_email', authenticatedUser.email);
    if (authenticatedUser.age) {
      localStorage.setItem('wellspring_age', authenticatedUser.age);
    }

    // If they have completed the assessment, jump to dashboard, otherwise offer assessment
    const savedScore = localStorage.getItem('wellspring_wellness_score');
    if (savedScore) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('assessment');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('wellspring_logged_in');
    localStorage.removeItem('wellspring_username');
    localStorage.removeItem('wellspring_email');
    localStorage.removeItem('wellspring_age');
    showToast('Signed out successfully 👋');
    setCurrentPage('home');
  };

  const handleAssessmentComplete = (score: number, status: string, summary: string) => {
    setAssessmentResult({ score, status, summary });
    setCurrentPage('assessment-result');
  };

  const handleToggleNatureEffect = () => {
    setNatureEffect((prev) => {
      let next: NatureEffect = 'rain';
      if (prev === 'bubbles-flowers') {
        next = 'rain';
        showToast('🌧️ Rain mode activated! (Tap again for falling leaves)');
      } else if (prev === 'rain') {
        next = 'leaves';
        showToast('🍃 Falling leaves mode activated! (Tap again for bubbles & flowers)');
      } else {
        next = 'bubbles-flowers';
        showToast('🫧🌸 Bubbles & Flowers mode activated! (Tap to start rain)');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col text-black dark:text-white transition-colors duration-500">
      {/* Background Cloudscape, Starlight, and Nature Weather System */}
      <SakuraBackground
        darkMode={darkMode}
        natureEffect={natureEffect}
        onCycleNatureEffect={handleToggleNatureEffect}
      />

      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleSignOut}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAuth={handleOpenAuth}
        natureEffect={natureEffect}
        onToggleNatureEffect={handleToggleNatureEffect}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast"
          className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl bg-rose-500 text-white font-semibold text-sm shadow-xl shadow-rose-500/30 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none"
        >
          {toastMessage}
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1 z-10">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
            natureEffect={natureEffect}
            onToggleNatureEffect={handleToggleNatureEffect}
          />
        )}

        {currentPage === 'auth' && (
          <AuthView
            initialMode={authMode}
            onSuccess={handleAuthSuccess}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'dashboard' && (
          <DailyDashboard
            user={user}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'chat' && (
          <ChatCompanion user={user} onShowToast={showToast} />
        )}

        {currentPage === 'journal' && (
          <MoodJournal user={user} onShowToast={showToast} />
        )}

        {currentPage === 'voice-meditation' && (
          <VoiceMeditation user={user} onShowToast={showToast} />
        )}

        {currentPage === 'meditation' && (
          <ZenMeditation onShowToast={showToast} />
        )}

        {currentPage === 'assessment' && (
          <MentalAssessment
            onAssessmentComplete={handleAssessmentComplete}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'assessment-result' && assessmentResult && (
          <AssessmentResult
            score={assessmentResult.score}
            status={assessmentResult.status}
            summary={assessmentResult.summary}
            onContinue={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="z-10 py-6 text-center text-xs text-slate-400 border-t border-rose-100 dark:border-slate-800/80">
        <p>💧 Wellspring — Nurturing peace, mindfulness & emotional resilience.</p>
      </footer>
    </div>
  );
}
