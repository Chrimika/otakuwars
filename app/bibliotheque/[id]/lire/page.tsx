'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LIBRARY_WORKS } from '../../../../data/library';
import { NeonButton } from '../../../../components/ui/NeonButton';
import { AmbientAudioToggle } from '../../../../components/ui/AmbientAudioToggle';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReaderPage() {
  const params = useParams<{ id: string }>();
  const work = LIBRARY_WORKS.find((w) => w.id === params.id);
  const [page, setPage] = useState(1);
  const totalPages = 5;

  if (!work) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 mb-4">Œuvre introuvable.</p>
        <Link href="/bibliotheque" className="text-crimson underline">Retour à la bibliothèque</Link>
      </div>
    );
  }

  const goTo = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)));

  return (
    <div
      className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#120b1f]"
    >
      {/* Ambiance douce : lueurs respirantes */}
      <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-neon-violet/20 blur-[90px] calm-breathe" />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full bg-neon-gold/10 blur-[100px] calm-breathe calm-drift" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/bibliotheque/${work.id}`} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-neon-violet transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à la fiche
          </Link>
          <AmbientAudioToggle
            src="/audio/reader-ambient.mp3"
            storageKey="otakuwars_reader_audio_on"
            volume={0.25}
            className="static"
            accentClassName="border-neon-violet/30 text-neon-violet hover:border-neon-violet/70"
            label="ambiance de lecture"
          />
        </div>

        <div
          key={page}
          className="page-turn rounded-3xl aspect-[3/4] flex flex-col items-center justify-center text-center px-10 mb-6 relative overflow-hidden bg-[#150e26] border"
          style={{ borderColor: `${work.accentColor}33` }}
        >
          <span className="relative font-display text-2xl text-white/90 mb-3">{work.title}</span>
          <p className="relative text-xs text-slate-400 max-w-xs leading-relaxed">
            Planche {page} / {totalPages} — contenu de démonstration. Les scans réels de cette œuvre seront ajoutés prochainement.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <NeonButton variant="ghost" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
            <ChevronLeft className="w-4 h-4" /> Précédent
          </NeonButton>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => goTo(n)}
                className={`rounded-full transition-all cursor-pointer ${
                  n === page ? 'w-5 h-1.5 bg-neon-violet' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <NeonButton variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
            Suivant <ChevronRight className="w-4 h-4" />
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
