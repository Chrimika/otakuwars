'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LIBRARY_WORKS, LIBRARY_CATEGORY_LABEL, LibraryCategory } from '../../data/library';
import { WorkCover } from '../../components/library/WorkCover';
import { ScrollIcon } from '../../components/ui/icons/OtakuIcons';

export default function BibliothequePage() {
  const [filter, setFilter] = useState<LibraryCategory | 'tous'>('tous');
  const works = filter === 'tous' ? LIBRARY_WORKS : LIBRARY_WORKS.filter((w) => w.category === filter);

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-60" />
        <div className="relative max-w-4xl mx-auto px-4 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 clip-corner-sm bg-neon-gold/10 border border-neon-gold/40 text-neon-gold text-xs font-hud font-bold uppercase tracking-wider mb-5">
            <ScrollIcon className="w-3.5 h-3.5" />
            Made in Africa
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">Bibliothèque Otaku</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Mangas et récits illustrés d&apos;auteurs africains — certains gratuits, d&apos;autres à débloquer.
          </p>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {(['tous', 'shonen', 'seinen', 'isekai', 'historique', 'sci-fi'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 clip-corner-sm text-xs font-hud font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                filter === c
                  ? 'bg-neon-gold text-black border-neon-gold'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {c === 'tous' ? 'Tous' : LIBRARY_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <Link
              key={work.id}
              href={`/bibliotheque/${work.id}`}
              className="group block"
            >
              <WorkCover work={work} className="aspect-[3/4] mb-3 group-hover:brightness-110 transition-all" />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">{work.title}</p>
                  <p className="text-xs text-slate-500 truncate">{work.author}</p>
                </div>
                {work.isFree ? (
                  <span className="shrink-0 text-[10px] font-hud font-bold uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                    Gratuit
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-hud font-bold uppercase text-neon-gold bg-neon-gold/10 border border-neon-gold/40 px-1.5 py-0.5 rounded">
                    {work.price} FCFA
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
