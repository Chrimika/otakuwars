'use client';

import React from 'react';
import { UserProfile } from '../lib/types';
import { getAvatarById } from '../data/avatars';
import { Shield, Sparkles, User, Flame, Database, Plus, LogIn } from 'lucide-react';
import { getFirebaseInstance } from '../lib/firebase';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCreateRoom: () => void;
  onOpenJoinRoom: () => void;
  onOpenFirebaseConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenCreateRoom,
  onOpenJoinRoom,
  onOpenFirebaseConfig,
}) => {
  const avatar = user ? getAvatarById(user.avatarId) : null;
  const { isConfigured } = getFirebaseInstance();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-purple-900/40 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                OTAKU WARS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/50">
                QUIZ LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">L\'arène ultime des passionnés d\'Animes</p>
          </div>
        </div>

        {/* Center / Quick Room Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenCreateRoom}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 hover:shadow-purple-500/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer un Salon
          </button>
          <button
            onClick={onOpenJoinRoom}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm transition-all cursor-pointer"
          >
            Rejoindre
          </button>
        </div>

        {/* Right Section: Firebase Status + User Profile */}
        <div className="flex items-center gap-3">
          {/* Firebase Connection Status Button */}
          <button
            onClick={onOpenFirebaseConfig}
            title={isConfigured ? 'Firebase Connecté en Temps Réel' : 'Cliquez pour configurer votre projet Firebase'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              isConfigured
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isConfigured ? 'Firebase Actif' : 'Firebase Sync'}</span>
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          </button>

          {/* User Profile Info or Sign-in button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-900/90 border border-purple-500/30 hover:border-purple-400/60 hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div
                className="w-9 h-9 rounded-full p-0.5 flex items-center justify-center overflow-hidden shadow-inner"
                style={{ backgroundColor: avatar?.accentColor || '#8b5cf6' }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center bg-slate-950"
                  dangerouslySetInnerHTML={{ __html: avatar?.avatarSvg || '' }}
                />
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
                    {user.username}
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[11px] text-purple-400 block -mt-0.5 truncate max-w-[120px]">
                  {user.otakuTitle}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Se Connecter / S\'inscrire
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
