'use client';

import React, { useState } from 'react';
import { UserProfile } from '../lib/types';
import { OTAKU_AVATARS } from '../data/avatars';
import { X, Sparkles, LogIn } from 'lucide-react';
import { getFirebaseInstance } from '../lib/firebase';
import { saveUserProfileToFirestore, getUserProfileFromFirestore } from '../lib/gameService';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(OTAKU_AVATARS[0].id);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const avatarObj = OTAKU_AVATARS.find((a) => a.id === selectedAvatarId) || OTAKU_AVATARS[0];
    const { auth, isConfigured } = getFirebaseInstance();

    try {
      if (mode === 'signup') {
        if (!username.trim() || !email || !password) {
          setErrorMsg('Veuillez remplir tous les champs.');
          setLoading(false);
          return;
        }

        let uid = `user_${Date.now()}`;
        if (isConfigured && auth) {
          try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            uid = res.user.uid;
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erreur inscription';
            setErrorMsg(msg);
            setLoading(false);
            return;
          }
        }

        const profile: UserProfile = {
          uid,
          username: username.trim(),
          email,
          otakuTitle: avatarObj.title,
          avatarId: avatarObj.id,
          favoriteAnime: 'One Piece',
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          isGuest: false,
          createdAt: Date.now(),
        };

        // Enregistrement simultané local + Firestore `users/{uid}`
        await saveUserProfileToFirestore(profile);
        localStorage.setItem('otakuwars_user', JSON.stringify(profile));
        onSuccess(profile);

      } else {
        if (!email || !password) {
          setErrorMsg('Email et mot de passe requis.');
          setLoading(false);
          return;
        }

        let uid = `user_${Date.now()}`;
        if (isConfigured && auth) {
          try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            uid = res.user.uid;
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erreur connexion';
            setErrorMsg(msg);
            setLoading(false);
            return;
          }
        }

        // Tenter de récupérer le profil complet depuis Firestore `users/{uid}`
        let profile = await getUserProfileFromFirestore(uid);

        if (!profile) {
          const stored = localStorage.getItem('otakuwars_user');
          profile = stored ? JSON.parse(stored) : {
            uid,
            username: email.split('@')[0],
            email,
            otakuTitle: avatarObj.title,
            avatarId: avatarObj.id,
            favoriteAnime: 'One Piece',
            gamesPlayed: 0,
            wins: 0,
            totalScore: 0,
            isGuest: false,
            createdAt: Date.now(),
          };
          if (profile) profile.uid = uid;
        }

        if (profile) {
          profile.isGuest = false;
          await saveUserProfileToFirestore(profile);
          localStorage.setItem('otakuwars_user', JSON.stringify(profile));
          onSuccess(profile);
        }
      }
    } catch {
      setErrorMsg('Une erreur inattendue est survenue.');
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

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <h2 className="text-xl font-black text-white">
            {mode === 'signup' ? 'Rejoindre l\u2019arène' : 'Se connecter'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Un compte est requis pour créer ou rejoindre un salon
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${mode === 'signup' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${mode === 'login' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Connexion
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Pseudo</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Kakashi_Sama"
                required={mode === 'signup'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="otaku@example.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Avatar picker (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Avatar</label>
              <div className="grid grid-cols-5 gap-1.5 p-2 bg-white/[0.02] rounded-xl border border-white/8 max-h-36 overflow-y-auto">
                {OTAKU_AVATARS.map((av) => {
                  const sel = selectedAvatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${sel ? 'border-violet-500 bg-violet-950/60 scale-105' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}
                    >
                      <div
                        className="w-8 h-8 rounded-full p-0.5 mx-auto overflow-hidden"
                        style={{ backgroundColor: av.accentColor }}
                      >
                        <div
                          className="w-full h-full rounded-full bg-[#0a0a0f]"
                          dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Chargement...' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};
