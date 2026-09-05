'use client';

import React, { useEffect } from 'react';
import { GameRoom, UserProfile } from '../lib/types';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Home } from 'lucide-react';

interface LeaderboardProps {
  room: GameRoom;
  user: UserProfile;
  onRematch: () => void;
  onHome: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ room, user, onRematch, onHome }) => {
  useEffect(() => {
    soundFx.playVictory();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch { /* ignore */ }
  }, []);

  const players = Object.values(room.players || {}).sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-7 h-7 text-amber-400 animate-bounce" />
        </div>
        <h1 className="text-2xl font-black text-white">Classement final</h1>
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
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-amber-950/30 border-amber-700/40'
                  : isMe
                  ? 'bg-violet-950/30 border-violet-700/40'
                  : 'bg-white/[0.02] border-white/8'
              }`}
            >
              <span className="text-lg w-8 text-center shrink-0">{medals[idx] || `#${idx + 1}`}</span>

              <div className="w-10 h-10 rounded-xl p-0.5 shrink-0" style={{ backgroundColor: av.accentColor }}>
                <div
                  className="w-full h-full rounded-[9px] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm truncate">{p.username}</span>
                  {isMe && <span className="text-[10px] text-violet-400">(vous)</span>}
                </div>
                <span className="text-xs text-slate-500">{p.otakuTitle}</span>
              </div>

              <span className={`font-black text-lg shrink-0 ${idx === 0 ? 'text-amber-400' : 'text-white'}`}>
                {p.score}
                <span className="text-xs font-normal text-slate-500 ml-0.5">pts</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRematch}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Rejouer
        </button>
        <button
          onClick={onHome}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" /> Accueil
        </button>
      </div>
    </div>
  );
};
