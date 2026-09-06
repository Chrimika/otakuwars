import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const KatanaIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <line x1="4" y1="20.5" x2="18.5" y2="6" />
    <path d="M16.5 4l2 2-2 2" />
    <path d="M5 19l2.5-2.5M3.3 20.7l2.4-2.4" />
    <circle cx="4" cy="20.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const OniMaskIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.2c4.2 0 6.6 2.9 6.6 7.1 0 5.1-3 9.2-6.6 10.1-3.6-.9-6.6-5-6.6-10.1 0-4.2 2.4-7.1 6.6-7.1z" />
    <path d="M7.6 5.2 6 2.6M16.4 5.2 18 2.6" />
    <path d="M8.3 11.2l2.1 1.3M15.7 11.2l-2.1 1.3" />
    <path d="M10 16.8v1.6M14 16.8v1.6" />
  </svg>
);

export const ScrollIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M7 4a2 2 0 1 0 0 4h1" />
    <path d="M17 20a2 2 0 1 0 0-4h-1" />
    <path d="M8 4h9v16H8" />
    <line x1="10.5" y1="9" x2="14.5" y2="9" />
    <line x1="10.5" y1="13" x2="14.5" y2="13" />
  </svg>
);

export const ImpactBurstIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <polygon
      points="12,2 14.1,9 21,7 16.2,12 21,17 14.1,15 12,22 9.9,15 3,17 7.8,12 3,7 9.9,9"
      fill="currentColor"
    />
  </svg>
);

export const ToriiIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M3 7.4c4-1.6 14-1.6 18 0" />
    <line x1="4.2" y1="10" x2="19.8" y2="10" />
    <line x1="6.5" y1="7.8" x2="6.5" y2="21" />
    <line x1="17.5" y1="7.8" x2="17.5" y2="21" />
    <line x1="12" y1="10" x2="12" y2="14" />
  </svg>
);

export const LightningIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />
  </svg>
);

export const DropIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3c3.5 4 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 2.5-7 6-11z" />
  </svg>
);

export const SpeechBubbleIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M4 5h16v11H9l-4 4v-4H4V5z" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="12.5" x2="13" y2="12.5" />
  </svg>
);

export const RobotIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="5" y="8" width="14" height="11" rx="2" />
    <line x1="12" y1="8" x2="12" y2="4" />
    <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
    <line x1="9" y1="17" x2="15" y2="17" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
  </svg>
);

export const MoonStarIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M16 3.5A8 8 0 1 0 20.5 16 6.3 6.3 0 0 1 16 3.5z" />
    <path d="M19 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4L17 5.5l1.4-.6.6-1.4z" fill="currentColor" stroke="none" />
  </svg>
);

export const CupIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M5 8h11v6a5.5 5.5 0 0 1-5.5 5.5h0A5.5 5.5 0 0 1 5 14V8z" />
    <path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16" />
    <line x1="8" y1="3" x2="8" y2="5.5" />
    <line x1="11.5" y1="3" x2="11.5" y2="5.5" />
  </svg>
);

export const BallIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5v17M3.5 12h17M6 6.5c3.5 3 8.5 3 12 0M6 17.5c3.5-3 8.5-3 12 0" />
  </svg>
);

export const MagnifierIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 20.2s-7.5-4.6-9.8-9.3C.7 7.4 2.6 4 6 4c2 0 3.4 1.1 6 4 2.6-2.9 4-4 6-4 3.4 0 5.3 3.4 3.8 6.9-2.3 4.7-9.8 9.3-9.8 9.3z" />
  </svg>
);

export const MedalIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M9 3 6 9l2 1 3-6-2-1zM15 3l3 6-2 1-3-6 2-1z" fill="currentColor" stroke="none" />
    <circle cx="12" cy="14" r="6.5" />
    <path d="M12 10.5 13 13l2.5.2-1.9 1.6.6 2.4-2.2-1.3-2.2 1.3.6-2.4-1.9-1.6L11 13z" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Clins d'œil "boutons manette" (formes génériques, pas la charte Sony) ─── */
export const TriangleGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4l8 15H4z" />
  </svg>
);

export const CircleGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
  </svg>
);

export const CrossGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const SquareGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="4.5" y="4.5" width="15" height="15" />
  </svg>
);

/* ─── Réseaux sociaux (glyphes maison, pas les logos officiels) ─────────────── */
export const WhatsAppGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M5 20l1.3-4.2A7.5 7.5 0 1 1 9.5 19L5 20z" />
    <path d="M9 10.3c0 3 2.7 5.7 5.7 5.7.6 0 1-.5.9-1l-.2-.9c-.1-.4-.5-.6-.9-.5l-1 .3c-.9-.5-1.7-1.3-2.2-2.2l.3-1c.1-.4-.1-.8-.5-.9l-.9-.2c-.5-.1-1 .3-1 .9z" fill="currentColor" stroke="none" />
  </svg>
);

export const LinkedInGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="8.3" cy="8.3" r="1.1" fill="currentColor" stroke="none" />
    <line x1="8.3" y1="11.5" x2="8.3" y2="16.5" />
    <path d="M12 16.5v-3.2c0-1.3 1-2 2-2s2 .7 2 2v3.2" />
    <line x1="12" y1="11.5" x2="12" y2="16.5" />
  </svg>
);

export const TikTokGlyphIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M13 4v10.2a2.8 2.8 0 1 1-2.2-2.7" />
    <path d="M13 4c.4 2 2 3.5 4 3.8" />
  </svg>
);
