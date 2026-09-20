export interface OtakuAvatar {
  id: string;
  name: string;
  anime: string;
  badge: string;
  title: string;
  accentColor: string;
  gradientBg: string;
  avatarSvg: string; // Custom SVG string or icon reference
}

export interface UserProfile {
  uid: string;
  username: string;
  email?: string;
  otakuTitle: string;
  avatarId: string;
  favoriteAnime: string;
  gamesPlayed: number;
  wins: number;
  totalScore: number;
  isGuest: boolean;
  createdAt: number;
  // ── Profil onboarding (optionnel, rempli via /auth) ────────────────────────
  country?: string;
  gender?: 'homme' | 'femme';
  city?: string;
  phone?: string;
  topManga?: string[];
  otakuScore?: number;
  customAvatarDataUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  animeSource: string;
  category:
    | 'shonen'
    | 'seinen'
    | 'isekai'
    | 'quotes'
    | 'hardcore'
    | 'mecha'
    | 'magical_girl'
    | 'slice_of_life'
    | 'sports'
    | 'thriller'
    | 'romance'
    | 'historical'
    | string;
  difficulty: 'easy' | 'medium' | 'hard';
  badgeEmoji?: string;
}

export interface RoomPlayer {
  uid: string;
  username: string;
  otakuTitle: string;
  avatarId: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  streak: number;
  currentQuestionIndex?: number;
  hasFinished?: boolean;
  lastAnswerIndex?: number | null;
  lastAnswerTimeMs?: number | null;
  lastAnswerCorrect?: boolean | null;
  joinedAt: number;
}

export type RoomStatus = 'waiting' | 'playing' | 'question_ended' | 'game_over';

export interface GameRoom {
  id: string;
  code: string;
  name: string;
  category: string;
  hostId: string;
  hostName: string;
  timerPerQuestion: number; // e.g. 10 (seconds)
  totalQuestions: number;
  currentQuestionIndex: number;
  state: RoomStatus;
  questions: QuizQuestion[];
  questionStartTime: number | null; // epoch timestamp ms
  players: Record<string, RoomPlayer>;
  createdAt: number;
  updatedAt: number;
}

export interface PlayerScoreSummary {
  uid: string;
  username: string;
  otakuTitle: string;
  avatarId: string;
  score: number;
  correctAnswers: number;
  accuracy: number;
  rank: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// RAFALE OTAKU - Character Rush Game Types
// ═══════════════════════════════════════════════════════════════════════════

export interface CharacterRushTheme {
  id: string;
  theme: string; // Ex: "Personnages aux cheveux rouges"
  themeEn: string; // Version anglaise pour validation
}

export interface CharacterRushAnswer {
  characterName: string;
  submittedAt: number; // Timestamp
  validationStatus: 'pending' | 'valid' | 'invalid';
  validationReason?: string;
  validationConfidence?: number;
}

export interface CharacterRushPlayer {
  uid: string;
  username: string;
  otakuTitle: string;
  avatarId: string;
  isHost: boolean;
  isReady: boolean;
  score: number; // Nombre total de personnages valides
  answers: Record<string, CharacterRushAnswer[]>; // themeId -> array of answers
  joinedAt: number;
  currentThemeIndex?: number;
  hasFinishedCurrentTheme?: boolean;
}

export type CharacterRushRoomStatus = 'waiting' | 'playing' | 'theme_ended' | 'game_over';

export interface CharacterRushRoom {
  id: string;
  code: string;
  name: string;
  hostId: string;
  hostName: string;
  timerPerTheme: number; // Secondes par thème (défaut: 15)
  totalThemes: number; // Nombre de thèmes (défaut: 20)
  currentThemeIndex: number;
  state: CharacterRushRoomStatus;
  themes: CharacterRushTheme[];
  themeStartTime: number | null; // Timestamp début du thème actuel
  players: Record<string, CharacterRushPlayer>;
  createdAt: number;
  updatedAt: number;
  isGeneratingThemes?: boolean; // Pendant la génération par Gemini
}

export interface CharacterRushScoreSummary {
  uid: string;
  username: string;
  otakuTitle: string;
  avatarId: string;
  totalScore: number; // Nombre total de personnages valides
  totalAnswers: number; // Nombre total de réponses soumises
  accuracy: number; // Pourcentage de bonnes réponses
  rank: number;
  bestTheme?: {
    theme: string;
    score: number;
  };
}
