'use client';

import React, { useEffect, useState } from 'react';
import { GameRoom, UserProfile, QuizQuestion } from '../lib/types';
import { subscribeToRoom, submitQuestionAnswer, advanceToNextQuestion } from '../lib/gameService';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../lib/soundEffects';
import { Clock, Flame, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface QuizGameProps {
  roomId: string;
  user: UserProfile;
  onGameOver: (room: GameRoom) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ roomId, user, onGameOver }) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answerStart, setAnswerStart] = useState(Date.now());

  useEffect(() => {
    const unsub = subscribeToRoom(roomId, (r) => {
      if (r) {
        setRoom(r);
        if (r.state === 'game_over') onGameOver(r);
      }
    });
    return unsub;
  }, [roomId, onGameOver]);

  useEffect(() => {
    if (room?.state === 'playing') {
      setSelected(null);
      setAnswered(false);
      setAnswerStart(Date.now());
    }
  }, [room?.currentQuestionIndex, room?.state]);

  useEffect(() => {
    if (!room || room.state !== 'playing' || !room.questionStartTime) return;
    const totalMs = room.timerPerQuestion * 1000;
    const iv = setInterval(() => {
      const elapsed = Date.now() - (room.questionStartTime || Date.now());
      const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 4 && remaining > 0) soundFx.playTick();
      if (remaining <= 0) {
        clearInterval(iv);
        if (!answered) {
          setAnswered(true);
          submitQuestionAnswer(roomId, user.uid, -1, totalMs);
        }
      }
    }, 200);
    return () => clearInterval(iv);
  }, [room, roomId, user.uid, answered]);

  if (!room || room.state !== 'playing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  const q: QuizQuestion = room.questions[room.currentQuestionIndex];
  const isHost = room.hostId === user.uid;
  const myPlayer = room.players[user.uid];
  const players = Object.values(room.players).sort((a, b) => b.score - a.score);
  const totalTime = room.timerPerQuestion;
  const progress = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const urgent = timeLeft <= 3;

  const handleSelect = (idx: number) => {
    if (answered || timeLeft === 0) return;
    const ms = Date.now() - answerStart;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctAnswerIndex) soundFx.playCorrect();
    else soundFx.playWrong();
    submitQuestionAnswer(roomId, user.uid, idx, ms);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <span className="text-xs text-slate-500 font-semibold">
          Question <span className="text-white font-black">{room.currentQuestionIndex + 1}</span> / {room.totalQuestions}
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
          <span className="text-sm font-bold text-white">{myPlayer?.score || 0}</span>
        </div>
      </div>

      {/* Question card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/8 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-violet-400 font-semibold">{q.animeSource}</span>
          <span className="text-[10px] text-slate-600 uppercase tracking-wider">{q.difficulty}</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white leading-snug mb-6">{q.question}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctAnswerIndex;
            const isSelected = selected === idx;
            const show = answered || timeLeft === 0;

            let cls = 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-500/50 hover:text-white';
            if (show) {
              if (isCorrect) cls = 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300';
              else if (isSelected) cls = 'border-red-600/60 bg-red-950/40 text-red-300';
              else cls = 'border-white/5 opacity-40 text-slate-500';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={answered || timeLeft === 0}
                className={`p-3.5 rounded-xl border font-semibold text-sm text-left flex items-center justify-between gap-3 transition-all cursor-pointer disabled:cursor-default ${cls}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {show && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {show && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {(answered || timeLeft === 0) && (
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/8 animate-fade-in">
            <p className="text-xs text-slate-400 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Live mini-scores */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {players.map((p) => {
            const av = getAvatarById(p.avatarId);
            return (
              <div key={p.uid} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/8">
                <div className="w-5 h-5 rounded-full overflow-hidden" style={{ backgroundColor: av.accentColor }}>
                  <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: av.avatarSvg }} />
                </div>
                <span className="text-xs text-white font-semibold">{p.username}</span>
                <span className="text-xs text-amber-400 font-black">{p.score}</span>
              </div>
            );
          })}
        </div>

        {isHost && (answered || timeLeft === 0) && (
          <button
            onClick={() => advanceToNextQuestion(roomId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Suivant <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
