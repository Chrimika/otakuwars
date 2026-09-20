'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Panel } from '../../components/ui/Panel';
import { NeonButton } from '../../components/ui/NeonButton';
import { HeartIcon, KatanaIcon, ToriiIcon, ScrollIcon } from '../../components/ui/icons/OtakuIcons';
import { Check, Calendar, MessageSquare, Handshake } from 'lucide-react';

const TIERS = [
  { id: 'fan', name: 'Fan', amount: 1000, perk: 'Un grand merci affiché sur ton profil.', color: 'crimson' as const },
  { id: 'guerrier', name: 'Guerrier', amount: 5000, perk: 'Badge exclusif "Soutien" sur ta carte.', color: 'gold' as const },
  { id: 'legende', name: 'Légende', amount: 15000, perk: 'Nom cité sur la page À propos.', color: 'violet' as const },
];

const NON_MONETARY = [
  { icon: <Calendar className="w-5 h-5" />, title: 'Participe aux événements', desc: 'Chaque rencontre fait grandir la communauté.', href: '/evenements' },
  { icon: <MessageSquare className="w-5 h-5" />, title: 'Propose une idée', desc: 'La boîte à suggestions façonne la plateforme.', href: '/suggestions' },
  { icon: <Handshake className="w-5 h-5" />, title: 'Deviens partenaire', desc: 'Associe ta marque ou ton association à l\'arène.', href: '/#partenaire' },
];

export default function SoutenirPage() {
  const [supported, setSupported] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSupport = (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setSupported(id);
      setProcessing(null);
    }, 600);
  };

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-60" />
        <div className="speed-lines opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
          <HeartIcon className="w-10 h-10 text-crimson mx-auto mb-4" />
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">Soutenir le projet</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Otaku Wars grandit grâce à sa communauté. Chaque soutien aide à financer les serveurs,
            les événements et de nouvelles œuvres à publier.
          </p>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {TIERS.map((tier) => (
            <Panel key={tier.id} glow={tier.color} className="p-6 text-center flex flex-col">
              <p className="font-hud text-xs font-bold uppercase tracking-widest text-neon-gold mb-1">{tier.name}</p>
              <p className="font-display text-3xl text-white mb-3">{tier.amount.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">{tier.perk}</p>
              {supported === tier.id ? (
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <Check className="w-4 h-4" /> Merci pour ton soutien !
                </div>
              ) : (
                <NeonButton variant="primary" onClick={() => handleSupport(tier.id)} disabled={processing === tier.id} className="w-full">
                  {processing === tier.id ? 'Traitement...' : 'Soutenir'}
                </NeonButton>
              )}
            </Panel>
          ))}
        </div>

        <p className="text-[11px] text-slate-600 text-center mb-16 flex items-center justify-center gap-1.5">
          <ScrollIcon className="w-3.5 h-3.5" /> Démo : aucun paiement réel n&apos;est traité pour le moment.
        </p>

        <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5 text-center flex items-center justify-center gap-2">
          <ToriiIcon className="w-4 h-4 text-neon-gold" />
          D&apos;autres façons d&apos;aider
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {NON_MONETARY.map((item) => (
            <Link key={item.title} href={item.href}>
              <Panel glow="neutral" className="p-5 h-full hover:border-crimson/40 transition-all">
                <div className="w-10 h-10 clip-corner-sm bg-white/5 flex items-center justify-center mb-3 text-crimson">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <KatanaIcon className="w-3.5 h-3.5 text-crimson" />
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </Panel>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
