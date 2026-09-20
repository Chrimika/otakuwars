'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-crimson text-white hover:brightness-110 shadow-[0_0_20px_rgba(255,31,61,0.4)]',
  secondary:
    'bg-white/5 border border-neon-violet/50 text-neon-violet hover:bg-neon-violet/10 hover:border-neon-violet',
  danger:
    'bg-white/5 border border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/10 hover:border-neon-magenta',
  ghost:
    'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3.5 text-sm gap-2',
};

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  return (
    <button
      className={`clip-corner-sm inline-flex items-center justify-center font-hud font-bold uppercase tracking-wide transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
