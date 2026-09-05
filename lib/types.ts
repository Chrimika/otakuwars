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
