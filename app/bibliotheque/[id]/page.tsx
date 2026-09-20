'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LIBRARY_WORKS, LIBRARY_CATEGORY_LABEL } from '../../../data/library';
import { WorkCover } from '../../../components/library/WorkCover';
import { Panel } from '../../../components/ui/Panel';
import { NeonButton } from '../../../components/ui/NeonButton';
import { ScrollIcon } from '../../../components/ui/icons/OtakuIcons';
import { ArrowLeft, BookOpen, Lock, ShoppingCart, Layers, Globe2, User } from 'lucide-react';

export default function WorkDetailPage() {
  const params = useParams<{ id: string }>();
  const work = LIBRARY_WORKS.find((w) => w.id === params.id);
  const [purchased, setPurchased] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!work) return;
    setPurchased(localStorage.getItem(`otakuwars_purchased_${work.id}`) === '1');
  }, [work]);

  if (!work) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 mb-4">Œuvre introuvable.</p>
        <Link href="/bibliotheque" className="text-crimson underline">Retour à la bibliothèque</Link>
      </div>
    );
  }

  const unlocked = work.isFree || purchased;
  const related = LIBRARY_WORKS.filter((w) => w.category === work.category && w.id !== work.id).slice(0, 4);

  const handleBuy = () => {
    setBuying(true);
    setTimeout(() => {
      localStorage.setItem(`otakuwars_purchased_${work.id}`, '1');
      setPurchased(true);
      setBuying(false);
    }, 600);
  };

  return (
    <div>
      {/* Bandeau immersif */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 scale-110 blur-3xl opacity-30"
          style={{ backgroundColor: work.accentColor }}
        />
        <div className="manga-halftone opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-16">
          <Link href="/bibliotheque" className="inline-flex items-center gap-1.5 mb-8 text-xs text-slate-300 hover:text-crimson transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à la bibliothèque
          </Link>

          <div className="grid sm:grid-cols-[240px_1fr] gap-8 items-end">
            <WorkCover work={work} className="aspect-[3/4] w-full shadow-2xl -rotate-2" />

            <div>
              <span className="inline-block text-[10px] font-hud font-bold uppercase tracking-wider text-neon-gold bg-neon-gold/10 border border-neon-gold/30 px-2 py-1 mb-3">
                {LIBRARY_CATEGORY_LABEL[work.category]}
              </span>
              <h1 className="font-display text-3xl sm:text-5xl text-ink mb-3 leading-tight">{work.title}</h1>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  <User className="w-3.5 h-3.5" />{work.author}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  <Globe2 className="w-3.5 h-3.5" />{work.country}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  <Layers className="w-3.5 h-3.5" />{work.pages} planches
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-[1fr_260px] gap-8">
          <p className="text-sm text-slate-300 leading-relaxed">{work.synopsis}</p>

          {unlocked ? (
            <Link
              href={`/bibliotheque/${work.id}/lire`}
              className="clip-corner-sm h-fit inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-hud font-bold uppercase tracking-wide bg-crimson text-white hover:brightness-110 shadow-[0_0_20px_rgba(255,31,61,0.4)] transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Lire
            </Link>
          ) : (
            <Panel glow="gold" className="p-5 h-fit">
              <div className="flex items-center gap-2 mb-2 text-neon-gold">
                <Lock className="w-4 h-4" />
                <span className="font-hud text-xs font-bold uppercase tracking-wide">Œuvre payante</span>
              </div>
              <p className="text-2xl font-display text-white mb-3">{work.price} FCFA</p>
              <NeonButton variant="primary" onClick={handleBuy} disabled={buying} className="w-full bg-neon-gold!">
                <ShoppingCart className="w-4 h-4" />
                {buying ? 'Traitement...' : 'Acheter'}
              </NeonButton>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <ScrollIcon className="w-3 h-3" />
                Démo : aucun paiement réel n&apos;est traité.
              </p>
            </Panel>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5">Œuvres similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((w) => (
                <Link key={w.id} href={`/bibliotheque/${w.id}`} className="group block">
                  <WorkCover work={w} className="aspect-[3/4] mb-2 group-hover:brightness-110 transition-all" />
                  <p className="text-xs font-bold text-white truncate">{w.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
