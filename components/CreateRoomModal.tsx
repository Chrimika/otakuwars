'use client';

import React, { useState } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { createGameRoom } from '../lib/gameService';
import { X, Clock, HelpCircle, Swords, Layers } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onRoomCreated: (room: GameRoom) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  user,
  onClose,
  onRoomCreated,
}) => {
  const [roomName, setRoomName] = useState(`Salon de ${user.username}`);
  const [category, setCategory] = useState('all');
  const [timerPerQuestion, setTimerPerQuestion] = useState(10); // 10s default
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const room = await createGameRoom(
        user,
        roomName.trim() || `Salon de ${user.username}`,
        category,
        timerPerQuestion,
        totalQuestions
      );
      onRoomCreated(room);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 mb-3 text-white shadow-lg shadow-purple-600/40">
            <Swords className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            CRÉER UN SALON DE QUIZ OTAKU
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configurez votre arène et invitez d\'autres joueurs à vous rejoindre
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Nom du Salon
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Ex: Arène Konoha, Shonen Clash..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Category Theme */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Thème du Quiz
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: ' Tous les Animes', icon: '🌟' },
                { id: 'shonen', label: 'Shonen Classics', icon: '⚡' },
                { id: 'seinen', label: 'Seinen & Dark', icon: '🩸' },
                { id: 'isekai', label: 'Isekai & Fantasy', icon: '🗡️' },
                { id: 'quotes', label: 'Citations & Repliques', icon: '💬' },
                { id: 'hardcore', label: 'Hardcore Trivia', icon: '🔥' },
              ].map((cat) => {
                const isSel = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isSel
                        ? 'border-purple-500 bg-purple-950/80 text-white shadow-md shadow-purple-500/20'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Timer Settings (10s Default!) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Temps par Question (Secondes)
              </label>
              <span className="text-xs font-extrabold text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                {timerPerQuestion} Secondes
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 30].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimerPerQuestion(t)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    timerPerQuestion === t
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/20'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}s {t === 10 ? '⭐' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                Nombre de Questions
              </label>
              <span className="text-xs font-extrabold text-purple-300 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40">
                {totalQuestions} Questions
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalQuestions(num)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    totalQuestions === num
                      ? 'border-purple-400 bg-purple-600/30 text-purple-200 shadow-md shadow-purple-500/20'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-purple-600/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isCreating ? 'Création du Salon...' : 'Lancer le Salon de Jeu 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};
