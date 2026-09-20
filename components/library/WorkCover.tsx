'use client';

import React from 'react';
import { LibraryWork } from '../../data/library';

export const WorkCover: React.FC<{ work: LibraryWork; className?: string }> = ({ work, className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden clip-corner flex items-center justify-center bg-void-2 border ${className}`}
      style={{ borderColor: `${work.accentColor}66` }}
    >
      <div className="manga-halftone opacity-40" />
      <span className="relative font-display text-6xl text-white/90" style={{ textShadow: `0 0 24px ${work.accentColor}88` }}>
        {work.title.charAt(0)}
      </span>
      <span className="absolute bottom-2 right-2 text-[9px] font-hud uppercase tracking-widest text-white/50">
        {work.country}
      </span>
    </div>
  );
};
