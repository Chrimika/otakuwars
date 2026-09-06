export type BadgeStat = 'wins' | 'gamesPlayed' | 'totalScore' | 'otakuScore';
export type BadgeIconKey = 'medal' | 'katana' | 'burst' | 'lightning' | 'torii' | 'mask' | 'scroll';
export type BadgeColor = 'crimson' | 'gold' | 'violet' | 'magenta';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: BadgeIconKey;
  color: BadgeColor;
  stat: BadgeStat;
  min: number;
}

export const BADGES: BadgeDef[] = [
  { id: 'first-win', name: 'Première Victoire', description: 'Remporte ta première partie.', icon: 'medal', color: 'gold', stat: 'wins', min: 1 },
  { id: 'veteran', name: 'Vétéran', description: 'Joue 10 parties.', icon: 'katana', color: 'crimson', stat: 'gamesPlayed', min: 10 },
  { id: 'champion', name: 'Champion', description: 'Remporte 5 parties.', icon: 'medal', color: 'gold', stat: 'wins', min: 5 },
  { id: 'legend', name: 'Légende Otaku', description: 'Remporte 20 parties.', icon: 'burst', color: 'magenta', stat: 'wins', min: 20 },
  { id: 'scorer', name: 'Chasseur de points', description: 'Cumule 1000 points.', icon: 'lightning', color: 'crimson', stat: 'totalScore', min: 1000 },
  { id: 'grandmaster', name: 'Grand Maître', description: 'Cumule 5000 points.', icon: 'torii', color: 'violet', stat: 'totalScore', min: 5000 },
  { id: 'true-otaku', name: 'Vrai Otaku', description: 'Réussis le test otaku parfait (3/3).', icon: 'mask', color: 'violet', stat: 'otakuScore', min: 3 },
  { id: 'regular', name: 'Habitué de l\'arène', description: 'Joue 25 parties.', icon: 'scroll', color: 'gold', stat: 'gamesPlayed', min: 25 },
];
