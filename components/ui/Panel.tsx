'use client';

import React from 'react';

type Glow = 'crimson' | 'magenta' | 'violet' | 'gold' | 'neutral';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: Glow;
  brackets?: boolean;
}

const BRACKET_COLOR: Record<Glow, string> = {
  crimson: '#ff1f3d',
  magenta: '#ff2e88',
  violet: '#8b5cf6',
  gold: '#ffcc33',
  neutral: 'rgba(255,255,255,0.25)',
};

const BORDER_CLASS: Record<Glow, string> = {
  crimson: 'border-crimson/30',
  magenta: 'border-neon-magenta/30',
  violet: 'border-neon-violet/30',
  gold: 'border-neon-gold/30',
  neutral: 'border-white/10',
};

export const Panel: React.FC<PanelProps> = ({
  glow = 'neutral',
  brackets = true,
  className = '',
  style,
  children,
  ...rest
}) => {
  return (
    <div
      className={`${brackets ? 'hud-panel' : ''} bg-void-2/80 backdrop-blur-sm border ${BORDER_CLASS[glow]} ${className}`}
      style={{ ...(brackets ? { ['--bracket-color' as string]: BRACKET_COLOR[glow] } : {}), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};
