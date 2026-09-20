'use client';

import React, { useEffect } from 'react';
import { GameRoom, UserProfile } from '../lib/types';
import { getAvatarById } from '../data/avatars';
import { recordMatchResults } from '../lib/gameService';
import { soundFx } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { MedalIcon } from './ui/icons/OtakuIcons';

const RANK_COLOR: Record<number, string> = {
  0: 'text-neon-gold',
  1: 'text-neon-violet',
  2: 'text-neon-magenta',
};

interface LeaderboardProps {
  room: GameRoom;
  user: UserProfile;
  onRematch: () => void;
  onHome: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

const RANK_GLOW: Record<number, string> = {
  0: 'border-neon-gold/60 bg-neon-gold/10 shadow-[0_0_24px_rgba(255,204,51,0.15)]',
  1: 'border-crimson/50 bg-crimson/5 shadow-[0_0_20px_rgba(0,229,255,0.12)]',
  2: 'border-neon-magenta/50 bg-neon-magenta/5 shadow-[0_0_20px_rgba(255,46,136,0.12)]',
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ room, user, onRematch, onHome, onUpdateUser }) => {
  useEffect(() => {
    soundFx.playVictory();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch { /* ignore */ }

    if (room && user && !user.isGuest) {
      recordMatchResults(room, user).then((updated) => {
        if (onUpdateUser) onUpdateUser(updated);
      });
    }
  }, [room, user, onUpdateUser]);

  const players = Object.values(room.players || {}).sort((a, b) => b.score - a.score);


  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="clip-corner-sm w-14 h-14 bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-7 h-7 text-neon-gold animate-bounce" />
        </div>
        <h1 className="text-2xl font-display font-black text-white">Classement final</h1>
        <p className="text-xs text-slate-500 mt-1">{room.name} — {room.totalQuestions} questions</p>
      </div>

      {/* Scores */}
      <div className="space-y-2 mb-8">
        {players.map((p, idx) => {
          const av = getAvatarById(p.avatarId);
          const isMe = p.uid === user.uid;
          return (
            <div
              key={p.uid}
              className={`flex items-center gap-3 p-4 clip-corner-sm border transition-all ${
                RANK_GLOW[idx] || (isMe ? 'bg-crimson/5 border-crimson/40' : 'bg-white/[0.02] border-white/8')
              }`}
            >
              <span className="w-8 flex items-center justify-center shrink-0">
                {idx < 3 ? (
                  <MedalIcon className={`w-6 h-6 ${RANK_COLOR[idx]}`} />
                ) : (
                  <span className="text-sm font-hud font-bold text-slate-500">#{idx + 1}</span>
                )}
              </span>

              <div className="clip-corner-sm w-10 h-10 p-0.5 shrink-0" style={{ backgroundColor: av.accentColor }}>
                <div
                  className="clip-corner-sm w-full h-full bg-void flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm truncate">{p.username}</span>
                  {isMe && <span className="text-[10px] text-crimson">(vous)</span>}
                </div>
                <span className="text-xs text-slate-500">{p.otakuTitle}</span>
              </div>

              <span className={`font-display font-black text-lg shrink-0 ${idx === 0 ? 'text-neon-gold' : 'text-white'}`}>
                {p.score}
                <span className="text-xs font-normal text-slate-500 ml-0.5">pts</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <NeonButton variant="primary" className="flex-1" onClick={onRematch}>
          <RefreshCw className="w-4 h-4" /> Rejouer
        </NeonButton>
        <NeonButton variant="ghost" className="flex-1" onClick={onHome}>
          <Home className="w-4 h-4" /> Accueil
        </NeonButton>
      </div>
    </div>
  );
};
