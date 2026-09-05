'use client';

import React, { useState } from 'react';
import { UserProfile } from '../lib/types';
import { OTAKU_AVATARS } from '../data/avatars';
import { X, Sparkles, UserCheck, Shield, Zap } from 'lucide-react';
import { getFirebaseInstance } from '../lib/firebase';
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'login' | 'guest'>('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(OTAKU_AVATARS[0].id);
  const [favoriteAnime, setFavoriteAnime] = useState('One Piece');
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
      if (mode === 'guest') {
        const guestUid = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        if (isConfigured && auth) {
          try {
            await signInAnonymously(auth);
          } catch {
            // fallback
          }
        }
        const guestProfile: UserProfile = {
          uid: guestUid,
          username: username.trim() || `Otaku_${Math.floor(Math.random() * 9000 + 1000)}`,
          otakuTitle: avatarObj.title,
          avatarId: avatarObj.id,
          favoriteAnime: favoriteAnime || 'Dragon Ball Z',
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          isGuest: true,
          createdAt: Date.now(),
        };
        localStorage.setItem('otakuwars_user', JSON.stringify(guestProfile));
        onSuccess(guestProfile);
        onClose();
        return;
      }

      if (mode === 'signup') {
        if (!username.trim() || !email || !password) {
          setErrorMsg('Veuillez remplir tous les champs obligatoires.');
          setLoading(false);
          return;
        }

        let userUid = `user_${Date.now()}`;
        if (isConfigured && auth) {
          try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            userUid = res.user.uid;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erreur d\'inscription Firebase';
            console.warn('Firebase auth error, continuing with local profile:', err);
            setErrorMsg(`Note Firebase: ${message}. Connexion locale en cours...`);
          }
        }

        const newProfile: UserProfile = {
          uid: userUid,
          username: username.trim(),
          email,
          otakuTitle: avatarObj.title,
          avatarId: avatarObj.id,
          favoriteAnime: favoriteAnime || 'Naruto Shippuden',
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          isGuest: false,
          createdAt: Date.now(),
        };

        localStorage.setItem('otakuwars_user', JSON.stringify(newProfile));
        onSuccess(newProfile);
        onClose();
      } else if (mode === 'login') {
        if (!email || !password) {
          setErrorMsg('Veuillez entrer votre email et mot de passe.');
          setLoading(false);
          return;
        }

        let userUid = `user_${Date.now()}`;
        if (isConfigured && auth) {
          try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            userUid = res.user.uid;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erreur de connexion Firebase';
            setErrorMsg(`Erreur de connexion: ${message}`);
            setLoading(false);
            return;
          }
        }

        // Retrieve existing profile or construct default
        const stored = localStorage.getItem('otakuwars_user');
        let userProfile: UserProfile;
        if (stored) {
          userProfile = JSON.parse(stored);
        } else {
          userProfile = {
            uid: userUid,
            username: email.split('@')[0],
            email,
            otakuTitle: avatarObj.title,
            avatarId: avatarObj.id,
            favoriteAnime: 'Jujutsu Kaisen',
            gamesPlayed: 0,
            wins: 0,
            totalScore: 0,
            isGuest: false,
            createdAt: Date.now(),
          };
        }
        localStorage.setItem('otakuwars_user', JSON.stringify(userProfile));
        onSuccess(userProfile);
        onClose();
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/50 mb-3 text-purple-400 shadow-lg shadow-purple-900/40">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            {mode === 'signup' ? 'REJOINDRE L\'ARÈNE OTAKU' : mode === 'login' ? 'CONNEXION JOUEUR' : 'JOUER EN EXPRÈS'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personnalisez votre avatar Otaku et défiez la communauté en direct
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode('guest')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'guest'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mode Invité ⚡
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          {mode !== 'login' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Pseudo Otaku *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Kakashi_Sama, Zoro_99"
                required={mode === 'signup'}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Email / Password */}
          {mode !== 'guest' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="otaku@warriors.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </>
          )}

          {/* Favorite Anime */}
          {mode !== 'login' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Anime Préféré
              </label>
              <input
                type="text"
                value={favoriteAnime}
                onChange={(e) => setFavoriteAnime(e.target.value)}
                placeholder="Ex: One Piece, Jujutsu Kaisen, Solo Leveling..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Avatar Selector Grid */}
          {mode !== 'login' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Choisissez votre Avatar Otaku
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
                {OTAKU_AVATARS.map((av) => {
                  const isSelected = selectedAvatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`relative p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-400 bg-purple-950/80 shadow-lg shadow-purple-500/40 scale-105'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 overflow-hidden"
                        style={{ backgroundColor: av.accentColor }}
                      >
                        <div
                          className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                        />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-300 truncate w-full text-center">
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading
              ? 'Traitement en cours...'
              : mode === 'signup'
              ? 'Créer mon Profil Otaku 🚀'
              : mode === 'login'
              ? 'Se Connecter'
              : 'Entrer dans l\'Arène (Invité) ⚡'}
          </button>
        </form>
      </div>
    </div>
  );
};
