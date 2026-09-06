'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAvatarById } from '../data/avatars';
import { useAppContext } from '../lib/AppContext';
import { NeonButton } from './ui/NeonButton';
import { KatanaIcon } from './ui/icons/OtakuIcons';
import { LogIn, Trophy } from 'lucide-react';

const NAV_LINKS = [
  { href: '/evenements', label: 'Événements' },
  { href: '/bibliotheque', label: 'Bibliothèque' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/recompenses', label: 'Récompenses' },
  { href: '/a-propos', label: 'À propos' },
];

export const Navbar: React.FC = () => {
  const { user, openGlobalLeaderboard } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const avatar = user ? getAvatarById(user.avatarId) : null;
  const isLoggedIn = user && !user.isGuest;

  return (
    <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-xl border-b border-crimson/15 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 cursor-pointer">
          <div className="clip-corner-sm w-9 h-9 bg-crimson flex items-center justify-center shadow-[0_0_20px_rgba(255,31,61,0.45)] group-hover:rotate-6 transition-transform">
            <KatanaIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-lg tracking-wide text-ink hidden sm:block">
            OTAKU WARS
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-hud text-xs font-bold uppercase tracking-wide transition-colors ${
                pathname === l.href ? 'text-crimson' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Center actions (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <NeonButton variant="secondary" size="sm" className="border-neon-gold/50! text-neon-gold! hover:bg-neon-gold/10! hover:border-neon-gold!" onClick={openGlobalLeaderboard}>
            <Trophy className="w-3.5 h-3.5" />
            Classement
          </NeonButton>
        </div>

        {/* Right: user or login */}
        <div className="flex items-center gap-2">
          <button
            onClick={openGlobalLeaderboard}
            className="md:hidden clip-corner-sm flex items-center justify-center p-2 bg-neon-gold/10 border border-neon-gold/40 text-neon-gold transition-all cursor-pointer"
            title="Classement général"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => router.push('/compte')}
              className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/8 border border-crimson/30 transition-all cursor-pointer"
            >
              {user!.customAvatarDataUrl ? (
                <img
                  src={user!.customAvatarDataUrl}
                  alt={user!.username}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-crimson/40"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full p-0.5 overflow-hidden ring-1 ring-crimson/40"
                  style={{ backgroundColor: avatar?.accentColor || '#8b5cf6' }}
                >
                  <div
                    className="w-full h-full rounded-full bg-void flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: avatar?.avatarSvg || '' }}
                  />
                </div>
              )}
              <span className="text-xs font-hud font-bold uppercase tracking-wide text-white hidden sm:block max-w-25 truncate">
                {user!.username}
              </span>
            </button>
          ) : (
            <NeonButton variant="primary" size="sm" onClick={() => router.push('/auth')}>
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Se connecter</span>
              <span className="sm:hidden">Login</span>
            </NeonButton>
          )}
        </div>
      </div>

      {/* Mobile links */}
      <div className="lg:hidden flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 pt-2 border-t border-crimson/10">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`font-hud text-[11px] font-bold uppercase tracking-wide ${
              pathname === l.href ? 'text-crimson' : 'text-slate-400'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
};
