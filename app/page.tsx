'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { OTAKU_AVATARS, getAvatarById } from '../data/avatars';
import { Navbar } from '../components/Navbar';
import { AuthModal } from '../components/AuthModal';
import { ProfileModal } from '../components/ProfileModal';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { JoinRoomModal } from '../components/JoinRoomModal';
import { RoomLobby } from '../components/RoomLobby';
import { QuizGame } from '../components/QuizGame';
import { Leaderboard } from '../components/Leaderboard';
import { GlobalLeaderboardModal } from '../components/GlobalLeaderboardModal';
import { joinGameRoom, subscribeToPublicRooms, recordMatchResults } from '../lib/gameService';
import { initFirebase } from '../lib/firebase';
import { Swords, Users, Clock, Trophy, Sparkles, KeyRound, Radio, ArrowRight, Zap } from 'lucide-react';

// ─── Auth gate helper ─────────────────────────────────────────────────────────
function requireAuth(user: UserProfile | null, cb: () => void, openAuth: () => void) {
  if (!user || user.isGuest) {
    openAuth();
  } else {
    cb();
  }
}

function HomeContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRoom, setActiveRoom] = useState<GameRoom | null>(null);
  const [publicRooms, setPublicRooms] = useState<GameRoom[]>([]);
  const [viewState, setViewState] = useState<'home' | 'lobby' | 'game' | 'leaderboard'>('home');

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [isGlobalLeaderboardOpen, setIsGlobalLeaderboardOpen] = useState(false);

  // ── Initialise user (guest par défaut, jamais null) ───────────────────────
  // ── Initialise Firebase en premier (côté client uniquement) ───────────────
  useEffect(() => {
    initFirebase();
  }, []);

  // ── Initialise user (guest par défaut) ───────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('otakuwars_user');
    let currentUser: UserProfile | null = null;

    if (stored) {
      try { currentUser = JSON.parse(stored); } catch { /* ignore */ }
    }

    if (!currentUser) {
      const av = OTAKU_AVATARS[0];
      currentUser = {
        uid: `guest_${Date.now()}`,
        username: `Otaku_${Math.floor(Math.random() * 9000 + 1000)}`,
        otakuTitle: av.title,
        avatarId: av.id,
        favoriteAnime: 'One Piece',
        gamesPlayed: 0,
        wins: 0,
        totalScore: 0,
        isGuest: true,
        createdAt: Date.now(),
      };
      localStorage.setItem('otakuwars_user', JSON.stringify(currentUser));
    }

    setUser(currentUser);

    // Deep link via ?code=
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && currentUser && !currentUser.isGuest) {
      joinGameRoom(code, currentUser).then((room) => {
        if (room) { setActiveRoom(room); setViewState('lobby'); }
      });
    }
  }, []);

  // ── Subscribe to public rooms ─────────────────────────────────────────────
  useEffect(() => {
    const unsub = subscribeToPublicRooms(setPublicRooms);
    return unsub;
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openAuth = () => setIsAuthOpen(true);

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
    if (!user || user.isGuest) { openAuth(); return; }
    const joined = await joinGameRoom(r.id, user);
    if (joined) { setActiveRoom(joined); setViewState('lobby'); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-700/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-700/15 rounded-full blur-[120px]" />
      </div>

      <Navbar
        user={user}
        onOpenAuth={openAuth}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCreateRoom={() => requireAuth(user, () => setIsCreateRoomOpen(true), openAuth)}
        onOpenJoinRoom={() => requireAuth(user, () => setIsJoinRoomOpen(true), openAuth)}
        onOpenLeaderboard={() => setIsGlobalLeaderboardOpen(true)}
      />

      <main className="flex-1 z-10">

        {/* ── HOME ─────────────────────────────────────────────────────────── */}
        {viewState === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">

            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/60 border border-violet-700/40 text-violet-300 text-xs font-semibold mb-6">
                <Radio className="w-3.5 h-3.5 text-violet-400" />
                Quiz multijoueur en temps réel
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
                L&apos;arène ultime du{' '}
                <span className="text-violet-400">quiz otaku</span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                Affrontez d&apos;autres passionnés d&apos;animes en temps réel. Compte à rebours, score de vitesse, classement final.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => requireAuth(user, () => setIsCreateRoomOpen(true), openAuth)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all"
                >
                  <Swords className="w-4 h-4" />
                  Créer un salon
                </button>
                <button
                  onClick={() => requireAuth(user, () => setIsJoinRoomOpen(true), openAuth)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all"
                >
                  <KeyRound className="w-4 h-4 text-violet-400" />
                  Rejoindre avec un code
                </button>
              </div>

              {(user?.isGuest) && (
                <p className="mt-4 text-xs text-slate-500">
                  <button onClick={openAuth} className="text-violet-400 underline underline-offset-2 cursor-pointer">
                    Connectez-vous
                  </button>
                  {' '}pour créer ou rejoindre un salon.
                </p>
              )}
            </div>

            {/* Live rooms */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Salons ouverts
                </h2>
                <button
                  onClick={() => requireAuth(user, () => setIsCreateRoomOpen(true), openAuth)}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
                >
                  + Créer le mien
                </button>
              </div>

              {publicRooms.filter(r => r.state === 'waiting').length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
                  <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">Aucun salon ouvert</p>
                  <p className="text-slate-600 text-xs mt-1">Soyez le premier à lancer une partie !</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {publicRooms.filter(r => r.state === 'waiting').map((r) => {
                    const count = Object.keys(r.players || {}).length;
                    const av = getAvatarById(r.players[r.hostId]?.avatarId || 'goku');
                    return (
                      <div key={r.id} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-violet-700/50 transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{r.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">par {r.hostName}</p>
                          </div>
                          <span className="shrink-0 font-mono text-xs font-bold text-violet-400 bg-violet-950/60 border border-violet-800/40 px-2 py-1 rounded-lg">
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

                        <button
                          onClick={() => handleDirectJoin(r)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 border border-violet-600/30 text-violet-300 text-xs font-bold transition-all cursor-pointer"
                        >
                          Rejoindre <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Avatars */}
            <section className="mb-20">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Avatars & Rangs Otaku
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {OTAKU_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setIsProfileOpen(true)}
                    className="group p-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-violet-700/40 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl p-0.5 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: av.accentColor }}
                    >
                      <div
                        className="w-full h-full rounded-[10px] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
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
            <section>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: <Clock className="w-5 h-5 text-amber-400" />, title: 'Compte à rebours', desc: 'Par défaut 10s par question, réglable de 5s à 30s.' },
                  { icon: <Radio className="w-5 h-5 text-violet-400" />, title: 'Temps réel', desc: "Scores, réponses et transitions synchronisés via Firebase Firestore." },
                  { icon: <Trophy className="w-5 h-5 text-amber-400" />, title: 'Classement final', desc: 'Podium, confettis et statistiques détaillées en fin de partie.' },
                ].map((f) => (
                  <div key={f.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/8">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
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
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => { setUser(u); setIsAuthOpen(false); }}
      />

      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={setUser}
        onLogout={() => {
          localStorage.removeItem('otakuwars_user');
          setUser(null);
          setIsProfileOpen(false);
        }}
      />

      <GlobalLeaderboardModal
        isOpen={isGlobalLeaderboardOpen}
        onClose={() => setIsGlobalLeaderboardOpen(false)}
        currentUser={user}
      />

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

      <footer className="border-t border-white/5 py-5 text-center text-xs text-slate-700 z-10">
        © 2026 OTAKU WARS
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <HomeContent />
    </Suspense>
  );
}
