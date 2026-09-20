'use client';

import React, { useState } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { createGameRoom } from '../lib/gameService';
import { X, Clock, Swords, Layers, AlertCircle } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';
import {
  ImpactBurstIcon, LightningIcon, DropIcon, ToriiIcon, SpeechBubbleIcon,
  KatanaIcon, RobotIcon, MoonStarIcon, CupIcon, BallIcon, MagnifierIcon,
  HeartIcon, ScrollIcon,
} from './ui/icons/OtakuIcons';

interface CreateRoomModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onRoomCreated: (room: GameRoom) => void;
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-crimson focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,229,255,0.15)] transition-all';

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, user, onClose, onRoomCreated }) => {
  const [roomName, setRoomName] = useState(`Salon de ${user.username}`);
  const [category, setCategory] = useState('all');
  const [timer, setTimer] = useState(10);
  const [nbQ, setNbQ] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tous les animes', icon: ImpactBurstIcon },
    { id: 'shonen', label: 'Shonen', icon: LightningIcon },
    { id: 'seinen', label: 'Seinen & Dark', icon: DropIcon },
    { id: 'isekai', label: 'Isekai', icon: ToriiIcon },
    { id: 'quotes', label: 'Citations', icon: SpeechBubbleIcon },
    { id: 'hardcore', label: 'Hardcore', icon: KatanaIcon },
    { id: 'mecha', label: 'Mecha', icon: RobotIcon },
    { id: 'magical_girl', label: 'Magical Girl', icon: MoonStarIcon },
    { id: 'slice_of_life', label: 'Tranche de vie', icon: CupIcon },
    { id: 'sports', label: 'Sports', icon: BallIcon },
    { id: 'thriller', label: 'Thriller / Mystère', icon: MagnifierIcon },
    { id: 'romance', label: 'Romance', icon: HeartIcon },
    { id: 'historical', label: 'Historique', icon: ScrollIcon },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const room = await createGameRoom(user, roomName.trim() || `Salon de ${user.username}`, category, timer, nbQ);
      onRoomCreated(room);
      onClose();
    } catch (err: unknown) {
      console.error('Erreur création salon:', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du salon Firestore.';
      if (msg.includes('permission-denied') || msg.includes('permission')) {
        setErrorMsg('Règles Firestore bloquées. Dans Firebase Console -> Firestore Database -> Rules, définissez `allow read, write: if true;` pour autoriser le mode test.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-sm animate-fade-in">
      <Panel glow="crimson" className="w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 clip-corner-sm w-8 h-8 flex items-center justify-center bg-white/5 border border-crimson/20 hover:border-crimson/60 text-slate-400 hover:text-crimson transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="clip-corner-sm w-10 h-10 bg-crimson/10 border border-crimson/40 flex items-center justify-center">
            <Swords className="w-5 h-5 text-crimson" />
          </div>
          <div>
            <h2 className="text-lg font-display font-black text-white">Créer un salon</h2>
            <p className="text-xs text-slate-500">Configurez votre arène de quiz</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nom du salon</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Thème</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white/[0.02] rounded-xl border border-white/8">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    category === c.id
                      ? 'border-crimson bg-crimson/10 text-white'
                      : 'border-white/8 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  <c.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neon-gold" />
                Temps par question
              </label>
              <span className="text-xs font-bold text-neon-gold">{timer}s</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[5, 10, 15, 20, 30].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimer(t)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    timer === t
                      ? 'border-neon-gold/60 bg-neon-gold/10 text-neon-gold'
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
                <Layers className="w-3.5 h-3.5 text-neon-violet" />
                Questions
              </label>
              <span className="text-xs font-bold text-neon-violet">{nbQ}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNbQ(n)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    nbQ === n
                      ? 'border-neon-violet/60 bg-neon-violet/10 text-neon-violet'
                      : 'border-white/8 text-slate-500 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <NeonButton type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? 'Création...' : 'Lancer le salon'}
          </NeonButton>
        </form>
      </Panel>
    </div>
  );
};
