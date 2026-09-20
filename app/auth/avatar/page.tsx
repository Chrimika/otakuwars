'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../../lib/AppContext';
import { saveUserProfileToFirestore } from '../../../lib/gameService';
import { NeonButton } from '../../../components/ui/NeonButton';
import { Panel } from '../../../components/ui/Panel';
import { Camera, Check, SkipForward } from 'lucide-react';

const SIZE = 200;

function drawBase(source: CanvasImageSource, sw: number, sh: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const side = Math.min(sw, sh);
  const sx = (sw - side) / 2;
  const sy = (sh - side) / 2;
  ctx.drawImage(source, sx, sy, side, side, 0, 0, SIZE, SIZE);
  return canvas;
}

function toVariant(base: HTMLCanvasElement, style: 'duotone' | 'halftone' | 'pop'): string {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  if (style === 'duotone') {
    ctx.filter = 'grayscale(1) contrast(1.3)';
    ctx.drawImage(base, 0, 0);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#ff1f3d';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.globalCompositeOperation = 'source-over';
  } else if (style === 'halftone') {
    ctx.filter = 'grayscale(1) contrast(1.5) brightness(1.05)';
    ctx.drawImage(base, 0, 0);
    ctx.filter = 'none';
    const cell = 7;
    const sample = ctx.getImageData(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#0a0808';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#ff1f3d';
    for (let y = 0; y < SIZE; y += cell) {
      for (let x = 0; x < SIZE; x += cell) {
        const idx = (y * SIZE + x) * 4;
        const brightness = (sample.data[idx] + sample.data[idx + 1] + sample.data[idx + 2]) / 3 / 255;
        const radius = (1 - brightness) * (cell / 1.6);
        if (radius > 0.4) {
          ctx.beginPath();
          ctx.arc(x + cell / 2, y + cell / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else {
    ctx.filter = 'saturate(1.9) contrast(1.35) brightness(1.05)';
    ctx.drawImage(base, 0, 0);
    ctx.filter = 'none';
    ctx.strokeStyle = '#ffb020';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, SIZE - 8, SIZE - 8);
  }

  return canvas.toDataURL('image/jpeg', 0.85);
}

export default function AvatarStepPage() {
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState('');
  const [variants, setVariants] = useState<string[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch(() => setCameraError('Caméra indisponible ou accès refusé.'));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const base = drawBase(video, video.videoWidth, video.videoHeight);
    setVariants([toVariant(base, 'duotone'), toVariant(base, 'halftone'), toVariant(base, 'pop')]);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const confirm = async () => {
    if (selected === null || !variants || !user) return;
    setSaving(true);
    const updated = { ...user, customAvatarDataUrl: variants[selected] };
    await saveUserProfileToFirestore(updated);
    localStorage.setItem('otakuwars_user', JSON.stringify(updated));
    setUser(updated);
    router.push('/');
  };

  const skip = () => router.push('/');

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <h1 className="font-display text-3xl text-ink mb-2">Ton avatar otaku</h1>
      <p className="text-xs text-slate-500 mb-8">Capture ton visage, on t&apos;en fait 3 versions stylisées.</p>

      <Panel glow="crimson" className="p-6">
        {!variants ? (
          <>
            {cameraError ? (
              <p className="text-neon-magenta text-sm mb-4">{cameraError}</p>
            ) : (
              <div className="clip-corner overflow-hidden mx-auto mb-5" style={{ width: SIZE, height: SIZE }}>
                <video ref={videoRef} muted playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <NeonButton variant="primary" onClick={capture} disabled={!!cameraError}>
                <Camera className="w-4 h-4" /> Capturer
              </NeonButton>
              <NeonButton variant="ghost" onClick={skip}>
                <SkipForward className="w-4 h-4" /> Passer
              </NeonButton>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-4">Choisis ton avatar préféré :</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`clip-corner-sm overflow-hidden border-2 transition-all cursor-pointer ${
                    selected === i ? 'border-crimson glow-crimson' : 'border-white/10'
                  }`}
                >
                  <img src={v} alt={`Avatar option ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <NeonButton variant="primary" onClick={confirm} disabled={selected === null || saving} className="w-full">
              <Check className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Confirmer mon avatar'}
            </NeonButton>
          </>
        )}
      </Panel>
    </div>
  );
}
