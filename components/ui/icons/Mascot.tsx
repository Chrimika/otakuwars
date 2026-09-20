import React from 'react';

export const Mascot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" {...props}>
    {/* Robe / body */}
    <path d="M28 78c0-6 5-11 12-13l10-3 10 3c7 2 12 7 12 13v20a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4V78z" fill="#0f0d14" />
    <path d="M50 62l-9 34h18l-9-34z" fill="#ff1f3d" />

    {/* Head */}
    <circle cx="50" cy="42" r="25" fill="#f5efe6" />

    {/* Hair spikes */}
    <path d="M22 34c2-14 12-24 28-24s26 10 28 24c-5-6-11-9-16-6 1-6-3-11-9-11s-10 5-9 11c-6-4-13-2-16 5-2-4-4 0-6 1z" fill="#120b12" />
    <path d="M20 36l6-13 4 10-6 6-4-3z" fill="#120b12" />
    <path d="M80 36l-6-13-4 10 6 6 4-3z" fill="#120b12" />

    {/* Headband */}
    <path d="M24 33c9-5 43-5 52 0l-2 7c-16-5-32-5-48 0l-2-7z" fill="#ffb020" />
    <circle cx="50" cy="35" r="4" fill="#ff1f3d" />

    {/* Eyes */}
    <circle cx="41" cy="45" r="4.5" fill="#0f0d14" />
    <circle cx="59" cy="45" r="4.5" fill="#0f0d14" />
    <circle cx="42.3" cy="43.5" r="1.3" fill="#f5efe6" />
    <circle cx="60.3" cy="43.5" r="1.3" fill="#f5efe6" />

    {/* Blush + smile */}
    <circle cx="34" cy="52" r="2.5" fill="#ff1f3d" opacity="0.35" />
    <circle cx="66" cy="52" r="2.5" fill="#ff1f3d" opacity="0.35" />
    <path d="M44 55c2 2.5 10 2.5 12 0" stroke="#0f0d14" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Mini scroll held up */}
    <rect x="63" y="66" width="16" height="10" rx="2" fill="#ffb020" />
    <rect x="65" y="69" width="12" height="1.4" fill="#0f0d14" />
    <rect x="65" y="72" width="8" height="1.4" fill="#0f0d14" />
  </svg>
);
