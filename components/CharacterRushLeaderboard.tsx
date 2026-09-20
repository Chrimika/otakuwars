'use client';

import React, { useEffect, useState } from 'react';
import { CharacterRushRoom, UserProfile, CharacterRushScoreSummary } from '../lib/types';
import { getAvatarById } from '../data/avatars';
import {
  calculateCharacterRushLeaderboard,
  recordCharacterRushResults,
} from '../lib/characterRushService';
import { soundFx } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Home, Zap, Target, Award, TrendingUp } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';
import { MedalIcon } from './ui/icons/OtakuIcons';

const RANK_COLOR: Record<number, string> = {
  0: 'text-neon-gold',
  1: 'text-slate-300',
  2: 'text-amber-600',
};

const RANK_GLOW: Record<number, string> = {
  0: 'border-neon-gold/60 bg-neon-gold/10 shadow-[0_0_24px_rgba(255,204,51,0.15)]',
  1: 'border-slate-400/50 bg-slate-400/5 shadow-[0_0_20px_rgba(203,213,225,0.12)]',
  2: 'border-amber-600/50 bg-amber-600/5 shadow-[0_0_20px_rgba(217,119,6,0.12)]',
};

interface CharacterRushLeaderboardProps {
  room: CharacterRushRoom;
  user: UserProfile;
  onRematch: () => void;
  onHome: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const CharacterRushLeaderboard: React.FC<CharacterRushLeaderboardProps> = ({
  room,
  user,
  onRematch,
  onHome,
  onUpdateUser,
}) => {
  const [leaderboard, setLeaderboard] = useState<CharacterRushScoreSummary[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<CharacterRushScoreSummary | null>(null);
  const [celebrationDone, setCelebrationDone] = useState(false);

  useEffect(() => {
    // Jouer la célébration une seule fois
    if (!celebrationDone) {
      soundFx.playVictory();
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {
        /* ignore */
      }
      setCelebrationDone(true);
    }

    const scores = calculateCharacterRushLeaderboard(room);
    setLeaderboard(scores);

    // Record results
    if (room && user && !user.isGuest) {
      recordCharacterRushResults(room, user).then((updated) => {
        if (onUpdateUser) onUpdateUser(updated);
      });
    }

    // Auto-select current user
    const myScore = scores.find((s) => s.uid === user.uid);
    if (myScore) setSelectedPlayer(myScore);
  }, [room.id]); // Trigger seulement sur changement de room.id

  const handlePlayerClick = (player: CharacterRushScoreSummary) => {
    setSelectedPlayer(player);
    soundFx.playTick();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="clip-corner-sm w-14 h-14 bg-neon-magenta/15 border border-neon-magenta/40 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-7 h-7 text-neon-magenta animate-bounce" />
        </div>
        <h1 className="text-2xl font-display font-black text-white">Rafale terminée !</h1>
        <p className="text-xs text-slate-500 mt-1">
          {room.name} — {room.totalThemes} thèmes
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,380px] gap-5">
        {/* Leaderboard */}
        <div>
          <h2 className="text-sm font-hud font-bold uppercase tracking-wide text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-gold" />
            Classement
          </h2>

          <div className="space-y-2 mb-5">
            {leaderboard.map((player, idx) => {
              const av = getAvatarById(player.avatarId);
              const isMe = player.uid === user.uid;
              const isSelected = selectedPlayer?.uid === player.uid;

              return (
                <button
                  key={player.uid}
                  onClick={() => handlePlayerClick(player)}
                  className={`w-full flex items-center gap-3 p-4 clip-corner-sm border transition-all cursor-pointer ${
                    RANK_GLOW[idx] ||
                    (isSelected
                      ? 'bg-neon-magenta/10 border-neon-magenta/40'
                      : isMe
                      ? 'bg-crimson/5 border-crimson/30'
                      : 'bg-white/[0.02] border-white/8 hover:border-white/20')
                  }`}
                >
                  {/* Rank */}
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

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">
                        {player.username}
                      </span>
                      {isMe && <span className="text-[10px] text-crimson">(vous)</span>}
                    </div>
                    <span className="text-xs text-slate-500">{player.otakuTitle}</span>
                  </div>

                  {/* Stats */}
                  <div className="text-right shrink-0">
                    <p
                      className={`font-display font-black text-xl leading-none ${
                        idx === 0 ? 'text-neon-gold' : 'text-white'
                      }`}
                    >
                      {player.totalScore}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {Math.round(player.accuracy)}% précision
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <NeonButton variant="primary" className="flex-1" onClick={onRematch}>
              <RefreshCw className="w-4 h-4" /> Nouvelle partie
            </NeonButton>
            <NeonButton variant="ghost" className="flex-1" onClick={onHome}>
              <Home className="w-4 h-4" /> Accueil
            </NeonButton>
          </div>
        </div>

        {/* Player Details */}
        {selectedPlayer && (
          <div>
            <h2 className="text-sm font-hud font-bold uppercase tracking-wide text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-neon-magenta" />
              Détails
            </h2>

            <Panel glow="magenta" className="p-5 mb-3">
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const av = getAvatarById(selectedPlayer.avatarId);
                  return (
                    <div
                      className="clip-corner-sm w-14 h-14 p-0.5 shrink-0"
                      style={{ backgroundColor: av.accentColor }}
                    >
                      <div
                        className="clip-corner-sm w-full h-full bg-void flex items-center justify-center overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                      />
                    </div>
                  );
                })()}

                <div className="flex-1">
                  <h3 className="font-display text-xl font-black text-white">
                    {selectedPlayer.username}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedPlayer.otakuTitle}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Rang</p>
                  <p className="text-2xl font-display font-black text-neon-gold">
                    #{selectedPlayer.rank}
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-neon-magenta" />
                    <p className="text-xs text-slate-500">Total valides</p>
                  </div>
                  <p className="text-2xl font-display font-black text-white">
                    {selectedPlayer.totalScore}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-neon-gold" />
                    <p className="text-xs text-slate-500">Précision</p>
                  </div>
                  <p className="text-2xl font-display font-black text-white">
                    {Math.round(selectedPlayer.accuracy)}%
                  </p>
                </div>
              </div>

              {/* Total answers */}
              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-500 mb-1">Réponses soumises</p>
                <p className="text-lg font-display font-black text-white">
                  {selectedPlayer.totalAnswers}
                </p>
              </div>

              {/* Best theme */}
              {selectedPlayer.bestTheme && (
                <div className="mt-3 p-3 rounded-lg bg-neon-gold/10 border border-neon-gold/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-neon-gold" />
                    <p className="text-xs font-bold text-neon-gold">Meilleur thème</p>
                  </div>
                  <p className="text-sm text-white font-medium mb-0.5">
                    {selectedPlayer.bestTheme.theme}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedPlayer.bestTheme.score} personnage
                    {selectedPlayer.bestTheme.score > 1 ? 's' : ''} valide
                    {selectedPlayer.bestTheme.score > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </Panel>

            {/* All themes breakdown */}
            <Panel glow="neutral" className="p-4">
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wide">
                Détail par thème
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {room.themes.map((theme, index) => {
                  const player = room.players[selectedPlayer.uid];
                  const answers = player?.answers[theme.id] || [];
                  const validCount = answers.filter((a) => a.validationStatus === 'valid').length;

                  return (
                    <div
                      key={theme.id}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs text-white font-medium flex-1">{theme.theme}</p>
                        <span className="text-sm font-display font-black text-neon-magenta">
                          {validCount}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {answers.length} réponse{answers.length > 1 ? 's' : ''} soumise
                        {answers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
};
