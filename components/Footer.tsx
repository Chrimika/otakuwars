'use client';

import React from 'react';
import Link from 'next/link';
import { KatanaIcon, HeartIcon } from './ui/icons/OtakuIcons';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Plateforme',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Événements', href: '/evenements' },
      { label: 'Bibliothèque', href: '/bibliotheque' },
      { label: 'Boutique', href: '/boutique' },
      { label: 'Récompenses', href: '/recompenses' },
      { label: 'À propos', href: '/a-propos' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Discord', href: '#' },
      { label: 'Twitter / X', href: '#' },
      { label: 'Devenir partenaire', href: '/#partenaire' },
      { label: 'Boîte à suggestions', href: '/suggestions' },
      { label: 'Soutenir le projet', href: '/soutenir' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-crimson/10 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="clip-corner-sm w-8 h-8 bg-crimson flex items-center justify-center">
              <KatanaIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-base tracking-wide text-ink">OTAKU WARS</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
            L&apos;arène ultime de la communauté otaku : quiz en direct, événements, œuvres africaines.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-hud text-xs font-bold uppercase tracking-widest text-neon-gold mb-3">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-slate-400 hover:text-crimson transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-crimson/10 py-5 flex items-center justify-center gap-1.5 text-center text-xs text-slate-700 font-hud uppercase tracking-widest">
        © 2026 OTAKU WARS — Fait avec <HeartIcon className="w-3.5 h-3.5 text-crimson" /> pour la communauté otaku
      </div>
    </footer>
  );
};
