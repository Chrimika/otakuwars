'use client';

import React, { useState } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { createGameRoom } from '../lib/gameService';
import { X, Clock, Swords, Layers } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onRoomCreated: (room: GameRoom) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, user, onClose, onRoomCreated }) => {
  const [roomName, setRoomName] = useState(`Salon de ${user.username}`);
  const [category, setCategory] = useState('all');
  const [timer, setTimer] = useState(10);
  const [nbQ, setNbQ] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tous les animes', icon: '🌟' },
    { id: 'shonen', label: 'Shonen', icon: '⚡' },
    { id: 'seinen', label: 'Seinen & Dark', icon: '🩸' },
    { id: 'isekai', label: 'Isekai', icon: '🗡️' },
    { id: 'quotes', label: 'Citations', icon: '💬' },
    { id: 'hardcore', label: 'Hardcore', icon: '🔥' },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const room = await createGameRoom(user, roomName.trim() || `Salon de ${user.username}`, category, timer, nbQ);
      onRoomCreated(room);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Swords className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Créer un salon</h2>
            <p className="text-xs text-slate-500">Configurez votre arène de quiz</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nom du salon</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Thème</label>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    category === c.id
                      ? 'border-violet-500 bg-violet-950/60 text-white'
                      : 'border-white/8 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Temps par question
              </label>
              <span className="text-xs font-bold text-amber-400">{timer}s</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[5, 10, 15, 20, 30].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimer(t)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    timer === t
                      ? 'border-amber-500/60 bg-amber-950/60 text-amber-300'
                      : 'border-white/8 text-slate-500 hover:text-white'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          {/* Nb questions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                Questions
              </label>
              <span className="text-xs font-bold text-violet-400">{nbQ}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNbQ(n)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    nbQ === n
                      ? 'border-violet-500/60 bg-violet-950/60 text-violet-300'
                      : 'border-white/8 text-slate-500 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Lancer le salon'}
          </button>
        </form>
      </div>
    </div>
  );
};
