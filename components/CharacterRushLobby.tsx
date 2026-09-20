'use client';

import React, { useEffect, useState } from 'react';
import { CharacterRushRoom, UserProfile } from '../lib/types';
import {
  subscribeToCharacterRushRoom,
  toggleCharacterRushReady,
  startCharacterRushGame,
  leaveCharacterRushRoom,
} from '../lib/characterRushService';
import { getAvatarById } from '../data/avatars';
import { Copy, Check, Users, Play, Clock, ArrowLeft, Crown, Zap, Loader } from 'lucide-react';
import { soundFx } from '../lib/soundEffects';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';

interface CharacterRushLobbyProps {
  roomId: string;
  user: UserProfile;
  onLeaveRoom: () => void;
  onGameStarted: (room: CharacterRushRoom) => void;
}

export const CharacterRushLobby: React.FC<CharacterRushLobbyProps> = ({
  roomId,
  user,
  onLeaveRoom,
  onGameStarted,
}) => {
  const [room, setRoom] = useState<CharacterRushRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCharacterRushRoom(roomId, (r) => {
      if (r) {
        setRoom(r);
        if (r.state === 'playing' && !r.isGeneratingThemes) {
          onGameStarted(r);
        }
      }
    });
    return unsub;
  }, [roomId, onGameStarted]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-magenta border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Chargement du salon...</p>
      </div>
    );
  }

  const players = Object.values(room.players || {});
  const isHost = room.hostId === user.uid;
  const myPlayer = room.players[user.uid];
  const allReady = players.every((p) => p.isReady);
  const canStart = isHost && players.length >= 1 && allReady;

  const handleCopy = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    soundFx.playCorrect();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    if (myPlayer && !isHost) {
      toggleCharacterRushReady(room.id, user.uid);
      soundFx.playTick();
    }
  };

  const handleStart = async () => {
    if (!canStart || isStarting) return;
    setIsStarting(true);
    soundFx.playGameStart();
    try {
      await startCharacterRushGame(room.id);
    } catch (error) {
      console.error('Erreur démarrage:', error);
      setIsStarting(false);
    }
  };

  const handleLeave = async () => {
    await leaveCharacterRushRoom(room.id, user.uid);
    onLeaveRoom();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={handleLeave}
        className="flex items-center gap-1.5 mb-6 text-xs text-slate-500 hover:text-neon-magenta transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quitter le salon
      </button>

      {/* Header */}
      <Panel glow="magenta" className="p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-neon-magenta" />
              {room.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Créé par <span className="text-neon-magenta">{room.hostName}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-neon-gold" />
                {room.timerPerTheme}s/thème
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-neon-magenta" />
                {room.totalThemes} thèmes
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5 text-neon-violet" />
                {players.length} joueur{players.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Code */}
          <div className="flex items-center gap-2 p-3 clip-corner-sm bg-black/40 border border-neon-magenta/30 self-start sm:self-auto">
            <span className="font-mono font-black text-xl tracking-widest text-neon-magenta text-glow-magenta">
              {room.code}
            </span>
            <button
              onClick={handleCopy}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </Panel>

      {/* Instructions */}
      <Panel glow="neutral" className="p-4 mb-5 bg-neon-magenta/5">
        <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-neon-magenta" />
          Comment jouer ?
        </h3>
        <ul className="text-xs text-slate-400 space-y-1 leading-relaxed">
          <li>• Des thèmes seront générés (ex: "personnages aux cheveux rouges")</li>
          <li>• Citez un maximum de personnages correspondants en {room.timerPerTheme}s</li>
          <li>• Tapez un nom puis validez, répétez autant que possible</li>
          <li>• L&apos;IA vérifiera automatiquement vos réponses</li>
          <li>• 1 point par personnage valide. Le plus rapide gagne!</li>
        </ul>
      </Panel>

      {/* Players */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Joueurs ({players.length})
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {players.map((p) => {
            const avatar = getAvatarById(p.avatarId);
            return (
              <Panel key={p.uid} glow="neutral" className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="clip-corner-sm w-12 h-12 p-0.5 shrink-0"
                    style={{ backgroundColor: avatar.accentColor }}
                  >
                    <div
                      className="clip-corner-sm w-full h-full bg-void flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: avatar.avatarSvg }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                      {p.username}
                      {p.isHost && <Crown className="w-3.5 h-3.5 text-neon-gold shrink-0" />}
                    </p>
                    <p className="text-xs text-slate-500">{p.otakuTitle}</p>
                  </div>
                  <div>
                    {p.isReady ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" /> Prêt
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600 bg-white/5 border border-white/8 px-2 py-1 rounded-lg">
                        En attente...
                      </span>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isHost ? (
          <>
            <NeonButton
              variant="primary"
              onClick={handleStart}
              disabled={!canStart || isStarting || room.isGeneratingThemes}
              className="flex-1"
            >
              {room.isGeneratingThemes ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Génération des thèmes...
                </>
              ) : isStarting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Démarrage...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Lancer la partie
                </>
              )}
            </NeonButton>
            {!allReady && players.length > 1 && (
              <p className="text-xs text-amber-500 text-center sm:text-left">
                Tous les joueurs doivent être prêts
              </p>
            )}
          </>
        ) : (
          <NeonButton
            variant={myPlayer?.isReady ? 'secondary' : 'primary'}
            onClick={handleToggleReady}
            className="flex-1"
          >
            {myPlayer?.isReady ? (
              <>
                <Check className="w-4 h-4" />
                Prêt
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Je suis prêt !
              </>
            )}
          </NeonButton>
        )}
      </div>

      {/* Waiting message */}
      {room.isGeneratingThemes && (
        <div className="mt-4 p-4 rounded-xl bg-neon-magenta/10 border border-neon-magenta/30 text-center">
          <Loader className="w-6 h-6 text-neon-magenta mx-auto mb-2 animate-spin" />
          <p className="text-sm font-bold text-white mb-1">
            Génération des {room.totalThemes} thèmes en cours...
          </p>
          <p className="text-xs text-slate-400">
            L&apos;IA Gemini prépare des thèmes créatifs et variés pour vous
          </p>
        </div>
      )}
    </div>
  );
};
