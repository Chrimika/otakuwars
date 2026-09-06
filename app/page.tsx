'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GameRoom } from '../lib/types';
import { OTAKU_AVATARS } from '../data/avatars';
import { useAppContext, requireAuth } from '../lib/AppContext';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { JoinRoomModal } from '../components/JoinRoomModal';
import { RoomLobby } from '../components/RoomLobby';
import { QuizGame } from '../components/QuizGame';
import { Leaderboard } from '../components/Leaderboard';
import { joinGameRoom, subscribeToPublicRooms, recordMatchResults, submitPartnerRequest } from '../lib/gameService';
import { NeonButton } from '../components/ui/NeonButton';
import { Panel } from '../components/ui/Panel';
import { CipherText } from '../components/CipherText';
import { GamingGlyphsWatermark } from '../components/ui/GamingGlyphsWatermark';
import { KatanaIcon, ImpactBurstIcon, ToriiIcon, ScrollIcon, OniMaskIcon } from '../components/ui/icons/OtakuIcons';
import { Users, Clock, Trophy, KeyRound, ArrowRight, Zap, UserPlus, Send, Check, Handshake } from 'lucide-react';

function HomeContent() {
  const { user, setUser } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeRoom, setActiveRoom] = useState<GameRoom | null>(null);
  const [publicRooms, setPublicRooms] = useState<GameRoom[]>([]);
  const [viewState, setViewState] = useState<'home' | 'lobby' | 'game' | 'leaderboard'>('home');

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);

  const goToAuth = () => router.push('/auth');

  // ── Deep link : ?code= (rejoindre direct depuis un lien partagé) ──────────
  useEffect(() => {
    if (!user) return;

    const code = searchParams.get('code');
    if (code && !user.isGuest) {
      joinGameRoom(code, user).then((room) => {
        if (room) { setActiveRoom(room); setViewState('lobby'); }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Subscribe to public rooms ─────────────────────────────────────────────
  useEffect(() => {
    const unsub = subscribeToPublicRooms(setPublicRooms);
    return unsub;
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRoomCreated = (room: GameRoom) => { setActiveRoom(room); setViewState('lobby'); };
  const handleRoomJoined  = (room: GameRoom) => { setActiveRoom(room); setViewState('lobby'); };
  const handleLeaveRoom   = () => { setActiveRoom(null); setViewState('home'); };
  const handleGameStarted = (room: GameRoom) => { setActiveRoom(room); setViewState('game'); };
  const handleGameOver    = (room: GameRoom) => {
    if (user && !user.isGuest) {
      recordMatchResults(room, user).then(setUser);
    }
    setActiveRoom(room);
    setViewState('leaderboard');
  };

  const handleDirectJoin = async (r: GameRoom) => {
    if (!user || user.isGuest) { goToAuth(); return; }
    const joined = await joinGameRoom(r.id, user);
    if (joined) { setActiveRoom(joined); setViewState('lobby'); }
  };

  return (
    <>
      {/* ── HOME ─────────────────────────────────────────────────────────── */}
      {viewState === 'home' && (
        <div>

          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="manga-halftone" />
            <div className="speed-lines" />
            <GamingGlyphsWatermark />
            <span className="font-jp absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[32vw] sm:text-[22vw] font-bold text-crimson/[0.06] select-none pointer-events-none whitespace-nowrap">
              対戦
            </span>

            <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 -rotate-2 clip-corner-sm bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs font-hud font-bold uppercase tracking-wider mb-6">
                <ImpactBurstIcon className="w-3.5 h-3.5" />
                Quiz multijoueur en temps réel
              </div>

              <h1 className="text-5xl sm:text-7xl font-display tracking-wide text-ink leading-[1.05] mb-5">
                L&apos;arène ultime du<br />
                <CipherText text="QUIZ OTAKU" className="text-crimson text-glow-crimson" />
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                Affrontez d&apos;autres passionnés d&apos;animes en temps réel. Compte à rebours, score de vitesse, classement final.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <NeonButton
                  variant="primary"
                  onClick={() => requireAuth(user, () => setIsCreateRoomOpen(true), goToAuth)}
                >
                  <KatanaIcon className="w-4 h-4" />
                  Créer un salon
                </NeonButton>
                <NeonButton
                  variant="secondary"
                  onClick={() => requireAuth(user, () => setIsJoinRoomOpen(true), goToAuth)}
                >
                  <KeyRound className="w-4 h-4" />
                  Rejoindre avec un code
                </NeonButton>
              </div>

              {(user?.isGuest) && (
                <p className="mt-4 text-xs text-slate-500">
                  <button onClick={goToAuth} className="text-crimson underline underline-offset-2 cursor-pointer">
                    Connectez-vous
                  </button>
                  {' '}pour créer ou rejoindre un salon.
                </p>
              )}
            </div>
          </div>
          <div className="torn-edge" />

          <div className="max-w-6xl mx-auto px-4 pt-12 pb-12 sm:pb-20">

            {/* Live rooms */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse glow-magenta" />
                  Salons ouverts
                </h2>
                <button
                  onClick={() => requireAuth(user, () => setIsCreateRoomOpen(true), goToAuth)}
                  className="text-xs text-crimson hover:brightness-125 font-hud font-bold uppercase tracking-wide transition-colors cursor-pointer"
                >
                  + Créer le mien
                </button>
              </div>

              {publicRooms.filter(r => r.state === 'waiting').length === 0 ? (
                <Panel glow="neutral" className="py-16 text-center">
                  <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">Aucun salon ouvert</p>
                  <p className="text-slate-600 text-xs mt-1">Soyez le premier à lancer une partie !</p>
                </Panel>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {publicRooms.filter(r => r.state === 'waiting').map((r) => {
                    const count = Object.keys(r.players || {}).length;
                    return (
                      <Panel key={r.id} glow="crimson" className="group p-4 hover:border-crimson/60 transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{r.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">par {r.hostName}</p>
                          </div>
                          <span className="shrink-0 font-mono text-xs font-bold text-crimson bg-crimson/10 border border-crimson/30 px-2 py-1">
                            {r.code}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{r.timerPerQuestion}s
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />{count} joueur{count > 1 ? 's' : ''}
                          </span>
                          <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                            {r.category === 'all' ? 'Tous' : r.category}
                          </span>
                        </div>

                        <NeonButton variant="primary" size="sm" className="w-full" onClick={() => handleDirectJoin(r)}>
                          Rejoindre <ArrowRight className="w-3.5 h-3.5" />
                        </NeonButton>
                      </Panel>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Avatars */}
            <section className="mb-20">
              <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5 flex items-center gap-2">
                <ToriiIcon className="w-4 h-4 text-neon-gold" />
                Avatars & Rangs Otaku
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {OTAKU_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => router.push('/compte')}
                    className="group clip-corner-sm p-3 bg-void-2/60 border border-white/8 hover:border-crimson/50 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
                  >
                    <div
                      className="clip-corner-sm w-12 h-12 p-0.5 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: av.accentColor }}
                    >
                      <div
                        className="clip-corner-sm w-full h-full bg-void flex items-center justify-center overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{av.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{av.badge}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="mb-20">
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: <Clock className="w-5 h-5 text-neon-gold" />, title: 'Compte à rebours', desc: 'Par défaut 10s par question, réglable de 5s à 30s.', glow: 'gold' as const },
                  { icon: <ImpactBurstIcon className="w-5 h-5 text-crimson" />, title: 'Temps réel', desc: "Scores, réponses et transitions synchronisés via Firebase Firestore.", glow: 'crimson' as const },
                  { icon: <Trophy className="w-5 h-5 text-neon-violet" />, title: 'Classement final', desc: 'Podium, confettis et statistiques détaillées en fin de partie.', glow: 'violet' as const },
                ].map((f) => (
                  <Panel key={f.title} glow={f.glow} className="p-5">
                    <div className="w-9 h-9 clip-corner-sm bg-white/5 flex items-center justify-center mb-3">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                  </Panel>
                ))}
              </div>
            </section>

            {/* Comment ça marche */}
            <HowItWorksSection />

            {/* Devenir partenaire */}
            <PartnerSection />
          </div>

          {/* CTA */}
          <CtaSection user={user} onCreateAccount={goToAuth} />
        </div>
      )}

      {/* ── LOBBY ────────────────────────────────────────────────────────── */}
      {viewState === 'lobby' && activeRoom && user && (
        <RoomLobby
          roomId={activeRoom.id}
          user={user}
          onLeaveRoom={handleLeaveRoom}
          onGameStarted={handleGameStarted}
        />
      )}

      {/* ── GAME ─────────────────────────────────────────────────────────── */}
      {viewState === 'game' && activeRoom && user && (
        <QuizGame roomId={activeRoom.id} user={user} onGameOver={handleGameOver} />
      )}

      {/* ── LEADERBOARD ──────────────────────────────────────────────────── */}
      {viewState === 'leaderboard' && activeRoom && user && (
        <Leaderboard
          room={activeRoom}
          user={user}
          onRematch={() => handleRoomCreated(activeRoom)}
          onHome={handleLeaveRoom}
          onUpdateUser={setUser}
        />
      )}

      {user && !user.isGuest && (
        <>
          <CreateRoomModal
            isOpen={isCreateRoomOpen}
            user={user}
            onClose={() => setIsCreateRoomOpen(false)}
            onRoomCreated={handleRoomCreated}
          />
          <JoinRoomModal
            isOpen={isJoinRoomOpen}
            user={user}
            onClose={() => setIsJoinRoomOpen(false)}
            onJoined={handleRoomJoined}
          />
        </>
      )}
    </>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: <UserPlus className="w-5 h-5 text-crimson" />, title: 'Créez un compte', desc: 'Profil otaku en quelques étapes, connexion via Google.' },
    { icon: <KatanaIcon className="w-5 h-5 text-neon-gold" />, title: 'Créez ou rejoignez', desc: 'Lancez un salon ou entrez un code partagé par un ami.' },
    { icon: <ImpactBurstIcon className="w-5 h-5 text-neon-violet" />, title: 'Répondez en direct', desc: 'Compte à rebours, score de vitesse, tout le monde en simultané.' },
    { icon: <Trophy className="w-5 h-5 text-crimson" />, title: 'Grimpez au classement', desc: 'Podium de fin de partie et classement général de la communauté.' },
  ];

  return (
    <section className="mb-20">
      <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5 flex items-center gap-2">
        <ScrollIcon className="w-4 h-4 text-neon-gold" />
        Comment ça marche
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, i) => (
          <Panel key={s.title} glow="neutral" className="p-5 relative">
            <span className="absolute -top-3 -left-1 font-display text-3xl text-crimson/30">{i + 1}</span>
            <div className="w-9 h-9 clip-corner-sm bg-white/5 flex items-center justify-center mb-3">
              {s.icon}
            </div>
            <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}

function PartnerSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitPartnerRequest({ name, email, message });
      setSent(true);
      setName(''); setEmail(''); setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="partenaire" className="mb-4 scroll-mt-24">
      <Panel glow="gold" className="p-6 sm:p-8 grid md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="w-10 h-10 clip-corner-sm bg-neon-gold/10 border border-neon-gold/40 flex items-center justify-center mb-4">
            <Handshake className="w-5 h-5 text-neon-gold" />
          </div>
          <h2 className="font-display text-2xl text-white mb-2">Devenir partenaire</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Association, boutique otaku, organisateur d&apos;événement ou éditeur de manga ?
            Associez votre marque à l&apos;arène et touchez toute la communauté Otaku Wars.
          </p>
        </div>

        {sent ? (
          <div className="flex items-center gap-2 p-4 clip-corner-sm bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-sm">
            <Check className="w-4 h-4 shrink-0" /> Merci ! Votre demande a bien été envoyée, nous revenons vers vous rapidement.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom / Structure"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-gold focus:outline-none transition-colors"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-gold focus:outline-none transition-colors"
            />
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre projet de partenariat"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-neon-gold focus:outline-none transition-colors resize-none"
            />
            <NeonButton type="submit" variant="primary" disabled={sending} className="w-full bg-neon-gold!">
              <Send className="w-4 h-4" />
              {sending ? 'Envoi...' : 'Envoyer la demande'}
            </NeonButton>
          </form>
        )}
      </Panel>
    </section>
  );
}

function CtaSection({ user, onCreateAccount }: { user: ReturnType<typeof useAppContext>['user']; onCreateAccount: () => void }) {
  if (user && !user.isGuest) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 mt-4">
      <div className="manga-halftone opacity-60" />
      <div className="speed-lines opacity-70" />
      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <OniMaskIcon className="w-10 h-10 text-crimson mx-auto mb-4" />
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-3">
          Rejoins la communauté otaku ultime
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mb-6 max-w-lg mx-auto">
          Crée ton compte, choisis ton avatar et affronte les meilleurs otakus du Cameroun et d&apos;ailleurs.
        </p>
        <NeonButton variant="primary" onClick={onCreateAccount}>
          <UserPlus className="w-4 h-4" />
          Créer mon compte
        </NeonButton>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-void" />}>
      <HomeContent />
    </Suspense>
  );
}
