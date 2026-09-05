'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GameRoom, UserProfile, QuizQuestion } from '../lib/types';
import { subscribeToRoom, submitQuestionAnswer, advanceToNextQuestion } from '../lib/gameService';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../lib/soundEffects';
import { Clock, Flame, CheckCircle2, XCircle, Sparkles, Trophy, Check, Hourglass, ArrowRight } from 'lucide-react';

interface QuizGameProps {
  roomId: string;
  user: UserProfile;
  onGameOver: (room: GameRoom) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ roomId, user, onGameOver }) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionStartMs, setQuestionStartMs] = useState(Date.now());
  const [nextCountdown, setNextCountdown] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to live room updates from Firestore
  useEffect(() => {
    const unsub = subscribeToRoom(roomId, (r) => {
      if (r) {
        setRoom(r);
        if (r.state === 'game_over') {
          onGameOver(r);
        }
      }
    });
    return unsub;
  }, [roomId, onGameOver]);

  // Handle local question timer (10 seconds per question)
  useEffect(() => {
    if (!room || room.state !== 'playing') return;
    if (qIdx >= room.totalQuestions) return;

    setTimeLeft(room.timerPerQuestion);
    setQuestionStartMs(Date.now());
    setSelectedOption(null);
    setAnswered(false);
    setNextCountdown(null);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        if (prev <= 4) soundFx.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [qIdx, room?.state, room?.timerPerQuestion, room?.totalQuestions]);

  // Handle timeout (0s left on current question)
  useEffect(() => {
    if (timeLeft === 0 && !answered && room && room.state === 'playing' && qIdx < room.totalQuestions) {
      handleAnswerSelect(-1, room.timerPerQuestion * 1000);
    }
  }, [timeLeft, answered, room, qIdx]);

  if (!room || room.state !== 'playing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Chargement de la partie...</p>
      </div>
    );
  }

  const isHost = room.hostId === user.uid;
  const myPlayer = room.players[user.uid];
  const players = Object.values(room.players).sort((a, b) => b.score - a.score);
  const isFinished = qIdx >= room.totalQuestions || myPlayer?.hasFinished;

  // ── SCREEN 1: WAITING FOR OTHERS TO FINISH BEFORE PODIUM ──────────────────

  if (isFinished) {
    const finishedCount = players.filter((p) => p.hasFinished).length;
    const totalCount = players.length;

    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center animate-fade-in">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111118] border border-white/10 shadow-2xl mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-2xl font-black text-white mb-1">Quiz Terminé !</h2>
          <p className="text-sm text-slate-400 mb-6">
            Votre score : <span className="text-amber-400 font-black text-lg">{myPlayer?.score || 0} pts</span>
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Hourglass className="w-4 h-4 text-violet-400 animate-spin" />
                Progression des joueurs
              </span>
              <span className="text-white font-bold">{finishedCount} / {totalCount} ont fini</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-amber-400 transition-all duration-500"
                style={{ width: `${(finishedCount / totalCount) * 100}%` }}
              />
            </div>

            {/* Players status list */}
            <div className="space-y-2 text-left">
              {players.map((p) => {
                const av = getAvatarById(p.avatarId);
                const pDone = p.hasFinished;
                const pQ = p.currentQuestionIndex || 0;

                return (
                  <div
                    key={p.uid}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full p-0.5 shrink-0 overflow-hidden"
                        style={{ backgroundColor: av.accentColor }}
                      >
                        <div
                          className="w-full h-full rounded-full bg-[#0a0a0f]"
                          dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{p.username}</p>
                        <p className="text-[10px] text-slate-400">{p.score} pts</p>
                      </div>
                    </div>

                    {pDone ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                        <Check className="w-3.5 h-3.5" /> Terminé
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded-lg border border-violet-800/40">
                        Q{Math.min(pQ + 1, room.totalQuestions)}/{room.totalQuestions}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isHost && (
            <button
              onClick={() => advanceToNextQuestion(roomId)}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm transition-all shadow-lg shadow-violet-900/40 cursor-pointer flex items-center justify-center gap-2"
            >
              Afficher le classement final 🏆
            </button>
          )}

          {!isHost && (
            <p className="text-xs text-slate-500 animate-pulse">
              Le classement général s&apos;affichera dès que tout le monde aura terminé...
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── SCREEN 2: ACTIVE QUESTION ──────────────────────────────────────────────

  const q: QuizQuestion = room.questions[qIdx];
  const totalTime = room.timerPerQuestion;
  const progress = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const urgent = timeLeft <= 3;

  const handleAnswerSelect = (optIdx: number, overrideMs?: number) => {
    if (answered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const ms = overrideMs !== undefined ? overrideMs : Date.now() - questionStartMs;
    setSelectedOption(optIdx);
    setAnswered(true);

    if (optIdx === q.correctAnswerIndex) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }

    submitQuestionAnswer(roomId, user.uid, qIdx, optIdx, ms);

    // Auto transition to next question after 2.5s feedback delay
    setNextCountdown(2);
    let step = 2;
    nextTimerRef.current = setInterval(() => {
      step -= 1;
      setNextCountdown(step);
      if (step <= 0) {
        if (nextTimerRef.current) clearInterval(nextTimerRef.current);
        setQIdx((prev) => prev + 1);
      }
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <span className="text-xs text-slate-500 font-semibold">
          Question <span className="text-white font-black">{qIdx + 1}</span> / {room.totalQuestions}
        </span>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${urgent ? 'border-red-800/60 bg-red-950/40' : 'border-white/10 bg-white/5'}`}>
          <Clock className={`w-4 h-4 ${urgent ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
          <span className={`font-black font-mono text-base ${urgent ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${urgent ? 'bg-red-500' : 'bg-violet-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-white">{myPlayer?.score || 0} pts</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#111118] border border-white/10 mb-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30">
            {q.animeSource}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            {q.category} • {q.difficulty}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white leading-snug mb-6">{q.question}</h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctAnswerIndex;
            const isSelected = selectedOption === idx;

            let cls = 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-500/50 hover:text-white';

            if (answered) {
              if (isCorrect) {
                cls = 'border-emerald-500/80 bg-emerald-950/60 text-emerald-200 font-bold scale-[1.01]';
              } else if (isSelected) {
                cls = 'border-red-500/80 bg-red-950/60 text-red-300';
              } else {
                cls = 'border-white/5 opacity-40 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswerSelect(idx)}
                disabled={answered}
                className={`p-3.5 rounded-xl border text-sm text-left flex items-center justify-between gap-3 transition-all cursor-pointer disabled:cursor-default ${cls}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Transition Indicator */}
        {answered && (
          <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 animate-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                Explication Otaku
              </span>
              {nextCountdown !== null && (
                <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
                  Suivant dans {nextCountdown}s <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Live scoreboard preview */}
      <div className="p-3 rounded-xl bg-[#111118] border border-white/8">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>Classement en direct</span>
          <span>{players.length} Joueurs</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {players.map((p) => {
            const av = getAvatarById(p.avatarId);
            const isMe = p.uid === user.uid;
            return (
              <div
                key={p.uid}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 ${
                  isMe ? 'border-violet-500/50 bg-violet-950/30' : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full p-0.5 shrink-0 overflow-hidden"
                  style={{ backgroundColor: av.accentColor }}
                >
                  <div
                    className="w-full h-full rounded-full bg-[#0a0a0f]"
                    dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                  />
                </div>
                <span className="text-xs font-semibold text-white">{p.username}</span>
                <span className="text-xs font-black text-amber-400">{p.score}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
