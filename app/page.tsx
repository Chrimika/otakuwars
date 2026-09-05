'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { UserProfile, GameRoom } from '../lib/types';
import { OTAKU_AVATARS, getAvatarById } from '../data/avatars';
import { Navbar } from '../components/Navbar';
import { AuthModal } from '../components/AuthModal';
import { ProfileModal } from '../components/ProfileModal';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { JoinRoomModal } from '../components/JoinRoomModal';
import { FirebaseSettingsModal } from '../components/FirebaseSettingsModal';
import { RoomLobby } from '../components/RoomLobby';
import { QuizGame } from '../components/QuizGame';
import { Leaderboard } from '../components/Leaderboard';
import { joinGameRoom } from '../lib/gameService';
import {
  Flame,
  Swords,
  Users,
  Clock,
  Trophy,
  Sparkles,
  Zap,
  Play,
  KeyRound,
  Shield,
  Radio,
  Star,
  ChevronRight,
} from 'lucide-react';

function HomeContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRoom, setActiveRoom] = useState<GameRoom | null>(null);
  const [viewState, setViewState] = useState<'home' | 'lobby' | 'game' | 'leaderboard'>('home');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Load stored user profile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('otakuwars_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      } else {
        // Create default guest profile for immediate instant play
        const defaultAvatar = OTAKU_AVATARS[0];
        const defaultGuest: UserProfile = {
          uid: `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          username: `Otaku_${Math.floor(Math.random() * 9000 + 1000)}`,
          otakuTitle: defaultAvatar.title,
          avatarId: defaultAvatar.id,
          favoriteAnime: 'One Piece',
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          isGuest: true,
          createdAt: Date.now(),
        };
        localStorage.setItem('otakuwars_user', JSON.stringify(defaultGuest));
        setUser(defaultGuest);
      }

      // Check URL search params for direct room code (e.g., ?code=OTK-A8F3)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code && stored) {
        try {
          const u = JSON.parse(stored);
          joinGameRoom(code, u).then((room) => {
            if (room) {
              setActiveRoom(room);
              setViewState('lobby');
            }
          });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleRoomCreated = (room: GameRoom) => {
    setActiveRoom(room);
    setViewState('lobby');
  };

  const handleRoomJoined = (room: GameRoom) => {
    setActiveRoom(room);
    setViewState('lobby');
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setViewState('home');
  };

  const handleGameStarted = (room: GameRoom) => {
    setActiveRoom(room);
    setViewState('game');
  };

  const handleGameOver = (room: GameRoom) => {
    setActiveRoom(room);
    setViewState('leaderboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Background Neon Grid / Glow Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCreateRoom={() => {
          if (!user) setIsAuthOpen(true);
          else setIsCreateRoomOpen(true);
        }}
        onOpenJoinRoom={() => {
          if (!user) setIsAuthOpen(true);
          else setIsJoinRoomOpen(true);
        }}
        onOpenFirebaseConfig={() => setIsFirebaseModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 z-10">
        {viewState === 'home' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-16">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-purple-900/30 animate-pulse">
                <Radio className="w-4 h-4 text-pink-400" />
                <span>Salons Multijoueurs Synchrone • Compte à Rebours 10s</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight mb-6">
                L\'ARÈNE ULTIME DU <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                  QUIZ MULTIJOUEUR OTAKU
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Affrontez d\'autres passionnés d\'Animes en temps réel ! Créez votre salon de jeu QCM avec un chronomètre de 10s, personnalisez votre profil avec des avatars Otaku uniques et hissez-vous au sommet du classement.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    if (!user) setIsAuthOpen(true);
                    else setIsCreateRoomOpen(true);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-purple-600/40 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-3"
                >
                  <Swords className="w-5 h-5" />
                  Créer un Salon de Jeu 🚀
                </button>

                <button
                  onClick={() => {
                    if (!user) setIsAuthOpen(true);
                    else setIsJoinRoomOpen(true);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-white font-extrabold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-3"
                >
                  <KeyRound className="w-5 h-5 text-cyan-400" />
                  Rejoindre un Salon
                </button>
              </div>
            </div>

            {/* Otaku Avatars Gallery Showcase */}
            <div className="mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  GALERIE D\'AVATARS & RANGS OTAKU
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choisissez votre héros d\'anime et débloquez votre titre personnalisé
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {OTAKU_AVATARS.map((av) => (
                  <div
                    key={av.id}
                    onClick={() => setIsProfileOpen(true)}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col items-center text-center shadow-lg"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl p-1 mb-3 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: av.accentColor }}
                    >
                      <div
                        className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: av.avatarSvg }}
                      />
                    </div>
                    <span className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                      {av.name}
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 mt-0.5">{av.badge}</span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{av.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="p-8 rounded-3xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-5 shadow-lg">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">Compte à Rebours 10s</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chaque question dispose d\'un compte à rebours ultra dynamique de 10 secondes (réglable) avec bonus de rapidité !
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-5 shadow-lg">
                  <Flame className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">Salons Temps Réel onSnapshot</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Grâce à Firebase Firestore `onSnapshot`, l\'état du salon, les réponses des joueurs et les scores sont synchronisés en direct.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-5 shadow-lg">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">Podium & Classement</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Célébrez la victoire en fin de game avec pluie de confettis, statistiques détaillées de précision et revanche instantanée.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Room Lobby */}
        {viewState === 'lobby' && activeRoom && user && (
          <RoomLobby
            roomId={activeRoom.id}
            user={user}
            onLeaveRoom={handleLeaveRoom}
            onGameStarted={handleGameStarted}
          />
        )}

        {/* Live Quiz Gameplay */}
        {viewState === 'game' && activeRoom && user && (
          <QuizGame roomId={activeRoom.id} user={user} onGameOver={handleGameOver} />
        )}

        {/* End of Game Leaderboard */}
        {viewState === 'leaderboard' && activeRoom && user && (
          <Leaderboard
            room={activeRoom}
            user={user}
            onRematch={() => handleRoomCreated(activeRoom)}
            onHome={handleLeaveRoom}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(updatedUser) => {
          setUser(updatedUser);
          setIsAuthOpen(false);
        }}
      />

      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={(updated) => setUser(updated)}
        onLogout={() => {
          localStorage.removeItem('otakuwars_user');
          setUser(null);
          setIsProfileOpen(false);
        }}
      />

      {user && (
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

      <FirebaseSettingsModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 z-10">
        <p>© 2026 OTAKU WARS — Arène Quiz Multijoueur Otaku & Firebase Live Sync</p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <HomeContent />
    </Suspense>
  );
}
