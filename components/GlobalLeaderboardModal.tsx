'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile } from '../lib/types';
import { getGlobalLeaderboard } from '../lib/gameService';
import { getAvatarById } from '../data/avatars';
import { X, Trophy, Target, Flame, RefreshCw, Crown } from 'lucide-react';
import { Panel } from './ui/Panel';
import { MedalIcon } from './ui/icons/OtakuIcons';

const RANK_COLOR: Record<number, string> = {
  0: 'text-neon-gold',
  1: 'text-neon-violet',
  2: 'text-neon-magenta',
};

interface GlobalLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
}

export const GlobalLeaderboardModal: React.FC<GlobalLeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const data = await getGlobalLeaderboard(50);
    setLeaderboard(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md animate-fade-in">
      <Panel glow="gold" className="w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 clip-corner-sm w-9 h-9 flex items-center justify-center bg-white/5 border border-neon-gold/20 hover:border-neon-gold/60 text-slate-400 hover:text-neon-gold transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="clip-corner-sm w-12 h-12 bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-neon-gold" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white flex items-center gap-2">
              Classement Général Otaku
              <Crown className="w-5 h-5 text-neon-gold shrink-0" />
            </h2>
            <p className="text-xs text-slate-400">Les meilleurs combattants de l&apos;arène OTAKU WARS</p>
          </div>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="ml-auto p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-400">Chargement du classement...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <Trophy className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 text-sm font-semibold">Aucun joueur classé pour le moment</p>
            <p className="text-slate-600 text-xs mt-1">Jouez des parties pour apparaître en tête du classement !</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            {leaderboard.map((player, idx) => {
              const av = getAvatarById(player.avatarId);
              const isMe = currentUser?.uid === player.uid;
              const gamesPlayed = player.gamesPlayed || 0;
              const wins = player.wins || 0;
              const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

              let rankStyle = 'bg-white/[0.02] border-white/8';
              if (idx === 0) rankStyle = 'bg-neon-gold/10 border-neon-gold/50 shadow-[0_0_20px_rgba(255,204,51,0.15)]';
              else if (idx === 1) rankStyle = 'bg-crimson/5 border-crimson/40 shadow-[0_0_16px_rgba(0,229,255,0.1)]';
              else if (idx === 2) rankStyle = 'bg-neon-magenta/5 border-neon-magenta/40 shadow-[0_0_16px_rgba(255,46,136,0.1)]';
              else if (isMe) rankStyle = 'bg-neon-violet/10 border-neon-violet/50';

              return (
                <div
                  key={player.uid || idx}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 clip-corner-sm border transition-all ${rankStyle}`}
                >
                  {/* Rank badge */}
                  <span className="w-8 flex items-center justify-center shrink-0">
                    {idx < 3 ? (
                      <MedalIcon className={`w-6 h-6 ${RANK_COLOR[idx]}`} />
                    ) : (
                      <span className="text-sm font-hud font-bold text-slate-500">#{idx + 1}</span>
                    )}
                  </span>

                  {/* Avatar */}
                  <div
                    className="clip-corner-sm w-10 h-10 p-0.5 shrink-0"
                    style={{ backgroundColor: av.accentColor }}
                  >
                    <div
                      className="clip-corner-sm w-full h-full bg-void flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                    />
                  </div>

                  {/* Name and title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">{player.username}</span>
                      {isMe && (
                        <span className="text-[10px] font-black text-neon-violet bg-neon-violet/15 px-2 py-0.5 rounded-full border border-neon-violet/40 shrink-0">
                          VOUS
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 truncate block">{player.otakuTitle || av.title}</span>
                  </div>

                  {/* Stats columns */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-right">
                    {/* Wins */}
                    <div className="text-center min-w-[50px]">
                      <span className="text-sm sm:text-base font-black text-neon-gold flex items-center justify-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-neon-gold" />
                        {wins}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block">
                        Victoire{wins > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Win rate */}
                    <div className="text-center min-w-[45px] hidden sm:block">
                      <span className="text-xs font-bold text-neon-violet flex items-center justify-center gap-0.5">
                        <Target className="w-3 h-3 text-neon-violet" />
                        {winRate}%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block">
                        Ratio
                      </span>
                    </div>

                    {/* Total score */}
                    <div className="text-center min-w-[60px]">
                      <span className="text-sm sm:text-base font-black text-white flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-neon-magenta" />
                        {player.totalScore || 0}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
};
