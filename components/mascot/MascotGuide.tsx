'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mascot } from '../ui/icons/Mascot';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { KatanaIcon, ScrollIcon, ToriiIcon, MedalIcon, ImpactBurstIcon } from '../ui/icons/OtakuIcons';

const SEEN_KEY = 'otakuwars_mascot_seen';

interface TourStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}

const TOUR: TourStep[] = [
  {
    icon: ImpactBurstIcon,
    title: 'Salut, moi c\'est Kibo !',
    text: 'Je suis ton guide dans l\'arène. Laisse-moi te faire découvrir Otaku Wars en quelques instants.',
  },
  {
    icon: KatanaIcon,
    title: 'Le quiz en direct',
    text: 'Crée un salon ou rejoins-en un avec un code : les questions défilent en temps réel, le plus rapide marque le plus de points.',
  },
  {
    icon: ToriiIcon,
    title: 'Des événements partout',
    text: 'Rencontres, tournois gaming, ateliers lecture... retrouve la communauté otaku dans plusieurs villes du Cameroun.',
  },
  {
    icon: ScrollIcon,
    title: 'Une bibliothèque otaku',
    text: 'Découvre des mangas et récits illustrés d\'auteurs africains, certains gratuits, d\'autres à débloquer.',
  },
  {
    icon: MedalIcon,
    title: 'Badges, cartes & boutique',
    text: 'Gagne des parties pour débloquer des badges à partager, et équipe-toi aux couleurs de l\'arène à la boutique.',
  },
];

type Stage = 'idle' | 'attention' | 'open';

export const MascotGuide: React.FC = () => {
  const [stage, setStage] = useState<Stage>('idle');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      const t = setTimeout(() => setStage('attention'), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const openTour = () => {
    localStorage.setItem(SEEN_KEY, '1');
    setStep(0);
    setStage('open');
  };

  const isLast = step === TOUR.length - 1;
  const current = TOUR[step];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {stage === 'open' && (
        <div className="w-72 sm:w-80 clip-corner bg-void-2 border border-crimson/30 p-4 shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mascot className="w-9 h-9 shrink-0" />
              <div>
                <p className="font-display text-sm text-white leading-none">Kibo</p>
                <p className="text-[10px] text-neon-gold font-hud uppercase tracking-wide">Ton guide otaku</p>
              </div>
            </div>
            <button onClick={() => setStage('idle')} className="text-slate-500 hover:text-crimson transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            {TOUR.map((_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-crimson' : 'bg-white/10'}`} />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <current.icon className="w-4 h-4 text-crimson shrink-0" />
            <p className="text-xs font-bold text-white">{current.title}</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{current.text}</p>

          {isLast ? (
            <div className="flex gap-2">
              <Link
                href="/auth"
                onClick={() => setStage('idle')}
                className="clip-corner-sm flex-1 flex items-center justify-center py-2 text-xs font-hud font-bold uppercase tracking-wide bg-crimson text-white hover:brightness-110 transition-all"
              >
                Créer mon compte
              </Link>
              <button
                onClick={() => setStage('idle')}
                className="clip-corner-sm px-3 py-2 text-xs font-hud font-bold uppercase tracking-wide bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Terminer
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-1 text-[11px] font-hud font-bold uppercase tracking-wide text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-default cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Précédent
              </button>
              <button
                onClick={() => setStep((s) => Math.min(TOUR.length - 1, s + 1))}
                className="flex items-center gap-1 text-[11px] font-hud font-bold uppercase tracking-wide text-crimson hover:brightness-125 cursor-pointer"
              >
                Suivant <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {stage === 'attention' && (
        <button
          onClick={openTour}
          className="clip-corner-sm bg-crimson text-white text-xs font-hud font-bold uppercase tracking-wide px-3 py-2 shadow-[0_0_20px_rgba(255,31,61,0.5)] animate-fade-in cursor-pointer"
        >
          Clique sur moi !
        </button>
      )}

      <button
        onClick={() => (stage === 'open' ? setStage('idle') : openTour())}
        title="Appeler Kibo, le guide otaku"
        className={`clip-corner-sm w-14 h-14 bg-void-2/90 backdrop-blur-sm border flex items-center justify-center transition-all cursor-pointer ${
          stage === 'attention' ? 'border-crimson animate-bounce' : 'border-crimson/30 hover:border-crimson/70'
        }`}
      >
        <Mascot className="w-10 h-10" />
      </button>
    </div>
  );
};
