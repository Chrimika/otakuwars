'use client';

import React, { useState } from 'react';
import { UserProfile } from '../lib/types';
import { OTAKU_AVATARS, getAvatarById } from '../data/avatars';
import { saveUserProfileToFirestore } from '../lib/gameService';
import { X, Trophy, Flame, Target, Check, LogOut } from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose, onUpdate, onLogout }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [otakuTitle, setOtakuTitle] = useState(user?.otakuTitle || '');
  const [avatarId, setAvatarId] = useState(user?.avatarId || OTAKU_AVATARS[0].id);
  const [favoriteAnime, setFavoriteAnime] = useState(user?.favoriteAnime || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen || !user) return null;

  const currentAvatar = getAvatarById(avatarId);
  const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      username: username.trim() || user.username,
      otakuTitle: otakuTitle.trim() || currentAvatar.title,
      avatarId,
      favoriteAnime: favoriteAnime.trim() || user.favoriteAnime,
    };
    await saveUserProfileToFirestore(updated);
    localStorage.setItem('otakuwars_user', JSON.stringify(updated));
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile header */}
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/8">
          <div className="w-14 h-14 rounded-xl p-0.5 shrink-0" style={{ backgroundColor: currentAvatar.accentColor }}>
            <div
              className="w-full h-full rounded-[10px] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
              dangerouslySetInnerHTML={{ __html: currentAvatar.avatarSvg }}
            />
          </div>
          <div>
            <p className="font-black text-white text-base">{user.username}</p>
            <p className="text-xs text-violet-400">{user.otakuTitle}</p>
            {user.isGuest && (
              <span className="text-[10px] text-amber-400 font-semibold">Mode Invité</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: <Trophy className="w-4 h-4 text-amber-400" />, val: user.wins, label: 'Victoires' },
            { icon: <Target className="w-4 h-4 text-violet-400" />, val: `${winRate}%`, label: 'Win rate' },
            { icon: <Flame className="w-4 h-4 text-pink-400" />, val: user.totalScore, label: 'Points' },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-base font-black text-white">{s.val}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

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
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          ))}

          {/* Avatar */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Avatar</label>
            <div className="grid grid-cols-5 gap-1.5 p-2 bg-white/[0.02] rounded-xl border border-white/8 max-h-36 overflow-y-auto">
              {OTAKU_AVATARS.map((av) => {
                const sel = avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => { setAvatarId(av.id); if (!otakuTitle || otakuTitle === currentAvatar.title) setOtakuTitle(av.title); }}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${sel ? 'border-violet-500 bg-violet-950/60 scale-105' : 'border-white/8 hover:border-white/20'}`}
                  >
                    <div className="w-8 h-8 rounded-full p-0.5 mx-auto overflow-hidden" style={{ backgroundColor: av.accentColor }}>
                      <div className="w-full h-full rounded-full bg-[#0a0a0f]" dangerouslySetInnerHTML={{ __html: av.avatarSvg }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs">
              <Check className="w-4 h-4 shrink-0" /> Profil enregistré dans Firestore !
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-800/40 text-slate-400 hover:text-red-400 font-semibold text-sm transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Déco.
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
