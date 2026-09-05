'use client';

import React, { useState } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { joinGameRoom } from '../lib/gameService';
import { X, KeyRound, LogIn } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onJoined: (room: GameRoom) => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, user, onClose, onJoined }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = roomCode.trim().toUpperCase();
    if (!code) { setError('Entrez un code de salon.'); return; }

    setLoading(true);
    try {
      const room = await joinGameRoom(code, user);
      if (room) { onJoined(room); onClose(); }
      else setError('Salon introuvable. Vérifiez le code.');
    } catch {
      setError('Impossible de rejoindre le salon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#111118] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Rejoindre un salon</h2>
            <p className="text-xs text-slate-500">Entrez le code partagé par l&apos;hôte</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-3">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="OTK-XXXX"
            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-center font-mono font-black text-2xl tracking-widest text-violet-300 uppercase focus:border-violet-500 focus:outline-none transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Recherche...' : 'Rejoindre'}
          </button>
        </form>
      </div>
    </div>
  );
};
