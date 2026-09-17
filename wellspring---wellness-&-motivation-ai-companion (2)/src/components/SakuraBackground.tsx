import React, { useMemo } from 'react';
import { NatureEffect } from '../types';

interface SakuraBackgroundProps {
  darkMode?: boolean;
  natureEffect: NatureEffect;
  onCycleNatureEffect?: () => void;
}

export const SakuraBackground: React.FC<SakuraBackgroundProps> = ({
  darkMode,
  natureEffect,
  onCycleNatureEffect,
}) => {
  // Rain droplets
  const rainDrops = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const left = (i / 48) * 100 + (Math.sin(i * 13) * 2);
      const height = 24 + (i % 5) * 8;
      const duration = 0.85 + ((i * 7) % 10) * 0.08;
      const delay = ((i * 3) % 15) * 0.12;
      const opacity = 0.4 + ((i % 4) * 0.15);
      return {
        id: i,
        left: `${left}%`,
        height: `${height}px`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
      };
    });
  }, []);

  // Falling leaves (green & golden autumn tones)
  const leaves = useMemo(() => {
    const leafColors = [
      'from-emerald-500/80 via-green-600/80 to-teal-700/80',
      'from-amber-400/85 via-orange-500/80 to-amber-600/85',
      'from-lime-400/80 via-emerald-600/80 to-green-700/80',
      'from-yellow-400/85 via-amber-500/85 to-orange-600/85',
      'from-teal-400/80 via-emerald-500/80 to-green-600/80',
    ];
    return Array.from({ length: 26 }).map((_, i) => {
      const left = ((i * 3.8) % 100);
      const size = 18 + (i % 6) * 4;
      const duration = 8 + (i % 7) * 1.5;
      const delay = (i % 8) * 0.7;
      const color = leafColors[i % leafColors.length];
      return {
        id: i,
        left: `${left}vw`,
        size,
        duration: `${duration}s`,
        delay: `${delay}s`,
        color,
      };
    });
  }, []);

  // Floating bubbles and petals
  const bubbles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const left = ((i * 5.2) % 96) + 2;
      const size = 20 + (i % 5) * 10;
      const duration = 10 + (i % 6) * 2;
      const delay = (i % 7) * 1.1;
      return {
        id: i,
        left: `${left}vw`,
        size,
        duration: `${duration}s`,
        delay: `${delay}s`,
      };
    });
  }, []);

  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, index) => {
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 10;
      const duration = 9 + Math.random() * 7;
      const delay = Math.random() * 6;
      return {
        id: index,
        left: `${left}vw`,
        width: `${size}px`,
        height: `${size * 1.25}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      };
    });
  }, []);

  // Soft celestial sparkles
  const sparkles = [
    { top: '12%', left: '42%', size: 'w-1.5 h-1.5', opacity: 'opacity-70' },
    { top: '18%', left: '78%', size: 'w-1 h-1', opacity: 'opacity-80' },
    { top: '26%', left: '49%', size: 'w-2 h-2', opacity: 'opacity-90' },
    { top: '34%', left: '17%', size: 'w-1.5 h-1.5', opacity: 'opacity-60' },
    { top: '40%', left: '39%', size: 'w-1 h-1', opacity: 'opacity-75' },
    { top: '48%', left: '55%', size: 'w-2.5 h-2.5', opacity: 'opacity-80' },
    { top: '64%', left: '22%', size: 'w-1.5 h-1.5', opacity: 'opacity-70' },
    { top: '70%', left: '72%', size: 'w-2 h-2', opacity: 'opacity-85' },
    { top: '85%', left: '45%', size: 'w-1.5 h-1.5', opacity: 'opacity-65' },
    { top: '22%', left: '62%', size: 'w-1 h-1', opacity: 'opacity-75' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Sky Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          darkMode
            ? 'bg-gradient-to-b from-[#07192d] via-[#0d2746] to-[#12365e]'
            : 'bg-gradient-to-b from-[#87b3e4] via-[#a3c9f1] to-[#bddaf6]'
        }`}
      />

      {/* Wellspring Water Ripples */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none flex items-center justify-center">
        <div
          className={`absolute w-72 h-72 rounded-full border border-sky-300/40 dark:border-sky-400/20 animate-spring-ripple-1 ${
            darkMode ? 'bg-sky-500/5' : 'bg-white/10'
          }`}
        />
        <div
          className={`absolute w-72 h-72 rounded-full border border-sky-200/40 dark:border-sky-300/20 animate-spring-ripple-2 ${
            darkMode ? 'bg-sky-500/5' : 'bg-white/10'
          }`}
        />
        <div
          className={`absolute w-72 h-72 rounded-full border border-white/40 dark:border-sky-200/15 animate-spring-ripple-3 ${
            darkMode ? 'bg-sky-500/5' : 'bg-white/10'
          }`}
        />
      </div>

      {/* Layered Gentle Water Stream Curves at the Base */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none opacity-40 dark:opacity-25">
        <div
          className={`absolute bottom-[-10px] left-[-10%] right-[-10%] h-24 rounded-[100%] animate-spring-wave ${
            darkMode ? 'bg-[#0f2d4f]' : 'bg-sky-200'
          }`}
        />
        <div
          className={`absolute bottom-[-20px] left-[-5%] right-[-5%] h-24 rounded-[100%] animate-spring-wave-reverse ${
            darkMode ? 'bg-[#143960]' : 'bg-sky-100'
          }`}
        />
      </div>

      {/* Layered Horizontal Cloud Pills */}
      <div
        className={`absolute -top-10 right-[-5%] w-[42rem] h-40 rounded-full transition-colors duration-700 blur-[0.5px] animate-float-slow ${
          darkMode ? 'bg-[#15385e]/45' : 'bg-white/35'
        }`}
      />
      <div
        className={`absolute top-44 right-[-8%] w-[52rem] h-48 rounded-full transition-colors duration-700 animate-float-reverse ${
          darkMode ? 'bg-[#183e69]/40' : 'bg-white/30'
        }`}
        style={{ animationDelay: '1s' }}
      />
      <div
        className={`absolute top-80 right-[-3%] w-[46rem] h-40 rounded-full transition-colors duration-700 animate-float-gentle ${
          darkMode ? 'bg-[#133254]/50' : 'bg-white/35'
        }`}
        style={{ animationDelay: '3s' }}
      />
      <div
        className={`absolute top-20 -left-20 w-[36rem] h-36 rounded-full transition-colors duration-700 animate-float-reverse ${
          darkMode ? 'bg-[#112d4d]/40' : 'bg-white/25'
        }`}
        style={{ animationDelay: '2s' }}
      />
      <div
        className={`absolute top-64 -left-12 w-[42rem] h-44 rounded-full transition-colors duration-700 animate-float-slow ${
          darkMode ? 'bg-[#143960]/35' : 'bg-white/30'
        }`}
        style={{ animationDelay: '4s' }}
      />
      <div
        className={`absolute bottom-[-2rem] -left-16 w-[56rem] h-52 rounded-full transition-colors duration-700 animate-float-gentle ${
          darkMode ? 'bg-[#123357]/60' : 'bg-white/40'
        }`}
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className={`absolute bottom-8 right-[-10%] w-[58rem] h-48 rounded-full transition-colors duration-700 animate-float-reverse ${
          darkMode ? 'bg-[#173d68]/45' : 'bg-white/35'
        }`}
        style={{ animationDelay: '3.5s' }}
      />

      {/* Celestial Sparkles and Stars */}
      {sparkles.map((star, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-twinkle ${star.size} ${star.opacity}`}
          style={{
            top: star.top,
            left: star.left,
            animationDelay: `${(i * 0.4) % 3}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        />
      ))}

      {/* 1. RAIN EFFECT (Activated on click 1) */}
      {natureEffect === 'rain' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute w-[2px] rounded-full bg-gradient-to-b from-transparent via-sky-200/90 to-sky-100 dark:via-sky-400 dark:to-cyan-200 animate-rain shadow-[0_0_3px_rgba(255,255,255,0.7)]"
              style={{
                left: drop.left,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
                opacity: drop.opacity,
              }}
            />
          ))}

          {/* Rain ground splashes */}
          <div className="absolute bottom-4 left-0 right-0 h-8 flex justify-around pointer-events-none opacity-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-2 rounded-full border border-sky-200 dark:border-sky-400/50 animate-ping"
                style={{
                  animationDuration: `${1.2 + (i % 4) * 0.3}s`,
                  animationDelay: `${(i * 0.25) % 1.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. LEAF FALL EFFECT (Activated on tap again / click 2) */}
      {natureEffect === 'leaves' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {leaves.map((leaf) => (
            <div
              key={leaf.id}
              onClick={onCycleNatureEffect}
              className={`absolute cursor-pointer pointer-events-auto rounded-tr-3xl rounded-bl-3xl bg-gradient-to-br ${leaf.color} animate-leaf shadow-md border border-white/25 hover:scale-125 transition-transform`}
              style={{
                left: leaf.left,
                width: `${leaf.size}px`,
                height: `${leaf.size * 0.65}px`,
                animationDuration: leaf.duration,
                animationDelay: leaf.delay,
              }}
              title="Click leaf to switch ambient nature"
            >
              {/* Central Leaf Vein */}
              <div className="w-full h-[1px] bg-white/40 absolute top-1/2 -translate-y-1/2 rotate-12" />
            </div>
          ))}
        </div>
      )}

      {/* 3. BUBBLES & FLOWER EFFECT (Default / Click 3) */}
      {natureEffect === 'bubbles-flowers' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating Transparent Water Bubbles */}
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              onClick={onCycleNatureEffect}
              className="absolute cursor-pointer pointer-events-auto rounded-full bg-white/20 dark:bg-sky-400/15 backdrop-blur-[1px] border border-white/50 dark:border-sky-300/40 animate-bubble shadow-[inset_0_0_8px_rgba(255,255,255,0.6),0_0_12px_rgba(255,255,255,0.3)] hover:scale-125 hover:border-sky-200 transition-all"
              style={{
                left: bubble.left,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                animationDuration: bubble.duration,
                animationDelay: bubble.delay,
              }}
              title="Click bubble to trigger Rain 🌧️"
            >
              {/* Highlight Glint inside Bubble */}
              <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
          ))}

          {/* Falling Sakura Petals */}
          {petals.map((petal) => (
            <div
              key={petal.id}
              onClick={onCycleNatureEffect}
              className="absolute cursor-pointer pointer-events-auto rounded-tl-xl rounded-br-xl bg-gradient-to-br from-pink-200 via-pink-300 to-rose-300 opacity-70 animate-fall drop-shadow-sm hover:scale-125 transition-transform"
              style={{
                left: petal.left,
                width: petal.width,
                height: petal.height,
                animationDuration: petal.animationDuration,
                animationDelay: petal.animationDelay,
              }}
              title="Click petal to trigger Rain 🌧️"
            />
          ))}
        </div>
      )}
    </div>
  );
};
