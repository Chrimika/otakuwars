import React from 'react';
import { Panel } from '../../components/ui/Panel';
import { KatanaIcon, ScrollIcon, ToriiIcon, ImpactBurstIcon } from '../../components/ui/icons/OtakuIcons';
import { getAvatarById } from '../../data/avatars';
import { CONTRIBUTORS } from '../../data/contributors';
import { WhatsAppGlyphIcon, LinkedInGlyphIcon, TikTokGlyphIcon } from '../../components/ui/icons/OtakuIcons';
import { Users, Trophy, BookOpen, Calendar } from 'lucide-react';

const STATS = [
  { icon: <Users className="w-5 h-5 text-crimson" />, val: '1000+', label: 'Otakus inscrits' },
  { icon: <Trophy className="w-5 h-5 text-neon-gold" />, val: '50+', label: 'Salons joués / semaine' },
  { icon: <BookOpen className="w-5 h-5 text-neon-violet" />, val: '10+', label: 'Œuvres africaines' },
  { icon: <Calendar className="w-5 h-5 text-neon-magenta" />, val: '8', label: 'Événements à venir' },
];

export default function AProposPage() {
  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-60" />
        <div className="speed-lines opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 clip-corner-sm bg-crimson/10 border border-crimson/40 text-crimson text-xs font-hud font-bold uppercase tracking-wider mb-5">
            <ImpactBurstIcon className="w-3.5 h-3.5" />
            Notre histoire
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">À propos d&apos;Otaku Wars</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Otaku Wars est né d&apos;une conviction simple : la communauté otaku africaine mérite sa propre arène —
            un endroit pour jouer, se rencontrer et faire rayonner ses propres œuvres.
          </p>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Mission */}
        <section className="grid sm:grid-cols-2 gap-6 mb-16">
          <Panel glow="crimson" className="p-6">
            <div className="w-10 h-10 clip-corner-sm bg-crimson/10 border border-crimson/40 text-crimson flex items-center justify-center mb-3">
              <KatanaIcon className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl text-white mb-2">Notre mission</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Offrir à chaque passionné d&apos;anime et de manga un espace pour jouer en temps réel, découvrir des
              événements près de chez lui, et faire découvrir des œuvres illustrées africaines encore trop peu visibles.
            </p>
          </Panel>
          <Panel glow="gold" className="p-6">
            <div className="w-10 h-10 clip-corner-sm bg-neon-gold/10 border border-neon-gold/40 text-neon-gold flex items-center justify-center mb-3">
              <ToriiIcon className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl text-white mb-2">Notre communauté</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Des centaines d&apos;otakus se retrouvent chaque semaine sur Otaku Wars pour s&apos;affronter en quiz,
              partager leur top manga et se croiser lors de rencontres organisées dans plusieurs villes.
            </p>
          </Panel>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {STATS.map((s) => (
            <Panel key={s.label} glow="neutral" className="p-4 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="font-display text-2xl text-white">{s.val}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-hud">{s.label}</p>
            </Panel>
          ))}
        </section>

        {/* Contributeurs */}
        <section>
          <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5 flex items-center gap-2">
            <ScrollIcon className="w-4 h-4 text-neon-gold" />
            L&apos;équipe & les contributeurs
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTRIBUTORS.map((c) => {
              const av = getAvatarById(c.avatarId);
              return (
                <Panel key={c.name + c.role} glow="violet" brackets={false} className="overflow-hidden flex flex-col">
                  {/* Portrait */}
                  <div
                    className="relative aspect-[3/4] flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${av.accentColor}22` }}
                  >
                    <div className="manga-halftone opacity-30" />
                    <div
                      className="relative w-[70%] h-[70%]"
                      dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                    />
                  </div>

                  {/* Infos */}
                  <div className="p-4 text-center flex flex-col flex-1">
                    <h3 className="font-bold text-white text-sm">{c.name}</h3>
                    <p className="text-[11px] text-neon-violet font-hud uppercase tracking-wide mb-2">{c.role}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{c.bio}</p>
                    <div className="flex items-center justify-center gap-2">
                      {c.socials.whatsapp && (
                        <a href={c.socials.whatsapp} title="WhatsApp" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-crimson hover:border-crimson/40 transition-all">
                          <WhatsAppGlyphIcon className="w-4 h-4" />
                        </a>
                      )}
                      {c.socials.linkedin && (
                        <a href={c.socials.linkedin} title="LinkedIn" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-crimson hover:border-crimson/40 transition-all">
                          <LinkedInGlyphIcon className="w-4 h-4" />
                        </a>
                      )}
                      {c.socials.tiktok && (
                        <a href={c.socials.tiktok} title="TikTok" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-crimson hover:border-crimson/40 transition-all">
                          <TikTokGlyphIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
          <p className="text-xs text-slate-600 mt-4 text-center">
            Certains profils sont encore à définir — l&apos;équipe s&apos;agrandit avec la communauté.
          </p>
        </section>
      </div>
    </div>
  );
}
