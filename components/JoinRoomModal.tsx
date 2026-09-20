'use client';

import React, { useState } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { joinGameRoom } from '../lib/gameService';
import { X, KeyRound, LogIn, AlertCircle } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';

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
      if (room) {
        onJoined(room);
        onClose();
      } else {
        setError('Salon introuvable dans Firestore. Vérifiez le code.');
      }
    } catch (err: unknown) {
      console.error('Erreur join room Firestore:', err);
      const msg = err instanceof Error ? err.message : 'Impossible de rejoindre le salon.';
      if (msg.includes('permission-denied') || msg.includes('permission')) {
        setError('Accès Firestore refusé par les règles de sécurité Firebase.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-sm animate-fade-in">
      <Panel glow="crimson" className="w-full max-w-sm p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 clip-corner-sm w-8 h-8 flex items-center justify-center bg-white/5 border border-crimson/20 hover:border-crimson/60 text-slate-400 hover:text-crimson transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="clip-corner-sm w-10 h-10 bg-crimson/10 border border-crimson/40 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-crimson" />
          </div>
          <div>
            <h2 className="text-lg font-display font-black text-white">Rejoindre un salon</h2>
            <p className="text-xs text-slate-500">Entrez le code partagé par l&apos;hôte</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-3">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="OTK-XXXX"
            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-center font-mono font-black text-2xl tracking-widest text-crimson uppercase focus:border-crimson focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,229,255,0.15)] transition-all"
            required
          />
          <NeonButton type="submit" variant="primary" disabled={loading} className="w-full">
            <LogIn className="w-4 h-4" />
            {loading ? 'Recherche dans Firestore...' : 'Rejoindre'}
          </NeonButton>
        </form>
      </Panel>
    </div>
  );
};
