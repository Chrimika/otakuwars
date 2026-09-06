'use client';

import React, { useState } from 'react';
import { submitSuggestion } from '../../lib/gameService';
import { Panel } from '../../components/ui/Panel';
import { NeonButton } from '../../components/ui/NeonButton';
import { ScrollIcon } from '../../components/ui/icons/OtakuIcons';
import { Send, Check } from 'lucide-react';

const CATEGORIES = ['Bug', 'Idée de fonctionnalité', 'Contenu (quiz, œuvres)', 'Autre'];

export default function SuggestionsPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitSuggestion({ category, message, contact: contact || undefined });
      setSent(true);
      setMessage('');
      setContact('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-60" />
        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 clip-corner-sm bg-neon-violet/10 border border-neon-violet/40 text-neon-violet text-xs font-hud font-bold uppercase tracking-wider mb-5">
            <ScrollIcon className="w-3.5 h-3.5" />
            Ta voix compte
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">Boîte à suggestions</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Un bug, une idée, une œuvre à ajouter ? Dis-nous tout, on lit chaque message.
          </p>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-lg mx-auto px-4 py-12">
        <Panel glow="violet" className="p-6 sm:p-8">
          {sent ? (
            <div className="flex items-center gap-2 p-4 clip-corner-sm bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-sm">
              <Check className="w-4 h-4 shrink-0" /> Merci ! Ta suggestion a bien été envoyée.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Catégorie</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`px-3 py-2 clip-corner-sm border text-xs font-semibold transition-all cursor-pointer ${
                        category === c
                          ? 'border-neon-violet bg-neon-violet/10 text-white'
                          : 'border-white/8 bg-white/[0.02] text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décris ton idée ou le problème rencontré..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-violet focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact (optionnel)</label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email ou pseudo, si tu veux une réponse"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-violet focus:outline-none transition-colors"
                />
              </div>

              <NeonButton type="submit" variant="secondary" disabled={sending} className="w-full">
                <Send className="w-4 h-4" />
                {sending ? 'Envoi...' : 'Envoyer'}
              </NeonButton>
            </form>
          )}
        </Panel>
      </div>
    </div>
  );
}
