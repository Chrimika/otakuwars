'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CharacterRushRoom } from '../../lib/types';
import { useAppContext, requireAuth } from '../../lib/AppContext';
import { CharacterRushLobby } from '../../components/CharacterRushLobby';
import { CharacterRushGame } from '../../components/CharacterRushGame';
import { CharacterRushLeaderboard } from '../../components/CharacterRushLeaderboard';
import { CreateCharacterRushModal } from '../../components/CreateCharacterRushModal';
import { JoinCharacterRushModal } from '../../components/JoinCharacterRushModal';
import {
  subscribeToCharacterRushRooms,
  joinCharacterRushRoom as joinCharacterRushRoomService,
  recordCharacterRushResults,
  resetCharacterRushRoom,
} from '../../lib/characterRushService';
import { NeonButton } from '../../components/ui/NeonButton';
import { Panel } from '../../components/ui/Panel';
import { CipherText } from '../../components/CipherText';
import { GamingGlyphsWatermark } from '../../components/ui/GamingGlyphsWatermark';
import { Zap, Users, Clock, KeyRound, ArrowRight, ArrowLeft, Target, Trophy } from 'lucide-react';

function RafaleOtakuContent() {
  const { user, setUser } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeRoom, setActiveRoom] = useState<CharacterRushRoom | null>(null);
  const [publicRooms, setPublicRooms] = useState<CharacterRushRoom[]>([]);
  const [viewState, setViewState] = useState<'home' | 'lobby' | 'game' | 'leaderboard'>('home');

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);

  const goToAuth = () => router.push('/auth');
  const goToHome = () => router.push('/');

  // Deep link: ?code=
  useEffect(() => {
    if (!user) return;

    const code = searchParams.get('code');
    if (code && !user.isGuest) {
      joinCharacterRushRoomService(code, user).then((room) => {
        if (room) {
          setActiveRoom(room);
          setViewState('lobby');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Subscribe to public rooms
  useEffect(() => {
    const unsub = subscribeToCharacterRushRooms(setPublicRooms);
    return unsub;
  }, []);

  // Handlers
  const handleRoomCreated = (room: CharacterRushRoom) => {
    setActiveRoom(room);
    setViewState('lobby');
  };

  const handleRoomJoined = (room: CharacterRushRoom) => {
    setActiveRoom(room);
    setViewState('lobby');
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setViewState('home');
  };

  const handleGameStarted = (room: CharacterRushRoom) => {
    setActiveRoom(room);
    setViewState('game');
  };

  const handleGameOver = (room: CharacterRushRoom) => {
    if (user && !user.isGuest) {
      recordCharacterRushResults(room, user).then(setUser);
    }
    setActiveRoom(room);
    setViewState('leaderboard');
  };

  const handleDirectJoin = async (r: CharacterRushRoom) => {
    if (!user || user.isGuest) {
      goToAuth();
      return;
    }
    const joined = await joinCharacterRushRoomService(r.code, user);
    if (joined) {
      setActiveRoom(joined);
      setViewState('lobby');
    }
  };

  // Filtrer les salons d'aujourd'hui
  const isToday = (timestamp: number): boolean => {
    const today = new Date();
    const roomDate = new Date(timestamp);
    return (
      roomDate.getDate() === today.getDate() &&
      roomDate.getMonth() === today.getMonth() &&
      roomDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      {/* HOME */}
      {viewState === 'home' && (
        <div>
          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="manga-halftone" />
            <div className="speed-lines" />
            <GamingGlyphsWatermark />
            <span className="font-jp absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[32vw] sm:text-[22vw] font-bold text-neon-magenta/[0.06] select-none pointer-events-none whitespace-nowrap">
              疾風
            </span>

            <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
              <button
                onClick={goToHome}
                className="inline-flex items-center gap-1.5 mb-6 text-xs text-slate-500 hover:text-neon-magenta transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 -rotate-2 clip-corner-sm bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs font-hud font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3.5 h-3.5" />
                Citez des personnages en rafale
              </div>

              <h1 className="text-5xl sm:text-7xl font-display tracking-wide text-ink leading-[1.05] mb-5">
                <CipherText text="RAFALE OTAKU" className="text-neon-magenta text-glow-magenta" />
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                Un thème, un chrono, des personnages à citer le plus vite possible. L&apos;IA
                Gemini génère les défis et valide vos réponses en temps réel.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <NeonButton
                  variant="primary"
                  onClick={() => requireAuth(user, () => setIsCreateRoomOpen(true), goToAuth)}
                >
                  <Zap className="w-4 h-4" />
                  Créer une rafale
                </NeonButton>
                <NeonButton
                  variant="secondary"
                  onClick={() => requireAuth(user, () => setIsJoinRoomOpen(true), goToAuth)}
                >
                  <KeyRound className="w-4 h-4" />
                  Rejoindre avec un code
                </NeonButton>
              </div>

              {user?.isGuest && (
                <p className="mt-4 text-xs text-slate-500">
                  <button
                    onClick={goToAuth}
                    className="text-neon-magenta underline underline-offset-2 cursor-pointer"
                  >
                    Connectez-vous
                  </button>{' '}
                  pour créer ou rejoindre une rafale.
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
                  Rafales en cours
                </h2>
                <button
                  onClick={() => requireAuth(user, () => setIsCreateRoomOpen(true), goToAuth)}
                  className="text-xs text-neon-magenta hover:brightness-125 font-hud font-bold uppercase tracking-wide transition-colors cursor-pointer"
                >
                  + Créer la mienne
                </button>
              </div>

              {publicRooms.filter((r) => r.state === 'waiting' && isToday(r.createdAt)).length ===
              0 ? (
                <Panel glow="neutral" className="py-16 text-center">
                  <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">Aucune rafale ouverte</p>
                  <p className="text-slate-600 text-xs mt-1">
                    Soyez le premier à lancer une partie !
                  </p>
                </Panel>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {publicRooms
                    .filter((r) => r.state === 'waiting' && isToday(r.createdAt))
                    .map((r) => {
                      const count = Object.keys(r.players || {}).length;
                      return (
                        <Panel
                          key={r.id}
                          glow="magenta"
                          className="group p-4 hover:border-neon-magenta/60 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate">{r.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">par {r.hostName}</p>
                            </div>
                            <span className="shrink-0 font-mono text-xs font-bold text-neon-magenta bg-neon-magenta/10 border border-neon-magenta/30 px-2 py-1">
                              {r.code}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {r.timerPerTheme}s
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {count} joueur{count > 1 ? 's' : ''}
                            </span>
                            <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                              {r.totalThemes} thèmes
                            </span>
                          </div>

                          <NeonButton
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleDirectJoin(r)}
                          >
                            Rejoindre <ArrowRight className="w-3.5 h-3.5" />
                          </NeonButton>
                        </Panel>
                      );
                    })}
                </div>
              )}
            </section>

            {/* Features */}
            <section className="mb-20">
              <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-magenta" />
                Comment ça marche ?
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: <Target className="w-5 h-5 text-neon-magenta" />,
                    title: 'Thèmes générés par IA',
                    desc: "Gemini crée des défis créatifs : cheveux rouges, sabreurs, personnages volants...",
                    glow: 'magenta' as const,
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-neon-gold" />,
                    title: '15 secondes par thème',
                    desc: 'Citez un maximum de personnages avant la fin du chrono. Rapidité = victoire!',
                    glow: 'gold' as const,
                  },
                  {
                    icon: <Trophy className="w-5 h-5 text-neon-violet" />,
                    title: 'Validation automatique',
                    desc: "L'IA vérifie chaque réponse en temps réel et attribue les points.",
                    glow: 'violet' as const,
                  },
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
          </div>
        </div>
      )}

      {/* LOBBY */}
      {viewState === 'lobby' && activeRoom && user && (
        <CharacterRushLobby
          roomId={activeRoom.id}
          user={user}
          onLeaveRoom={handleLeaveRoom}
          onGameStarted={handleGameStarted}
        />
      )}

      {/* GAME */}
      {viewState === 'game' && activeRoom && user && (
        <CharacterRushGame roomId={activeRoom.id} user={user} onGameOver={handleGameOver} />
      )}

      {/* LEADERBOARD */}
      {viewState === 'leaderboard' && activeRoom && user && (
        <CharacterRushLeaderboard
          room={activeRoom}
          user={user}
          onRematch={async () => {
            // Réinitialiser la room pour régénérer de nouveaux thèmes
            await resetCharacterRushRoom(activeRoom.id);
            setViewState('lobby');
          }}
          onHome={handleLeaveRoom}
          onUpdateUser={setUser}
        />
      )}

      {/* MODALS */}
      {user && !user.isGuest && (
        <>
          <CreateCharacterRushModal
            isOpen={isCreateRoomOpen}
            user={user}
            onClose={() => setIsCreateRoomOpen(false)}
            onRoomCreated={handleRoomCreated}
          />
          <JoinCharacterRushModal
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

export default function RafaleOtakuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-void" />}>
      <RafaleOtakuContent />
    </Suspense>
  );
}
