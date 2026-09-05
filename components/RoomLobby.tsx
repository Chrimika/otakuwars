'use client';

import React, { useEffect, useState } from 'react';
import { GameRoom, UserProfile } from '../lib/types';
import { subscribeToRoom, togglePlayerReady, startGameMatch } from '../lib/gameService';
import { getAvatarById } from '../data/avatars';
import { Crown, Copy, Check, Users, Play, Clock, HelpCircle, Shield, ArrowLeft } from 'lucide-react';
import { soundFx } from '../lib/soundEffects';

interface RoomLobbyProps {
  roomId: string;
  user: UserProfile;
  onLeaveRoom: () => void;
  onGameStarted: (room: GameRoom) => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  roomId,
  user,
  onLeaveRoom,
  onGameStarted,
}) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Real-time onSnapshot subscription to Firestore / local sync engine
    const unsubscribe = subscribeToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        if (updatedRoom.state === 'playing') {
          onGameStarted(updatedRoom);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, onGameStarted]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-semibold text-sm">Chargement du salon en temps réel...</p>
      </div>
    );
  }

  const playersList = Object.values(room.players || {});
  const isHost = room.hostId === user.uid;
  const myPlayer = room.players[user.uid];
  const allReady = playersList.length > 0 && playersList.every((p) => p.isReady || p.isHost);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}?code=${room.code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleReady = () => {
    if (myPlayer) {
      togglePlayerReady(room.id, user.uid, !myPlayer.isReady);
    }
  };

  const handleStartGame = () => {
    soundFx.playGameStart();
    startGameMatch(room.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onLeaveRoom}
        className="flex items-center gap-2 mb-6 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Quitter le salon
      </button>

      {/* Main Room Lobby Header */}
      <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 mb-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{room.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700/50">
                {room.category === 'all' ? 'Tous les Animes' : room.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Créé par <strong className="text-purple-300">{room.hostName}</strong> • Salon multijoueur synchrone
            </p>

            {/* Room Parameters Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-400" />
                Compte à Rebours: <span className="underline">{room.timerPerQuestion}s / question</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                {room.totalQuestions} Questions QCM
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                <Users className="w-4 h-4 text-cyan-400" />
                {playersList.length} Joueur(s) dans le salon
              </div>
            </div>
          </div>

          {/* Share Code Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-3 shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Code de Salon d\'Invitation
            </span>
            <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest">
              {room.code}
            </span>
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleCopyCode}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-bold transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copié !' : 'Copier Code'}
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Lien Copié !' : 'Partager Lien'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Players List Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-black text-white tracking-wide mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          JOUEURS CONNECTÉS DANS L\'ARÈNE ({playersList.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playersList.map((player) => {
            const avatar = getAvatarById(player.avatarId);
            const isMe = player.uid === user.uid;

            return (
              <div
                key={player.uid}
                className={`relative p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                  isMe
                    ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-400/80 shadow-lg shadow-purple-950/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Host Badge */}
                {player.isHost && (
                  <div
                    className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/30"
                    title="Hôte de la partie"
                  >
                    <Crown className="w-3 h-3 fill-slate-950" />
                    Hôte
                  </div>
                )}

                {/* Avatar SVG */}
                <div
                  className="w-14 h-14 rounded-2xl p-0.5 flex items-center justify-center shrink-0 shadow-inner"
                  style={{ backgroundColor: avatar.accentColor }}
                >
                  <div
                    className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: avatar.avatarSvg }}
                  />
                </div>

                {/* Player Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-white truncate">{player.username}</span>
                    {isMe && <span className="text-[10px] text-purple-400 font-bold">(Moi)</span>}
                  </div>
                  <span className="text-xs text-purple-300 font-medium block truncate">{player.otakuTitle}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">{avatar.badge}</span>
                </div>

                {/* Ready indicator */}
                <div className="shrink-0">
                  {player.isHost ? (
                    <span className="text-xs font-bold text-amber-400 px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40">
                      Organisateur
                    </span>
                  ) : player.isReady ? (
                    <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Prêt
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                      En attente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          {isHost
            ? 'En tant qu\'hôte, lancez le quiz dès que les joueurs sont prêts.'
            : 'Cliquez sur "Je suis Prêt !" pour indiquer à l\'hôte que vous attendez le lancement.'}
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isHost && (
            <button
              onClick={handleToggleReady}
              className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${
                myPlayer?.isReady
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
              }`}
            >
              {myPlayer?.isReady ? '✓ Prêt pour le combat' : 'Je suis Prêt ! ⚡'}
            </button>
          )}

          {isHost && (
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              DÉMARRER LA PARTIE QUIZ 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
