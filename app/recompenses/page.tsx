'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../lib/AppContext';
import { BADGES, BadgeIconKey, BadgeColor } from '../../data/badges';
import { badgeProgress, isBadgeUnlocked } from '../../lib/badges';
import { shareOtakuCard } from '../../lib/shareCard';
import { Panel } from '../../components/ui/Panel';
import { NeonButton } from '../../components/ui/NeonButton';
import {
  MedalIcon, KatanaIcon, ImpactBurstIcon, LightningIcon, ToriiIcon, OniMaskIcon, ScrollIcon,
} from '../../components/ui/icons/OtakuIcons';
import { Lock, Share2 } from 'lucide-react';

const ICONS: Record<BadgeIconKey, React.ComponentType<{ className?: string }>> = {
  medal: MedalIcon,
  katana: KatanaIcon,
  burst: ImpactBurstIcon,
  lightning: LightningIcon,
  torii: ToriiIcon,
  mask: OniMaskIcon,
  scroll: ScrollIcon,
};

const COLOR_CLASS: Record<BadgeColor, { text: string; border: string; bg: string }> = {
  crimson: { text: 'text-crimson', border: 'border-crimson/40', bg: 'bg-crimson/10' },
  gold: { text: 'text-neon-gold', border: 'border-neon-gold/40', bg: 'bg-neon-gold/10' },
  violet: { text: 'text-neon-violet', border: 'border-neon-violet/40', bg: 'bg-neon-violet/10' },
  magenta: { text: 'text-neon-magenta', border: 'border-neon-magenta/40', bg: 'bg-neon-magenta/10' },
};

export default function RecompensesPage() {
  const { user } = useAppContext();
  const [sharing, setSharing] = useState<string | null>(null);

  if (!user) {
    return <div className="max-w-lg mx-auto px-4 py-20 text-center text-slate-400">Chargement...</div>;
  }

  const unlockedCount = BADGES.filter((b) => isBadgeUnlocked(b, user)).length;

  const handleShareBadge = async (name: string, color: string) => {
    setSharing(name);
    await shareOtakuCard({ title: name, subtitle: 'Badge débloqué', username: user.username, color });
    setSharing(null);
  };

  const handleShareProfile = async () => {
    setSharing('profile');
    await shareOtakuCard({
      title: user.username,
      subtitle: `${unlockedCount} badges débloqués — ${user.totalScore || 0} pts`,
      username: user.username,
      color: 'crimson',
    });
    setSharing(null);
  };

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-60" />
        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 clip-corner-sm bg-neon-gold/10 border border-neon-gold/40 text-neon-gold text-xs font-hud font-bold uppercase tracking-wider mb-5">
            <MedalIcon className="w-3.5 h-3.5" />
            {unlockedCount} / {BADGES.length} débloqués
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">Badges & Cartes</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Débloque des cartes en jouant aux quiz et partage tes exploits avec la communauté.
          </p>
          <NeonButton variant="primary" onClick={handleShareProfile} disabled={sharing === 'profile'}>
            <Share2 className="w-4 h-4" />
            {sharing === 'profile' ? 'Préparation...' : 'Partager mon profil'}
          </NeonButton>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const Icon = ICONS[badge.icon];
            const unlocked = isBadgeUnlocked(badge, user);
            const progress = badgeProgress(badge, user);
            const theme = COLOR_CLASS[badge.color];

            return (
              <Panel
                key={badge.id}
                glow={unlocked ? badge.color : 'neutral'}
                className={`p-5 text-center flex flex-col ${unlocked ? '' : 'opacity-60'}`}
              >
                <div className={`w-14 h-14 mx-auto mb-3 clip-corner-sm flex items-center justify-center border ${unlocked ? `${theme.bg} ${theme.border} ${theme.text}` : 'bg-white/5 border-white/10 text-slate-600'}`}>
                  {unlocked ? <Icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{badge.description}</p>

                {!unlocked && (
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${theme.bg.replace('/10', '')}`} style={{ width: `${progress * 100}%` }} />
                  </div>
                )}

                {unlocked && (
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShareBadge(badge.name, badge.color)}
                    disabled={sharing === badge.name}
                    className="w-full"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {sharing === badge.name ? 'Préparation...' : 'Partager'}
                  </NeonButton>
                )}
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
