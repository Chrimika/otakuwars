import { UserProfile } from './types';
import { BADGES, BadgeDef } from '../data/badges';

export function badgeProgress(badge: BadgeDef, user: UserProfile): number {
  const value = {
    wins: user.wins || 0,
    gamesPlayed: user.gamesPlayed || 0,
    totalScore: user.totalScore || 0,
    otakuScore: user.otakuScore || 0,
  }[badge.stat];
  return Math.min(1, value / badge.min);
}

export function isBadgeUnlocked(badge: BadgeDef, user: UserProfile): boolean {
  return badgeProgress(badge, user) >= 1;
}

export function getUnlockedBadges(user: UserProfile): BadgeDef[] {
  return BADGES.filter((b) => isBadgeUnlocked(b, user));
}
