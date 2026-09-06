'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AmbientAudioToggleProps {
  src?: string;
  storageKey?: string;
  volume?: number;
  autoplay?: boolean;
  className?: string;
  accentClassName?: string;
  label?: string;
}

export const AmbientAudioToggle: React.FC<AmbientAudioToggleProps> = ({
  src = '/audio/theme.mp3',
  storageKey = 'otakuwars_audio_on',
  volume = 0.35,
  autoplay = false,
  className = 'fixed bottom-5 left-5 z-40',
  accentClassName = 'border-crimson/30 text-crimson hover:border-crimson/70',
  label = 'ambiance sonore',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);

  const start = async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      audio.volume = volume;
      await audio.play();
      setOn(true);
      localStorage.setItem(storageKey, '1');
      return true;
    } catch {
      return false;
    }
  };

  // Lecture après hydratation uniquement : évite un mismatch SSR/client sur la préférence stockée.
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const wantsOn = autoplay ? stored !== '0' : stored === '1';
    if (!wantsOn) return;

    start().then((ok) => {
      if (ok || !autoplay) return;
      // Autoplay bloqué par le navigateur : on démarre au premier geste utilisateur.
      const resume = () => {
        start();
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('pointerdown', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (on) {
      audio.pause();
      setOn(false);
      localStorage.setItem(storageKey, '0');
      return;
    }

    await start();
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        title={on ? `Couper l’${label}` : `Activer l’${label}`}
        className={`clip-corner-sm w-11 h-11 flex items-center justify-center bg-void-2/90 backdrop-blur-sm border transition-all cursor-pointer ${accentClassName} ${className}`}
      >
        {on ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
      </button>
    </>
  );
};
