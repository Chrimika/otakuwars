'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CharacterRushRoom, UserProfile } from '../lib/types';
import {
  subscribeToCharacterRushRoom,
  submitCharacterAnswer,
  advanceToNextTheme,
} from '../lib/characterRushService';
import { getAvatarById } from '../data/avatars';
import {
  Zap,
  Send,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Loader,
  TrendingUp,
  Award,
} from 'lucide-react';
import { soundFx } from '../lib/soundEffects';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';

interface CharacterRushGameProps {
  roomId: string;
  user: UserProfile;
  onGameOver: (room: CharacterRushRoom) => void;
}

export const CharacterRushGame: React.FC<CharacterRushGameProps> = ({
  roomId,
  user,
  onGameOver,
}) => {
  const [room, setRoom] = useState<CharacterRushRoom | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [characterInput, setCharacterInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [lastCompletedThemeId, setLastCompletedThemeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Timer
  useEffect(() => {
    if (!room || !room.themeStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - room.themeStartTime!;
      const remaining = Math.max(0, room.timerPerTheme * 1000 - elapsed);
      setTimeLeft(Math.ceil(remaining / 1000));

      // Auto advance when time is up
      if (remaining <= 0 && room.state === 'playing') {
        // Afficher l'écran de résultats avant de passer au thème suivant
        const currentTheme = room.themes[room.currentThemeIndex];
        if (currentTheme && currentTheme.id !== lastCompletedThemeId) {
          setShowResults(true);
          setLastCompletedThemeId(currentTheme.id);
        }
        
        if (room.hostId === user.uid) {
          // Laisser 3 secondes pour voir les résultats avant d'avancer
          setTimeout(() => {
            advanceToNextTheme(room.id);
          }, 3000);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [room, user.uid, lastCompletedThemeId]);

  // Subscribe to room
  useEffect(() => {
    const unsub = subscribeToCharacterRushRoom(roomId, (r) => {
      if (r) {
        setRoom(r);
        if (r.state === 'game_over') {
          onGameOver(r);
        }
      }
    });
    return unsub;
  }, [roomId, onGameOver]);

  // Focus input when theme changes OR when game starts
  useEffect(() => {
    if (room && inputRef.current && !showResults) {
      // Délai plus long pour mobile
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Pour iOS: s'assurer que le clavier s'ouvre
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            inputRef.current.click();
          }
        }
      }, 150);
    }
  }, [room?.currentThemeIndex, room?.themeStartTime, showResults]); // Trigger sur changement de thème ET start time

  // Focus au montage initial (début de partie)
  useEffect(() => {
    if (room && inputRef.current && !showResults) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            inputRef.current.click();
          }
        }
      }, 200);
    }
  }, [showResults]); // Une seule fois au montage

  // Cacher l'écran de résultats quand un nouveau thème commence
  useEffect(() => {
    if (room && room.themeStartTime && timeLeft > 0) {
      setShowResults(false);
    }
  }, [room?.themeStartTime, timeLeft]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-neon-magenta animate-spin mb-3" />
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  const currentTheme = room.themes[room.currentThemeIndex];
  const myPlayer = room.players[user.uid];
  const myAnswers = myPlayer?.answers[currentTheme?.id] || [];
  const players = Object.values(room.players);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterInput.trim() || isSubmitting || !currentTheme || timeLeft === 0) return;

    const trimmedInput = characterInput.trim();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Soumission LOCALE immédiate (pas de validation API)
      await submitCharacterAnswer(
        room.id,
        user.uid,
        currentTheme.id,
        trimmedInput
      );
      
      // Feedback visuel positif immédiat
      soundFx.playCorrect();
      setCharacterInput('');
      
      // Message d'encouragement
      setErrorMsg(''); // Pas d'erreur, tout est accepté localement
      
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur';
      setErrorMsg(msg);
      soundFx.playWrong();
    } finally {
      setIsSubmitting(false);
      // Refocus immédiat et forcé pour iOS/mobile
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Pour iOS: trigger le clavier virtuel
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            inputRef.current.click();
          }
        }
      }, 10);
    }
  };

  const progressPercent = ((room.currentThemeIndex + 1) / room.totalThemes) * 100;
  const timerPercent = room.timerPerTheme > 0 ? (timeLeft / room.timerPerTheme) * 100 : 0;

  // Écran de résultats détaillés
  if (showResults && timeLeft === 0) {
    const validAnswers = myAnswers.filter((a) => a.validationStatus === 'valid');
    const invalidAnswers = myAnswers.filter((a) => a.validationStatus === 'invalid');
    const pendingAnswers = myAnswers.filter((a) => a.validationStatus === 'pending');

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
        <Panel glow="magenta" className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-display font-black text-white mb-2">
              Résultats - {currentTheme?.theme}
            </h2>
            <p className="text-sm text-slate-400">
              Thème {room.currentThemeIndex + 1}/{room.totalThemes}
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-display font-black text-emerald-400">
                  {validAnswers.length}
                </span>
              </div>
              <p className="text-xs text-center text-emerald-300">Valides</p>
            </div>

            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-display font-black text-red-400">
                  {invalidAnswers.length}
                </span>
              </div>
              <p className="text-xs text-center text-red-300">Invalides</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Loader className="w-5 h-5 text-amber-400" />
                <span className="text-2xl font-display font-black text-amber-400">
                  {pendingAnswers.length}
                </span>
              </div>
              <p className="text-xs text-center text-amber-300">En attente</p>
            </div>
          </div>

          {/* Liste détaillée */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {myAnswers.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                Aucune réponse soumise pour ce thème
              </p>
            ) : (
              <>
                {/* Réponses valides */}
                {validAnswers.map((answer, index) => (
                  <div
                    key={`valid-${index}`}
                    className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/40 animate-fade-in"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white">
                          {answer.characterName}
                        </span>
                      </div>
                      {answer.confidence !== undefined && (
                        <span className="text-xs text-emerald-300 shrink-0">
                          {Math.round(answer.confidence * 100)}% sûr
                        </span>
                      )}
                    </div>
                    {answer.reason && (
                      <p className="text-sm text-emerald-200 mb-1 pl-7">
                        {answer.reason}
                      </p>
                    )}
                    {answer.details && (
                      <p className="text-xs text-emerald-300/80 pl-7">
                        {answer.details}
                      </p>
                    )}
                  </div>
                ))}

                {/* Réponses invalides */}
                {invalidAnswers.map((answer, index) => (
                  <div
                    key={`invalid-${index}`}
                    className="p-4 rounded-lg bg-red-950/40 border border-red-800/40 animate-fade-in"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <span className="font-bold text-white">
                          {answer.characterName}
                        </span>
                      </div>
                      {answer.confidence !== undefined && (
                        <span className="text-xs text-red-300 shrink-0">
                          {Math.round(answer.confidence * 100)}% sûr
                        </span>
                      )}
                    </div>
                    {answer.reason && (
                      <p className="text-sm text-red-200 mb-1 pl-7">
                        {answer.reason}
                      </p>
                    )}
                    {answer.details && (
                      <p className="text-xs text-red-300/80 pl-7">
                        {answer.details}
                      </p>
                    )}
                  </div>
                ))}

                {/* Réponses en attente */}
                {pendingAnswers.map((answer, index) => (
                  <div
                    key={`pending-${index}`}
                    className="p-4 rounded-lg bg-amber-950/40 border border-amber-800/40 animate-fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <Loader className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
                      <span className="font-bold text-white">
                        {answer.characterName}
                      </span>
                    </div>
                    <p className="text-sm text-amber-200 pl-7 mt-1">
                      Validation en cours...
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Message de transition */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {room.currentThemeIndex + 1 < room.totalThemes
                ? '🔄 Prochain thème dans quelques secondes...'
                : '🎉 Calcul des scores finaux...'}
            </p>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header - Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-hud font-bold uppercase tracking-wide">
            Thème {room.currentThemeIndex + 1}/{room.totalThemes}
          </span>
          <span className="text-neon-gold font-bold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-void-2 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-neon-magenta to-neon-violet transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-4">
        {/* Main game area */}
        <div>
          {/* Current Theme */}
          <Panel glow="magenta" className="p-6 mb-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-xs font-hud font-bold uppercase tracking-wide text-neon-magenta mb-2">
                  Thème actuel
                </p>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                  {currentTheme?.theme || 'Chargement...'}
                </h2>
              </div>

              {/* Timer */}
              <div className="shrink-0">
                <div
                  className={`clip-corner-sm w-20 h-20 p-1 ${
                    timeLeft <= 5
                      ? 'bg-red-500 animate-pulse'
                      : timeLeft <= 10
                      ? 'bg-amber-500'
                      : 'bg-neon-magenta'
                  }`}
                >
                  <div className="clip-corner-sm w-full h-full bg-void flex flex-col items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-400 mb-0.5" />
                    <span
                      className={`text-2xl font-display font-black ${
                        timeLeft <= 5
                          ? 'text-red-400'
                          : timeLeft <= 10
                          ? 'text-amber-400'
                          : 'text-white'
                      }`}
                    >
                      {timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer bar */}
            <div className="h-1.5 bg-void-2 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-100 ${
                  timeLeft <= 5
                    ? 'bg-red-500'
                    : timeLeft <= 10
                    ? 'bg-amber-500'
                    : 'bg-neon-magenta'
                }`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={characterInput}
                  onChange={(e) => {
                    setCharacterInput(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Nom du personnage..."
                  disabled={timeLeft === 0 || isSubmitting}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border border-white/10 text-white text-base placeholder-slate-600 focus:border-neon-magenta focus:outline-none transition-colors disabled:opacity-50"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!characterInput.trim() || isSubmitting || timeLeft === 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg bg-neon-magenta hover:brightness-125 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Message d'encouragement */}
              {myAnswers.length > 0 && timeLeft > 0 && (
                <p className="text-xs text-green-400 flex items-center gap-1 animate-fade-in">
                  <CheckCircle className="w-3.5 h-3.5" />
                  ✅ {myAnswers.length} réponse{myAnswers.length > 1 ? 's' : ''} enregistrée{myAnswers.length > 1 ? 's' : ''}! Continue!
                </p>
              )}

              {errorMsg && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </p>
              )}

              <p className="text-xs text-slate-500">
                Tapez un personnage puis appuyez sur Entrée ou cliquez sur le bouton. Répétez autant de fois que possible!
              </p>
            </form>
          </Panel>

          {/* My Answers */}
          <Panel glow="neutral" className="p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-neon-gold" />
              Mes réponses ({myAnswers.length})
            </h3>

            {myAnswers.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">
                Aucune réponse soumise pour ce thème
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {myAnswers.map((answer, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-all ${
                      answer.validationStatus === 'valid'
                        ? 'bg-emerald-950/40 border-emerald-800/40'
                        : answer.validationStatus === 'invalid'
                        ? 'bg-red-950/40 border-red-800/40'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <span className="text-sm text-white font-medium truncate">
                      {answer.characterName}
                    </span>
                    <div className="shrink-0">
                      {answer.validationStatus === 'pending' && (
                        <Loader className="w-4 h-4 text-slate-400 animate-spin" />
                      )}
                      {answer.validationStatus === 'valid' && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      {answer.validationStatus === 'invalid' && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Sidebar - Leaderboard */}
        <div>
          <Panel glow="neutral" className="p-4 sticky top-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-gold" />
              Classement en direct
            </h3>

            <div className="space-y-2">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => {
                  const avatar = getAvatarById(player.avatarId);
                  const isMe = player.uid === user.uid;
                  const currentThemeAnswers = player.answers[currentTheme?.id] || [];
                  const validCount = currentThemeAnswers.filter(
                    (a) => a.validationStatus === 'valid'
                  ).length;

                  return (
                    <div
                      key={player.uid}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                        isMe
                          ? 'bg-neon-magenta/10 border-neon-magenta/40'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {/* Rank */}
                      <span
                        className={`font-display text-lg font-black w-6 text-center ${
                          index === 0
                            ? 'text-neon-gold'
                            : index === 1
                            ? 'text-slate-300'
                            : index === 2
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </span>

                      {/* Avatar */}
                      <div
                        className="clip-corner-sm w-9 h-9 p-0.5 shrink-0"
                        style={{ backgroundColor: avatar.accentColor }}
                      >
                        <div
                          className="clip-corner-sm w-full h-full bg-void flex items-center justify-center overflow-hidden"
                          dangerouslySetInnerHTML={{ __html: avatar.avatarSvg }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {player.username}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Ce thème: {validCount}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-lg font-display font-black text-white">
                          {player.score}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-slate-500 mb-0.5">Mon total</p>
                  <p className="text-xl font-display font-black text-neon-magenta">
                    {myPlayer?.score || 0}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-slate-500 mb-0.5">Ce thème</p>
                  <p className="text-xl font-display font-black text-neon-gold">
                    {myAnswers.filter((a) => a.validationStatus === 'valid').length}
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
