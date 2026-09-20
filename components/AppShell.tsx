'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider, useAppContext } from '../lib/AppContext';
import { IntroSequence } from './IntroSequence';
import { AmbientAudioToggle } from './ui/AmbientAudioToggle';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalLeaderboardModal } from './GlobalLeaderboardModal';
import { MascotGuide } from './mascot/MascotGuide';

const OST_SRC = encodeURI('/ost/Saint Seiya The Lost Canvas (Ending - Full Version) [muviQuJ-qy0].mp3');

const Chrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, isGlobalLeaderboardOpen, closeGlobalLeaderboard } = useAppContext();

  return (
    <div className="min-h-screen bg-void text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="hud-backdrop" />
      {pathname === '/' && <IntroSequence />}
      <AmbientAudioToggle src={OST_SRC} volume={0.22} autoplay />
      <MascotGuide />

      <Navbar />

      <main className="flex-1 z-10">{children}</main>

      <Footer />

      <GlobalLeaderboardModal
        isOpen={isGlobalLeaderboardOpen}
        onClose={closeGlobalLeaderboard}
        currentUser={user}
      />
    </div>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    <Chrome>{children}</Chrome>
  </AppProvider>
);
