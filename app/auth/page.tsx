'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseInstance } from '../../lib/firebase';
import { getUserProfileFromFirestore, saveUserProfileToFirestore } from '../../lib/gameService';
import { useAppContext } from '../../lib/AppContext';
import { UserProfile } from '../../lib/types';
import { CAMEROON_CITIES } from '../../data/cities';
import { OtakuTestQuestion, pickRandomQuestions } from '../../data/otakuTest';
import { OTAKU_AVATARS } from '../../data/avatars';
import { NeonButton } from '../../components/ui/NeonButton';
import { Panel } from '../../components/ui/Panel';
import { KatanaIcon, ToriiIcon } from '../../components/ui/icons/OtakuIcons';
import { ArrowLeft, ArrowRight, AlertCircle, LogIn } from 'lucide-react';

const STEP_LABELS = ['Pays', 'Sexe', 'Contact', 'Top mangas', 'Test otaku', 'Connexion'];
const TEST_SIZE = 3;

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAppContext();

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<'homme' | 'femme' | null>(null);
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [topManga, setTopManga] = useState(['', '', '']);
  const [testQuestions, setTestQuestions] = useState<OtakuTestQuestion[]>(() => pickRandomQuestions(TEST_SIZE));
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TEST_SIZE).fill(null));
  const [testError, setTestError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canNext = (): boolean => {
    if (step === 1) return gender !== null;
    if (step === 2) return city !== '' && phone.trim() !== '';
    if (step === 3) return topManga.every((m) => m.trim() !== '');
    if (step === 4) return answers.every((a) => a !== null);
    return true;
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const handleTestNext = () => {
    if (!answers.every((a) => a !== null)) {
      setTestError('Réponds aux 3 questions.');
      return;
    }
    const allCorrect = testQuestions.every((q, i) => answers[i] === q.correctIndex);
    if (!allCorrect) {
      setTestError('Pas tout à fait... Un vrai otaku aurait trouvé ! Nouvel essai avec de nouvelles questions.');
      setTestQuestions(pickRandomQuestions(TEST_SIZE));
      setAnswers(Array(TEST_SIZE).fill(null));
      return;
    }
    setTestError('');
    setStep(5);
  };

  const next = () => {
    if (step === 4) { handleTestNext(); return; }
    setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1));
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const { auth, isConfigured } = getFirebaseInstance();

    if (!isConfigured || !auth) {
      setError('Firebase non configuré.');
      setLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;

      let profile = await getUserProfileFromFirestore(gUser.uid);
      let isNewAccount = false;

      if (!profile) {
        isNewAccount = true;
        const av = OTAKU_AVATARS[0];
        profile = {
          uid: gUser.uid,
          username: gUser.displayName || `Otaku_${Math.floor(Math.random() * 9000 + 1000)}`,
          email: gUser.email || undefined,
          otakuTitle: av.title,
          avatarId: av.id,
          favoriteAnime: topManga[0] || 'One Piece',
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          isGuest: false,
          createdAt: Date.now(),
          country: 'Cameroun',
          gender: gender || undefined,
          city,
          phone: phone.trim() || undefined,
          topManga: topManga.filter(Boolean),
          otakuScore: TEST_SIZE,
        };
        await saveUserProfileToFirestore(profile);
      }

      localStorage.setItem('otakuwars_user', JSON.stringify(profile));
      setUser(profile as UserProfile);

      router.push(isNewAccount ? '/auth/avatar' : '/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connexion Google impossible.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="clip-corner-sm w-12 h-12 bg-crimson/10 border border-crimson/40 flex items-center justify-center mx-auto mb-3">
          <KatanaIcon className="w-6 h-6 text-crimson" />
        </div>
        <h1 className="font-display text-3xl text-ink mb-1">Rejoindre l&apos;arène</h1>
        <p className="text-xs text-slate-500 mb-3">Quelques étapes pour prouver que tu es un vrai otaku</p>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="text-xs font-hud font-bold uppercase tracking-wide text-crimson hover:brightness-125 underline underline-offset-2 cursor-pointer disabled:opacity-50"
        >
          Déjà un compte ? Continuer avec Google
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1.5 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full mb-1.5 transition-all ${i <= step ? 'bg-crimson' : 'bg-white/10'}`} />
            <p className={`text-[9px] font-hud uppercase tracking-wide text-center ${i === step ? 'text-crimson' : 'text-slate-600'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <Panel glow="crimson" className="p-6 sm:p-8">
        {/* Step 0: Pays */}
        {step === 0 && (
          <div className="text-center">
            <h2 className="font-display text-xl text-white mb-4">D&apos;où viens-tu ?</h2>
            <div className="inline-flex items-center gap-3 px-5 py-4 clip-corner-sm bg-crimson/10 border border-crimson/40">
              <ToriiIcon className="w-6 h-6 text-crimson" />
              <span className="font-hud text-sm font-bold uppercase tracking-wide text-white">Cameroun</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3">D&apos;autres pays rejoindront bientôt l&apos;arène.</p>
          </div>
        )}

        {/* Step 1: Sexe */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl text-white mb-4 text-center">Tu es...</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['homme', 'femme'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-6 clip-corner-sm border text-sm font-hud font-bold uppercase tracking-wide transition-all cursor-pointer ${
                    gender === g ? 'bg-crimson text-white border-crimson' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {g === 'homme' ? 'Homme' : 'Femme'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Ville & téléphone */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl text-white mb-4 text-center">Ta ville</h2>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-crimson focus:outline-none transition-colors"
              >
                <option value="" disabled>Sélectionner une ville</option>
                {CAMEROON_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-void">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Numéro de téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-crimson focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Step 3: Top manga */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl text-white mb-4 text-center">Ton top 3 mangas</h2>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-display text-lg text-crimson w-6 text-center">{i + 1}</span>
                  <input
                    value={topManga[i]}
                    onChange={(e) => setTopManga((arr) => arr.map((v, idx) => (idx === i ? e.target.value : v)))}
                    placeholder={`Manga préféré #${i + 1}`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-crimson focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Test otaku */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-xl text-white mb-1 text-center flex items-center justify-center gap-2">
              <ToriiIcon className="w-5 h-5 text-neon-gold" />
              Le test otaku
            </h2>
            <p className="text-[11px] text-slate-500 text-center mb-5">
              Réponds correctement aux 3 questions pour prouver que tu es un vrai otaku.
            </p>

            {testError && (
              <div className="mb-4 p-3 rounded-xl bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{testError}</span>
              </div>
            )}

            <div className="space-y-5">
              {testQuestions.map((q, qi) => (
                <div key={q.id}>
                  <p className="text-sm font-bold text-white mb-2">{q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers((arr) => arr.map((v, idx) => (idx === qi ? oi : v)))}
                        className={`px-3 py-2 clip-corner-sm border text-xs text-left transition-all cursor-pointer ${
                          answers[qi] === oi
                            ? 'bg-crimson/20 border-crimson text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Google */}
        {step === 5 && (
          <div className="text-center">
            <h2 className="font-display text-xl text-white mb-2">Dernière étape</h2>
            <p className="text-xs text-slate-500 mb-1">
              Niveau otaku détecté : <span className="text-neon-gold font-bold">Légendaire</span>
            </p>
            <p className="text-xs text-slate-500 mb-6">Connecte-toi avec Google pour créer ton compte.</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <NeonButton variant="primary" onClick={handleGoogleSignIn} disabled={loading} className="w-full">
              <LogIn className="w-4 h-4" />
              {loading ? 'Connexion...' : 'Continuer avec Google'}
            </NeonButton>
          </div>
        )}
      </Panel>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex items-center justify-between mt-5">
          <NeonButton variant="ghost" size="sm" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="w-3.5 h-3.5" /> Précédent
          </NeonButton>
          <NeonButton variant="primary" size="sm" onClick={next} disabled={!canNext()}>
            {step === 4 ? 'Valider' : 'Suivant'} <ArrowRight className="w-3.5 h-3.5" />
          </NeonButton>
        </div>
      )}
    </div>
  );
}
