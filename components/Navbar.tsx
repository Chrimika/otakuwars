'use client';

import React from 'react';
import { UserProfile } from '../lib/types';
import { getAvatarById } from '../data/avatars';
import { Flame, Plus, LogIn, KeyRound, Sparkles } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCreateRoom: () => void;
  onOpenJoinRoom: () => void;
  onOpenFirebaseConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenCreateRoom,
  onOpenJoinRoom,
}) => {
  const avatar = user ? getAvatarById(user.avatarId) : null;
  const isLoggedIn = user && !user.isGuest;

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

        {/* Logo */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-base tracking-wide text-white hidden sm:block">
            OTAKU WARS
          </span>
        </button>

        {/* Center actions (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenCreateRoom}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Créer un salon
          </button>
          <button
            onClick={onOpenJoinRoom}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-xs transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-violet-400" />
            Rejoindre
          </button>
        </div>

        {/* Right: user or login */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/8 border border-white/10 transition-all cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-full p-0.5 overflow-hidden"
                style={{ backgroundColor: avatar?.accentColor || '#7c3aed' }}
              >
                <div
                  className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: avatar?.avatarSvg || '' }}
                />
              </div>
              <span className="text-xs font-semibold text-white hidden sm:block max-w-[100px] truncate">
                {user!.username}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Se connecter</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="md:hidden flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
        <button
          onClick={onOpenCreateRoom}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Créer un salon
        </button>
        <button
          onClick={onOpenJoinRoom}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium text-xs transition-all cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-violet-400" />
          Rejoindre
        </button>
      </div>
    </header>
  );
};
