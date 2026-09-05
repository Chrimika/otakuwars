'use client';

import React, { useState } from 'react';
import { UserProfile } from '../lib/types';
import { OTAKU_AVATARS, getAvatarById } from '../data/avatars';
import { X, Trophy, Flame, Target, Sparkles, Check, LogOut } from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
  onLogout,
}) => {
  const [username, setUsername] = useState(user?.username || '');
  const [otakuTitle, setOtakuTitle] = useState(user?.otakuTitle || '');
  const [avatarId, setAvatarId] = useState(user?.avatarId || OTAKU_AVATARS[0].id);
  const [favoriteAnime, setFavoriteAnime] = useState(user?.favoriteAnime || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const currentAvatar = getAvatarById(avatarId);
  const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      username: username.trim() || user.username,
      otakuTitle: otakuTitle.trim() || currentAvatar.title,
      avatarId,
      favoriteAnime: favoriteAnime.trim() || user.favoriteAnime,
    };

    localStorage.setItem('otakuwars_user', JSON.stringify(updated));
    onUpdate(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-800/40">
          <div
            className="w-16 h-16 rounded-2xl p-1 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: currentAvatar.accentColor }}
          >
            <div
              className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: currentAvatar.avatarSvg }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">{user.username}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {currentAvatar.badge}
              </span>
            </div>
            <p className="text-xs text-purple-400 font-medium">{user.otakuTitle}</p>
            <p className="text-[11px] text-slate-400 mt-1">Anime favori: {user.favoriteAnime || 'N/A'}</p>
          </div>
        </div>

        {/* Player Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">{user.wins}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Victoires</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Target className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">{winRate}%</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Taux de Win</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Flame className="w-5 h-5 text-pink-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">{user.totalScore}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Points Totaux</span>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Pseudo du Joueur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Titre / Rang Otaku Personnalisé
            </label>
            <input
              type="text"
              value={otakuTitle}
              onChange={(e) => setOtakuTitle(e.target.value)}
              placeholder="Ex: Rang-S Hunter, Hokage, Roi des Pirates..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Anime Préféré
            </label>
            <input
              type="text"
              value={favoriteAnime}
              onChange={(e) => setFavoriteAnime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Change Avatar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Changer d\'Avatar Otaku
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {OTAKU_AVATARS.map((av) => {
                const isSelected = avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setAvatarId(av.id);
                      if (!otakuTitle || otakuTitle === currentAvatar.title) {
                        setOtakuTitle(av.title);
                      }
                    }}
                    className={`relative p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/80 shadow-lg shadow-purple-500/40 scale-105'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 overflow-hidden"
                      style={{ backgroundColor: av.accentColor }}
                    >
                      <div
                        className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-medium">
              <Check className="w-4 h-4 text-emerald-400" />
              Modifications de profil enregistrées avec succès !
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              Enregistrer mon Profil
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
