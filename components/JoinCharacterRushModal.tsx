'use client';

import React, { useState } from 'react';
import { UserProfile, CharacterRushRoom } from '../lib/types';
import { joinCharacterRushRoom } from '../lib/characterRushService';
import { X, KeyRound, AlertCircle, Loader } from 'lucide-react';
import { soundFx } from '../lib/soundEffects';
import { NeonButton } from './ui/NeonButton';
import { Panel } from './ui/Panel';

interface JoinCharacterRushModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onJoined: (room: CharacterRushRoom) => void;
}

export const JoinCharacterRushModal: React.FC<JoinCharacterRushModalProps> = ({
  isOpen,
  user,
  onClose,
  onJoined,
}) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg('Entrez un code de salon');
      return;
    }

    setLoading(true);
    try {
      const room = await joinCharacterRushRoom(cleanCode, user);
      if (room) {
        soundFx.playCorrect();
        onJoined(room);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Impossible de rejoindre ce salon.';
      setErrorMsg(msg);
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
            <KeyRound className="w-5 h-5 text-neon-magenta" />
          </div>
          <div>
            <h2 className="text-lg font-display font-black text-white">Rejoindre une Rafale</h2>
            <p className="text-xs text-slate-500">Entrez le code du salon</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Code du salon
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setErrorMsg('');
              }}
              placeholder="RFO-XXXX"
              className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-mono font-bold tracking-widest text-center placeholder-slate-600 focus:border-neon-magenta focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,46,136,0.15)] transition-all uppercase"
              maxLength={8}
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-2">
              Le code commence généralement par <span className="text-neon-magenta font-mono">RFO-</span>
            </p>
          </div>

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
              disabled={loading || !code.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Rejoindre
                </>
              )}
            </NeonButton>
          </div>
        </form>
      </Panel>
    </div>
  );
};
