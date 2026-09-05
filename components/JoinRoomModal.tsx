'use client';

import React, { useState } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { joinGameRoom } from '../lib/gameService';
import { X, KeyRound, LogIn, Sparkles } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onJoined: (room: GameRoom) => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  user,
  onClose,
  onJoined,
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const code = roomCode.trim().toUpperCase();

    if (!code) {
      setErrorMsg('Veuillez saisir un code de salon valide.');
      return;
    }

    setLoading(true);
    try {
      const room = await joinGameRoom(code, user);
      if (room) {
        onJoined(room);
        onClose();
      } else {
        setErrorMsg('Salon introuvable. Vérifiez le code de salon et réessayez.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Impossible de rejoindre le salon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 mb-3 text-white shadow-lg shadow-cyan-500/30">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            REJOINDRE UN SALON
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Entrez le code d\'invitation partagé par l\'hôte de la partie
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 text-center">
              Code du Salon (Ex: OTK-AB12)
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="OTK-XXXX"
              className="w-full px-4 py-4 rounded-2xl bg-slate-950 border border-slate-700 text-center font-mono font-extrabold text-2xl tracking-widest text-cyan-300 uppercase focus:border-cyan-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Recherche du Salon...' : 'Entrer dans le Salon ⚡'}
          </button>
        </form>
      </div>
    </div>
  );
};
