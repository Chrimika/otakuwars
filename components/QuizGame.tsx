'use client';

import React, { useEffect, useState } from 'react';
import { GameRoom, UserProfile, QuizQuestion } from '../lib/types';
import { subscribeToRoom, submitQuestionAnswer, advanceToNextQuestion } from '../lib/gameService';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../lib/soundEffects';
import { Clock, Flame, CheckCircle2, XCircle, Trophy, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface QuizGameProps {
  roomId: string;
  user: UserProfile;
  onGameOver: (room: GameRoom) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ roomId, user, onGameOver }) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [answerStartTime, setAnswerStartTime] = useState<number>(Date.now());

  // Subscribe to live room updates via onSnapshot
  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        if (updatedRoom.state === 'game_over') {
          onGameOver(updatedRoom);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, onGameOver]);

  // Reset local state on question change
  useEffect(() => {
    if (room && room.state === 'playing') {
      setSelectedOption(null);
      setHasAnswered(false);
      setAnswerStartTime(Date.now());
    }
  }, [room?.currentQuestionIndex, room?.state]);

  // 10s (or custom set time) Synchronized Countdown Timer Effect
  useEffect(() => {
    if (!room || room.state !== 'playing' || !room.questionStartTime) return;

    const timerDurationMs = room.timerPerQuestion * 1000;

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - (room.questionStartTime || Date.now());
      const remainingSec = Math.max(0, Math.ceil((timerDurationMs - elapsedMs) / 1000));

      setTimeLeft(remainingSec);

      // Play tick sound when time is under 4 seconds
      if (remainingSec <= 4 && remainingSec > 0) {
        soundFx.playTick();
      }

      // Auto advance or reveal when timer reaches 0s
      if (remainingSec <= 0) {
        clearInterval(interval);
        if (!hasAnswered && selectedOption === null) {
          // Auto submit no answer (-1)
          setHasAnswered(true);
          submitQuestionAnswer(roomId, user.uid, -1, timerDurationMs);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [room, roomId, user.uid, hasAnswered, selectedOption]);

  if (!room || room.state !== 'playing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-semibold">Préparation de la question...</p>
      </div>
    );
  }

  const currentQ: QuizQuestion = room.questions[room.currentQuestionIndex];
  const isHost = room.hostId === user.uid;
  const myPlayer = room.players[user.uid];
  const playersList = Object.values(room.players || {}).sort((a, b) => b.score - a.score);

  const totalTime = room.timerPerQuestion;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  const handleSelectOption = (index: number) => {
    if (hasAnswered || timeLeft <= 0) return;

    const timeTakenMs = Date.now() - answerStartTime;
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    if (isCorrect) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }

    submitQuestionAnswer(roomId, user.uid, index, timeTakenMs);
  };

  const handleNextQuestion = () => {
    advanceToNextQuestion(roomId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-slate-900/80 border border-purple-500/40 backdrop-blur-xl">
        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Question</span>
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {room.currentQuestionIndex + 1} / {room.totalQuestions}
          </span>
        </div>

        {/* Synchronized 10s Countdown Timer Ring */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Clock className={`w-5 h-5 ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
          <div className="text-center">
            <span className={`text-xl font-black font-mono ${timeLeft <= 3 ? 'text-red-400' : 'text-amber-300'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                timeLeft <= 3 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Player Current Score */}
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-extrabold text-white">Score: {myPlayer?.score || 0} pts</span>
          {(myPlayer?.streak || 0) > 1 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
              🔥 x{myPlayer.streak}
            </span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 mb-6 backdrop-blur-xl relative overflow-hidden">
        {/* Source Anime Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700/50 flex items-center gap-1.5">
            <span>{currentQ.badgeEmoji || '⛩️'}</span>
            {currentQ.animeSource}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {currentQ.category} • {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed mb-6">
          {currentQ.question}
        </h2>

        {/* QCM Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;
            const showResult = hasAnswered || timeLeft === 0;

            let cardStyle = 'border-slate-800 bg-slate-950 hover:border-purple-500/50 text-slate-200';

            if (showResult) {
              if (isCorrect) {
                cardStyle = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 shadow-lg shadow-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                cardStyle = 'border-red-500 bg-red-950/80 text-red-200 shadow-lg shadow-red-500/20';
              } else {
                cardStyle = 'border-slate-800 bg-slate-950/40 opacity-50 text-slate-400';
              }
            } else if (isSelected) {
              cardStyle = 'border-purple-500 bg-purple-950 text-white shadow-lg shadow-purple-500/30';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered || timeLeft === 0}
                className={`p-5 rounded-2xl border font-bold text-sm text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black text-purple-300 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{optionText}</span>
                </div>

                {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Instant Answer Explanation Box */}
        {(hasAnswered || timeLeft === 0) && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Explication Otaku :
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Live Players Real-time Leaderboard Snippet */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto py-1">
          {playersList.map((p) => {
            const av = getAvatarById(p.avatarId);
            return (
              <div
                key={p.uid}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0"
              >
                <div
                  className="w-6 h-6 rounded-full p-0.5 overflow-hidden"
                  style={{ backgroundColor: av.accentColor }}
                >
                  <div
                    className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                  />
                </div>
                <span className="text-xs font-bold text-white">{p.username}</span>
                <span className="text-xs font-black text-amber-400">{p.score} pts</span>
              </div>
            );
          })}
        </div>

        {/* Host Next Question Control */}
        {isHost && (hasAnswered || timeLeft === 0) && (
          <button
            onClick={handleNextQuestion}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Question Suivante</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
