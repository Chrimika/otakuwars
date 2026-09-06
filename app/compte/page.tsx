'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../lib/AppContext';
import { UserProfile } from '../../lib/types';
import { OTAKU_AVATARS, getAvatarById } from '../../data/avatars';
import { saveUserProfileToFirestore } from '../../lib/gameService';
import { NeonButton } from '../../components/ui/NeonButton';
import { Panel } from '../../components/ui/Panel';
import { KatanaIcon, ScrollIcon, HeartIcon } from '../../components/ui/icons/OtakuIcons';
import { Trophy, Target, Flame, Check, LogOut, Camera, Award } from 'lucide-react';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-violet focus:outline-none focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all';

export default function ComptePage() {
  const { user, setUser } = useAppContext();
  const router = useRouter();

  if (!user) {
    return <div className="max-w-lg mx-auto px-4 py-20 text-center text-slate-400">Chargement du profil...</div>;
  }

  return <AccountForm user={user} onUpdate={setUser} onLogout={() => {
    localStorage.removeItem('otakuwars_user');
    setUser(null);
    router.push('/');
  }} />;
}

function AccountForm({ user, onUpdate, onLogout }: { user: UserProfile; onUpdate: (u: UserProfile) => void; onLogout: () => void }) {
  const [username, setUsername] = useState(user.username || '');
  const [otakuTitle, setOtakuTitle] = useState(user.otakuTitle || '');
  const [avatarId, setAvatarId] = useState(user.avatarId || OTAKU_AVATARS[0].id);
  const [favoriteAnime, setFavoriteAnime] = useState(user.favoriteAnime || '');
  const [useCustomAvatar, setUseCustomAvatar] = useState(!!user.customAvatarDataUrl);
  const [saved, setSaved] = useState(false);

  const currentAvatar = getAvatarById(avatarId);
  const gamesPlayed = user.gamesPlayed || 0;
  const wins = user.wins || 0;
  const totalScore = user.totalScore || 0;
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      username: username.trim() || user.username,
      otakuTitle: otakuTitle.trim() || currentAvatar.title,
      avatarId,
      favoriteAnime: favoriteAnime.trim() || user.favoriteAnime,
      customAvatarDataUrl: useCustomAvatar ? user.customAvatarDataUrl : undefined,
    };
    await saveUserProfileToFirestore(updated);
    localStorage.setItem('otakuwars_user', JSON.stringify(updated));
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl text-ink mb-8 text-center">Mon compte</h1>

      <div className="grid sm:grid-cols-[280px_1fr] gap-6">
        {/* Colonne gauche : identité + stats */}
        <div className="space-y-4">
          <Panel glow="violet" className="p-6 text-center">
            {useCustomAvatar && user.customAvatarDataUrl ? (
              <img src={user.customAvatarDataUrl} alt={user.username} className="clip-corner w-24 h-24 object-cover mx-auto mb-4" />
            ) : (
              <div className="clip-corner w-24 h-24 p-1 mx-auto mb-4" style={{ backgroundColor: currentAvatar.accentColor }}>
                <div
                  className="clip-corner w-full h-full bg-void flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: currentAvatar.avatarSvg }}
                />
              </div>
            )}
            <p className="font-display text-xl text-white">{user.username}</p>
            <p className="text-xs text-neon-violet mb-1">{user.otakuTitle}</p>
            {user.isGuest && <span className="text-[10px] text-neon-gold font-semibold">Mode Invité</span>}

            <Link href="/auth/avatar" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-hud font-bold uppercase tracking-wide text-slate-400 hover:text-crimson transition-colors">
              <Camera className="w-3.5 h-3.5" /> Régénérer mon avatar photo
            </Link>
          </Panel>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Trophy className="w-4 h-4 text-neon-gold" />, val: wins, label: 'Victoires' },
              { icon: <KatanaIcon className="w-4 h-4 text-crimson" />, val: gamesPlayed, label: 'Parties' },
              { icon: <Target className="w-4 h-4 text-neon-violet" />, val: `${winRate}%`, label: 'Win rate' },
              { icon: <Flame className="w-4 h-4 text-neon-magenta" />, val: totalScore, label: 'Points' },
            ].map((s) => (
              <div key={s.label} className="p-3 clip-corner-sm bg-white/[0.03] border border-white/8 text-center">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <p className="text-base font-display font-black text-white">{s.val}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          <Link href="/recompenses" className="flex items-center gap-2 p-3 clip-corner-sm bg-neon-gold/10 border border-neon-gold/30 text-neon-gold text-xs font-hud font-bold uppercase tracking-wide hover:bg-neon-gold/15 transition-all">
            <Award className="w-4 h-4" /> Voir mes badges & cartes
          </Link>
        </div>

        {/* Colonne droite : édition */}
        <Panel glow="neutral" className="p-6">
          <form onSubmit={handleSave} className="space-y-3">
            {[
              { label: 'Pseudo', val: username, set: setUsername, placeholder: 'Votre pseudo' },
              { label: 'Titre Otaku', val: otakuTitle, set: setOtakuTitle, placeholder: 'Ex: Roi des Pirates' },
              { label: 'Anime préféré', val: favoriteAnime, set: setFavoriteAnime, placeholder: 'Ex: One Piece' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{f.label}</label>
                <input
                  type="text"
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <ScrollIcon className="w-3.5 h-3.5" /> Avatar
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-2 bg-white/[0.02] rounded-xl border border-white/8">
                {OTAKU_AVATARS.map((av) => {
                  const sel = !useCustomAvatar && avatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { setAvatarId(av.id); setUseCustomAvatar(false); if (!otakuTitle || otakuTitle === currentAvatar.title) setOtakuTitle(av.title); }}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${sel ? 'border-neon-violet bg-neon-violet/10 scale-105' : 'border-white/8 hover:border-white/20'}`}
                    >
                      <div className="w-8 h-8 rounded-full p-0.5 mx-auto overflow-hidden" style={{ backgroundColor: av.accentColor }}>
                        <div className="w-full h-full rounded-full bg-void" dangerouslySetInnerHTML={{ __html: av.avatarSvg }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {saved && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs">
                <Check className="w-4 h-4 shrink-0" /> Profil enregistré !
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <NeonButton type="submit" variant="secondary" className="flex-1">
                Enregistrer
              </NeonButton>
              <NeonButton type="button" variant="danger" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
                Déconnexion
              </NeonButton>
            </div>
          </form>
        </Panel>
      </div>

      <p className="text-center text-[11px] text-slate-600 mt-8 flex items-center justify-center gap-1.5">
        <HeartIcon className="w-3.5 h-3.5" /> Merci de faire partie de l&apos;arène otaku.
      </p>
    </div>
  );
}
