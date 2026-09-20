'use client';

import React, { useEffect, useRef, useState } from 'react';

const GLYPHS = 'アイウエオカキクケコサシスセソタチ0123456789$#%&@+=-<>'.split('');

interface CipherTextProps {
  text: string;
  className?: string;
  loopIntervalMs?: number;
}

export const CipherText: React.FC<CipherTextProps> = ({ text, className = '', loopIntervalMs = 9000 }) => {
  const [display, setDisplay] = useState(text);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const chars = text.split('');
    const revealDelayPerChar = 1;
    const totalTicks = chars.length * revealDelayPerChar + 3;
    let tick = 0;

    const run = () => {
      tick = 0;
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        tick += 1;
        const next = chars
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            const lockTick = i * revealDelayPerChar + 2;
            return tick >= lockTick ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
        setDisplay(next);

        if (tick >= totalTicks) {
          if (tickRef.current) clearInterval(tickRef.current);
          setDisplay(text);
        }
      }, 22);
    };

    run();
    const loop = setInterval(run, loopIntervalMs);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      clearInterval(loop);
    };
  }, [text, loopIntervalMs]);

  return <span className={className}>{display}</span>;
};
