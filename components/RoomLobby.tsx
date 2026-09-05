'use client';

import React, { useEffect, useState } from 'react';
import { GameRoom, UserProfile } from '../lib/types';
import { subscribeToRoom, togglePlayerReady, startGameMatch } from '../lib/gameService';
import { getAvatarById } from '../data/avatars';
import { Copy, Check, Users, Play, Clock, ArrowLeft, Crown } from 'lucide-react';
import { soundFx } from '../lib/soundEffects';

interface RoomLobbyProps {
  roomId: string;
  user: UserProfile;
  onLeaveRoom: () => void;
  onGameStarted: (room: GameRoom) => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({ roomId, user, onLeaveRoom, onGameStarted }) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = subscribeToRoom(roomId, (r) => {
      if (r) {
        setRoom(r);
        if (r.state === 'playing') onGameStarted(r);
      }
    });
    return unsub;
  }, [roomId, onGameStarted]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Chargement du salon...</p>
      </div>
    );
  }

  const players = Object.values(room.players || {});
  const isHost = room.hostId === user.uid;
  const myPlayer = room.players[user.uid];

  const handleCopy = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    if (myPlayer) togglePlayerReady(room.id, user.uid, !myPlayer.isReady);
  };

  const handleStart = () => {
    soundFx.playGameStart();
    startGameMatch(room.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onLeaveRoom} className="flex items-center gap-1.5 mb-6 text-xs text-slate-500 hover:text-white transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Quitter le salon
      </button>

      {/* Header */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white">{room.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Créé par <span className="text-violet-400">{room.hostName}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-400" />{room.timerPerQuestion}s/question
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                {room.totalQuestions} questions
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5 text-violet-400" />{players.length} joueur{players.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Code */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/8 self-start sm:self-auto">
            <span className="font-mono font-black text-xl tracking-widest text-violet-300">{room.code}</span>
            <button
              onClick={handleCopy}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="mb-5">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Joueurs connectés</h2>
        <div className="space-y-2">
          {players.map((p) => {
            const av = getAvatarById(p.avatarId);
            const isMe = p.uid === user.uid;
            return (
              <div
                key={p.uid}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                  isMe ? 'bg-violet-950/30 border-violet-700/40' : 'bg-white/[0.02] border-white/8'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl p-0.5 shrink-0" style={{ backgroundColor: av.accentColor }}>
                    <div
                      className="w-full h-full rounded-[9px] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.username}</span>
                      {isMe && <span className="text-[10px] text-violet-400">(vous)</span>}
                      {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-xs text-slate-500">{p.otakuTitle}</span>
                  </div>
                </div>

                <div>
                  {p.isHost ? (
                    <span className="text-xs text-amber-400 font-semibold">Hôte</span>
                  ) : p.isReady ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Prêt
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">En attente</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isHost && (
          <button
            onClick={handleToggleReady}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              myPlayer?.isReady
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
            }`}
          >
            {myPlayer?.isReady ? 'Annuler la préparation' : 'Je suis prêt !'}
          </button>
        )}
        {isHost && (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Lancer la partie
          </button>
        )}
      </div>
    </div>
  );
};
