'use client';

import React, { useState } from 'react';
import { OTAKU_EVENTS, EVENT_TYPE_LABEL, EventType } from '../../data/events';
import { GamingGlyphsWatermark } from '../../components/ui/GamingGlyphsWatermark';
import { KatanaIcon, ImpactBurstIcon, ScrollIcon, ToriiIcon } from '../../components/ui/icons/OtakuIcons';
import { MapPin, Calendar } from 'lucide-react';

const TYPE_ICON: Record<EventType, React.ReactNode> = {
  rencontre: <ToriiIcon className="w-4 h-4" />,
  gaming: <ImpactBurstIcon className="w-4 h-4" />,
  lecture: <ScrollIcon className="w-4 h-4" />,
  concours: <KatanaIcon className="w-4 h-4" />,
};

const TYPE_THEME: Record<EventType, { text: string; border: string; bg: string; glow: string; dot: string }> = {
  rencontre: { text: 'text-neon-violet', border: 'border-neon-violet/40', bg: 'bg-neon-violet/10', glow: 'shadow-[0_0_24px_rgba(139,92,246,0.18)]', dot: 'bg-neon-violet' },
  gaming: { text: 'text-crimson', border: 'border-crimson/40', bg: 'bg-crimson/10', glow: 'shadow-[0_0_24px_rgba(255,31,61,0.18)]', dot: 'bg-crimson' },
  lecture: { text: 'text-neon-gold', border: 'border-neon-gold/40', bg: 'bg-neon-gold/10', glow: 'shadow-[0_0_24px_rgba(255,176,32,0.18)]', dot: 'bg-neon-gold' },
  concours: { text: 'text-neon-magenta', border: 'border-neon-magenta/40', bg: 'bg-neon-magenta/10', glow: 'shadow-[0_0_24px_rgba(255,46,136,0.18)]', dot: 'bg-neon-magenta' },
};

const CONFETTI = [
  { top: '12%', left: '8%', color: 'bg-crimson', rot: '12deg', size: 'w-3 h-3' },
  { top: '22%', left: '85%', color: 'bg-neon-gold', rot: '-18deg', size: 'w-2.5 h-2.5' },
  { top: '65%', left: '5%', color: 'bg-neon-violet', rot: '30deg', size: 'w-2 h-2' },
  { top: '75%', left: '92%', color: 'bg-neon-magenta', rot: '-8deg', size: 'w-3 h-3' },
  { top: '8%', left: '45%', color: 'bg-neon-gold', rot: '20deg', size: 'w-2 h-2' },
  { top: '85%', left: '55%', color: 'bg-crimson', rot: '-25deg', size: 'w-2.5 h-2.5' },
  { top: '40%', left: '92%', color: 'bg-neon-violet', rot: '10deg', size: 'w-2 h-2' },
  { top: '50%', left: '3%', color: 'bg-neon-magenta', rot: '-15deg', size: 'w-2.5 h-2.5' },
];

function EventCard({ event, featured = false }: { event: (typeof OTAKU_EVENTS)[number]; featured?: boolean }) {
  const theme = TYPE_THEME[event.type];
  const date = new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={`relative rounded-3xl border ${theme.border} ${theme.glow} bg-void-2/70 backdrop-blur-sm overflow-hidden flex flex-col ${featured ? 'p-7' : 'p-5'}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${theme.dot}`} />

      <span className={`inline-flex items-center gap-1.5 text-[10px] font-hud font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 self-start ${theme.bg} ${theme.text} border ${theme.border}`}>
        {TYPE_ICON[event.type]}
        {EVENT_TYPE_LABEL[event.type]}
      </span>

      <h3 className={`font-display text-white leading-snug mb-2 ${featured ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>{event.title}</h3>
      <p className={`text-slate-400 leading-relaxed mb-4 flex-1 ${featured ? 'text-sm' : 'text-xs'}`}>{event.description}</p>

      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-hud uppercase tracking-wide">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{date}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
      </div>
    </div>
  );
}

export default function EvenementsPage() {
  const [filter, setFilter] = useState<EventType | 'tous'>('tous');
  const sorted = [...OTAKU_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  const [next, ...rest] = sorted;
  const filtered = filter === 'tous' ? rest : rest.filter((e) => e.type === filter);

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-40" />
        <GamingGlyphsWatermark />
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={`absolute ${c.color} ${c.size} rounded-sm opacity-70`}
            style={{ top: c.top, left: c.left, transform: `rotate(${c.rot})` }}
          />
        ))}
        <div className="relative max-w-4xl mx-auto px-4 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs font-hud font-bold uppercase tracking-wider mb-5">
            <ImpactBurstIcon className="w-3.5 h-3.5" />
            Communauté en mouvement
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">Événements Otaku</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Rencontres, gaming, lecture, concours — retrouve la communauté otaku partout au Cameroun.
          </p>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Spotlight: next event */}
        <div className="mb-10">
          <p className="text-[11px] font-hud font-bold uppercase tracking-widest text-neon-gold mb-3">Prochain événement</p>
          <EventCard event={next} featured />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(['tous', 'rencontre', 'gaming', 'lecture', 'concours'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-full text-xs font-hud font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                filter === t
                  ? 'bg-crimson text-white border-crimson'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {t === 'tous' ? 'Tous' : EVENT_TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
