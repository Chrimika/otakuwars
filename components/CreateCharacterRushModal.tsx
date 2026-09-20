'use client';

import React, { useState } from 'react';
import { UserProfile, CharacterRushRoom } from '../lib/types';
import { createCharacterRushRoom } from '../lib/characterRushService';
import { X, Clock, Zap, Layers, AlertCircle } from 'lucide-react';
import { soundFx } from '../lib/soundEffects';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';

interface CreateCharacterRushModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onRoomCreated: (room: CharacterRushRoom) => void;
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-magenta focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,46,136,0.15)] transition-all';

export const CreateCharacterRushModal: React.FC<CreateCharacterRushModalProps> = ({
  isOpen,
  user,
  onClose,
  onRoomCreated,
}) => {
  const [roomName, setRoomName] = useState(`Rafale de ${user.username}`);
  const [timer, setTimer] = useState(15);
  const [totalThemes, setTotalThemes] = useState(20);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const room = await createCharacterRushRoom(
        user,
        roomName.trim() || `Rafale de ${user.username}`,
        timer,
        totalThemes
      );
      soundFx.playCorrect();
      onRoomCreated(room);
      onClose();
    } catch (err: unknown) {
      console.error('Erreur création salon:', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du salon.';
      if (msg.includes('permission-denied') || msg.includes('permission')) {
        setErrorMsg(
          'Règles Firestore bloquées. Dans Firebase Console → Firestore Database → Rules, autorisez l\'accès en mode test.'
        );
      } else {
        setErrorMsg(msg);
      }
      soundFx.playWrong();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    soundFx.playTick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-sm animate-fade-in">
      <Panel glow="magenta" className="w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 clip-corner-sm w-8 h-8 flex items-center justify-center bg-white/5 border border-neon-magenta/20 hover:border-neon-magenta/60 text-slate-400 hover:text-neon-magenta transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="clip-corner-sm w-10 h-10 bg-neon-magenta/10 border border-neon-magenta/40 flex items-center justify-center">
            <Zap className="w-5 h-5 text-neon-magenta" />
          </div>
          <div>
            <h2 className="text-lg font-display font-black text-white">Créer une Rafale Otaku</h2>
            <p className="text-xs text-slate-500">Configurez votre partie</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Nom du salon */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Nom du salon
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={`Rafale de ${user.username}`}
              className={inputClass}
              maxLength={50}
            />
          </div>

          {/* Timer par thème */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neon-gold" />
              Temps par thème : <span className="text-neon-magenta font-bold">{timer}s</span>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              className="w-full accent-neon-magenta"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>5s (Rapide)</span>
              <span>15s (Normal)</span>
              <span>30s (Détente)</span>
            </div>
          </div>

          {/* Nombre de thèmes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-neon-violet" />
              Nombre de thèmes : <span className="text-neon-magenta font-bold">{totalThemes}</span>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={totalThemes}
              onChange={(e) => setTotalThemes(Number(e.target.value))}
              className="w-full accent-neon-magenta"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>5 (Rapide)</span>
              <span>20 (Normal)</span>
              <span>30 (Marathon)</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl bg-neon-magenta/10 border border-neon-magenta/30">
            <p className="text-xs text-slate-300 leading-relaxed">
              <Zap className="w-3.5 h-3.5 text-neon-magenta inline mr-1" />
              Les thèmes seront générés automatiquement par l&apos;IA Gemini au démarrage de la
              partie. Attendez-vous à des thèmes créatifs et variés !
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <NeonButton
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </NeonButton>
            <NeonButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Création...' : 'Créer'}
            </NeonButton>
          </div>
        </form>
      </Panel>
    </div>
  );
};
