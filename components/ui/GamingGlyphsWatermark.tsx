import React from 'react';
import { TriangleGlyphIcon, CircleGlyphIcon, CrossGlyphIcon, SquareGlyphIcon } from './icons/OtakuIcons';

const GLYPHS = [
  { Icon: TriangleGlyphIcon, top: '15%', left: '6%', size: 28, rot: -12 },
  { Icon: CircleGlyphIcon, top: '70%', left: '10%', size: 22, rot: 8 },
  { Icon: CrossGlyphIcon, top: '20%', left: '92%', size: 24, rot: 15 },
  { Icon: SquareGlyphIcon, top: '65%', left: '90%', size: 20, rot: -10 },
  { Icon: CircleGlyphIcon, top: '85%', left: '50%', size: 18, rot: 0 },
  { Icon: TriangleGlyphIcon, top: '8%', left: '55%', size: 18, rot: 20 },
];

export const GamingGlyphsWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    {GLYPHS.map((g, i) => (
      <g.Icon
        key={i}
        className="absolute text-crimson/10"
        style={{ top: g.top, left: g.left, width: g.size, height: g.size, transform: `rotate(${g.rot}deg)` }}
      />
    ))}
  </div>
);
