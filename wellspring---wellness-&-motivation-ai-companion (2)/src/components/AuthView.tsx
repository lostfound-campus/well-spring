import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthViewProps {
  initialMode?: 'signin' | 'signup';
  onSuccess: (user: UserProfile) => void;
  onShowToast: (msg: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signup',
  onSuccess,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please provide all required credentials.');
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('wellspring_accounts') || '{}');

      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your name.');
          return;
        }

        if (stored[cleanEmail]) {
          setErrorMsg('An account with this email already exists. Please sign in.');
          setMode('signin');
          return;
        }

        stored[cleanEmail] = {
          name: name.trim(),
          age: age.trim(),
          password,
        };

        localStorage.setItem('wellspring_accounts', JSON.stringify(stored));
        const user: UserProfile = {
          name: name.trim(),
          age: age.trim(),
          email: cleanEmail,
        };

        onSuccess(user);
        onShowToast('Account created successfully! ✨');
      } else {
        const account = stored[cleanEmail];
        if (!account || account.password !== password) {
          setErrorMsg('Invalid email or password. Please try again.');
          return;
        }

        const user: UserProfile = {
          name: account.name || cleanEmail.split('@')[0],
          age: account.age,
          email: cleanEmail,
        };

        onSuccess(user);
        onShowToast(`Welcome back, ${user.name}! 💧`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Authentication error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-white/15 shadow-2xl shadow-sky-950/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-200/60 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-300/60 dark:border-pink-800/40 mb-3">
          <span>🌸</span>
          <span>❀｡˚○ WellSpring</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#14395b] dark:text-sky-100">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-xs sm:text-sm text-[#204972]/80 dark:text-sky-200/80 mt-1 mb-6">
          {mode === 'signup'
            ? 'Sign up to unlock your personalized wellness and AI companion journey.'
            : 'Sign in to continue your mental health progress.'}
        </p>

        {/* Auth Tabs */}
        <div className="grid grid-cols-2 p-1 bg-white/40 dark:bg-sky-950/50 border border-white/40 dark:border-white/10 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-sky-900 text-[#14395b] dark:text-white shadow-sm'
                : 'text-[#204972] dark:text-sky-300'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white dark:bg-sky-900 text-[#14395b] dark:text-white shadow-sm'
                : 'text-[#204972] dark:text-sky-300'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#14395b] dark:text-sky-200 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Harini"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-sky-950/60 border border-white/50 dark:border-white/20 text-sm text-[#14395b] dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14395b] dark:text-sky-200 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="12"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-sky-950/60 border border-white/50 dark:border-white/20 text-sm text-[#14395b] dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#14395b] dark:text-sky-200 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-sky-950/60 border border-white/50 dark:border-white/20 text-sm text-[#14395b] dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14395b] dark:text-sky-200 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-sky-950/60 border border-white/50 dark:border-white/20 text-sm text-[#14395b] dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-500 text-center">{errorMsg}</p>
          )}

          <button
            id="authSubmitBtn"
            type="submit"
            className="w-full py-3.5 rounded-full bg-sky-100/90 dark:bg-sky-100 hover:bg-white text-[#133557] font-bold text-sm shadow-md shadow-sky-950/15 hover:shadow-lg transition-all mt-2 cursor-pointer hover:scale-[1.02]"
          >
            {mode === 'signup' ? 'Create Account & Continue 🌸' : 'Sign In & Continue 🔐'}
          </button>
        </form>

        <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className="text-rose-500 font-bold underline ml-1"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New to Wellspring?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className="text-rose-500 font-bold underline ml-1"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
