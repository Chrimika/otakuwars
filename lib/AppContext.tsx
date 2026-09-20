'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from './types';
import { OTAKU_AVATARS } from '../data/avatars';
import { initFirebase } from './firebase';

interface AppContextValue {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  isGlobalLeaderboardOpen: boolean;
  openGlobalLeaderboard: () => void;
  closeGlobalLeaderboard: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGlobalLeaderboardOpen, setIsGlobalLeaderboardOpen] = useState(false);

  useEffect(() => {
    initFirebase();
  }, []);

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
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isGlobalLeaderboardOpen,
        openGlobalLeaderboard: () => setIsGlobalLeaderboardOpen(true),
        closeGlobalLeaderboard: () => setIsGlobalLeaderboardOpen(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function requireAuth(user: UserProfile | null, cb: () => void, redirectToAuth: () => void) {
  if (!user || user.isGuest) {
    redirectToAuth();
  } else {
    cb();
  }
}
