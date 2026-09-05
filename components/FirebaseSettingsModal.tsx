'use client';

import React, { useState } from 'react';
import { getFirebaseInstance, saveCustomFirebaseConfig } from '../lib/firebase';
import { X, Database, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isConfigured } = getFirebaseInstance();
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [appId, setAppId] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) return;

    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      appId: appId.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
            <Database className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            CONFIGURATION FIREBASE EN TEMPS RÉEL
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Synchronisation `onSnapshot` Firestore native cloud
          </p>
        </div>

        {/* Current status banner */}
        <div
          className={`p-4 rounded-2xl mb-6 border flex items-center gap-3 ${
            isConfigured
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}
        >
          {isConfigured ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-6 h-6 text-amber-400 shrink-0" />
          )}
          <div className="text-xs">
            <span className="font-bold block text-sm">
              {isConfigured ? 'Statut : Firebase Connecté !' : 'Statut : Synchronisation locale temps réel active'}
            </span>
            <span>
              {isConfigured
                ? 'Les écouteurs onSnapshot Firestore sont actifs pour toutes vos parties multijoueurs.'
                : 'L\'application tourne actuellement en mode temps réel BroadcastChannel multi-onglets.'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Firebase API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyC..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Project ID
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="otaku-wars-app"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Auth Domain (Optionnel)
            </label>
            <input
              type="text"
              value={authDomain}
              onChange={(e) => setAuthDomain(e.target.value)}
              placeholder="otaku-wars-app.firebaseapp.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center">
              🔥 Firebase initialisé avec succès !
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
          >
            Activer Firebase Cloud Live
          </button>
        </form>
      </div>
    </div>
  );
};
