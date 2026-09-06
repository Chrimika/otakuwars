'use client';

import React, { useEffect, useState } from 'react';
import { ImpactBurstIcon } from './ui/icons/OtakuIcons';

const BURSTS = [
  { top: '30%', left: '22%', size: 18, delay: 0.05 },
  { top: '68%', left: '28%', size: 12, delay: 0.15 },
  { top: '24%', left: '76%', size: 14, delay: 0.1 },
  { top: '72%', left: '74%', size: 20, delay: 0.22 },
  { top: '50%', left: '10%', size: 10, delay: 0.3 },
  { top: '48%', left: '90%', size: 12, delay: 0.18 },
];

export const IntroSequence: React.FC = () => {
  const [phase, setPhase] = useState<'in' | 'exit' | 'done'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 1650);
    const t2 = setTimeout(() => setPhase('done'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      onClick={() => setPhase('exit')}
      className={`fixed inset-0 z-[100] bg-void flex items-center justify-center overflow-hidden cursor-pointer select-none ${phase === 'exit' ? 'intro-exit' : ''}`}
    >
      {/* Kanji watermark */}
      <span className="font-jp text-[38vw] leading-none font-bold text-crimson/10 select-none">
        対戦
      </span>

      {/* Diagonal slash */}
      <div className="absolute -inset-y-24 left-0 w-1/2 bg-crimson intro-slash" />

      {/* Impact bursts */}
      {BURSTS.map((b, i) => (
        <ImpactBurstIcon
          key={i}
          className="absolute text-neon-gold intro-burst"
          style={{ top: b.top, left: b.left, width: b.size * 4, height: b.size * 4, animationDelay: `${b.delay}s` }}
        />
      ))}

      {/* Logo slam */}
      <div className="relative text-center px-4">
        <h1
          data-text="OTAKU WARS"
          className="comic-offset-text intro-slam font-display text-6xl sm:text-8xl tracking-wide text-ink"
        >
          OTAKU WARS
        </h1>
        <p className="mt-3 font-hud text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-gold intro-slam" style={{ animationDelay: '0.75s' }}>
          Entrez dans l&apos;arène
        </p>
      </div>

      <span className="absolute bottom-6 right-6 font-hud text-[10px] uppercase tracking-widest text-muted">
        Cliquez pour passer
      </span>
    </div>
  );
};
