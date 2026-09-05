'use client';

import React, { useEffect } from 'react';
import { GameRoom, UserProfile } from '../lib/types';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Medal, Award, Flame, RefreshCw, Home, Sparkles, CheckCircle2 } from 'lucide-react';

interface LeaderboardProps {
  room: GameRoom;
  user: UserProfile;
  onRematch: () => void;
  onHome: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  room,
  user,
  onRematch,
  onHome,
}) => {
  useEffect(() => {
    soundFx.playVictory();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const playersList = Object.values(room.players || {}).sort((a, b) => b.score - a.score);
  const winner = playersList[0];
  const second = playersList[1];
  const third = playersList[2];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Game Over Banner Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-4 shadow-xl shadow-amber-500/20">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide uppercase">
          FIN DE LA PARTIE & CLASSEMENT
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Salon : <strong className="text-purple-300">{room.name}</strong> • {room.totalQuestions} questions affrontées
        </p>
      </div>

      {/* Podium Display (1st, 2nd, 3rd) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end mb-12">
        {/* 2nd Place */}
        {second ? (
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 mb-3 shadow-xl relative"
              style={{ backgroundColor: getAvatarById(second.avatarId).accentColor }}
            >
              <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-950 shadow-md">
                2
              </div>
              <div
                className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden"
                dangerouslySetInnerHTML={{ __html: getAvatarById(second.avatarId).avatarSvg }}
              />
            </div>
            <span className="font-extrabold text-sm text-white truncate max-w-full text-center">
              {second.username}
            </span>
            <span className="text-xs font-black text-slate-300 mt-0.5">{second.score} pts</span>
            <div className="w-full h-24 sm:h-32 mt-3 rounded-t-2xl bg-gradient-to-b from-slate-700 to-slate-900 border-t-2 border-slate-400 flex items-center justify-center font-black text-2xl text-slate-400">
              🥈 2ème
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* 1st Place Champion */}
        {winner && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <Sparkles className="w-8 h-8 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-pulse" />
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1.5 shadow-2xl shadow-amber-500/40 relative border-2 border-amber-400"
                style={{ backgroundColor: getAvatarById(winner.avatarId).accentColor }}
              >
                <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-slate-950 shadow-lg">
                  1
                </div>
                <div
                  className="w-full h-full rounded-[20px] bg-slate-950 flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: getAvatarById(winner.avatarId).avatarSvg }}
                />
              </div>
            </div>
            <span className="font-black text-base sm:text-lg text-amber-300 truncate max-w-full text-center">
              {winner.username}
            </span>
            <span className="text-xs font-bold text-purple-300">{winner.otakuTitle}</span>
            <span className="text-sm font-black text-amber-400 mt-1">{winner.score} pts</span>
            <div className="w-full h-32 sm:h-44 mt-3 rounded-t-2xl bg-gradient-to-b from-amber-500/30 via-purple-950 to-slate-900 border-t-4 border-amber-400 flex flex-col items-center justify-center font-black text-2xl text-amber-300 shadow-xl shadow-amber-500/20">
              <Trophy className="w-8 h-8 text-amber-400 mb-1" />
              👑 CHAMPION
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third ? (
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 mb-3 shadow-xl relative"
              style={{ backgroundColor: getAvatarById(third.avatarId).accentColor }}
            >
              <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center border-2 border-slate-950 shadow-md">
                3
              </div>
              <div
                className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden"
                dangerouslySetInnerHTML={{ __html: getAvatarById(third.avatarId).avatarSvg }}
              />
            </div>
            <span className="font-extrabold text-sm text-white truncate max-w-full text-center">
              {third.username}
            </span>
            <span className="text-xs font-black text-amber-500 mt-0.5">{third.score} pts</span>
            <div className="w-full h-20 sm:h-24 mt-3 rounded-t-2xl bg-gradient-to-b from-amber-950/80 to-slate-900 border-t-2 border-amber-700 flex items-center justify-center font-black text-xl text-amber-600">
              🥉 3ème
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Complete Players Scoreboard Table */}
      <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/50 mb-8 backdrop-blur-xl">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          Tableau des Résultats Complet
        </h3>

        <div className="space-y-3">
          {playersList.map((player, idx) => {
            const av = getAvatarById(player.avatarId);
            const isMe = player.uid === user.uid;

            return (
              <div
                key={player.uid}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  isMe
                    ? 'bg-purple-950/60 border-purple-400/80 shadow-md'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-black text-slate-300">
                    #{idx + 1}
                  </span>

                  <div
                    className="w-10 h-10 rounded-xl p-0.5 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: av.accentColor }}
                  >
                    <div
                      className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{player.username}</span>
                      {isMe && <span className="text-[10px] text-purple-400 font-bold">(Vous)</span>}
                    </div>
                    <span className="text-xs text-purple-300 font-medium">{player.otakuTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-base font-black text-amber-400 block">{player.score} pts</span>
                    <span className="text-[10px] text-slate-400">Score final</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRematch}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Rejouer une Partie 🔄
        </button>
        <button
          onClick={onHome}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Retour au Hub Otaku
        </button>
      </div>
    </div>
  );
};
