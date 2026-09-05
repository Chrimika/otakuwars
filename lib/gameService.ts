import { doc, onSnapshot, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { GameRoom, RoomPlayer, UserProfile } from './types';
import { getFirebaseInstance } from './firebase';
import { getRandomQuestions } from '../data/questions';

// Unique room code generator (e.g. "OTA-892")
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OTK-${code}`;
}

// Global broadcast channel for fallback local multi-tab real-time sync
let localChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  localChannel = new BroadcastChannel('otakuwars_rooms_channel');
}

// In-memory local room store for fallback
const localRoomStore: Record<string, GameRoom> = {};

function saveLocalRoom(room: GameRoom) {
  localRoomStore[room.id] = room;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`otaku_room_${room.id}`, JSON.stringify(room));
    localStorage.setItem(`otaku_room_code_${room.code}`, JSON.stringify(room));
  }
  if (localChannel) {
    localChannel.postMessage({ type: 'ROOM_UPDATE', roomId: room.id, room });
  }
}

function getLocalRoom(roomIdOrCode: string): GameRoom | null {
  if (localRoomStore[roomIdOrCode]) return localRoomStore[roomIdOrCode];
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(`otaku_room_${roomIdOrCode}`) || localStorage.getItem(`otaku_room_code_${roomIdOrCode}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        localRoomStore[parsed.id] = parsed;
        return parsed;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
  * Subscribe to a Game Room in Real-time using `onSnapshot` semantics.
  */
export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: GameRoom | null) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();

  if (isConfigured && db) {
    // True Firebase Firestore onSnapshot listener
    const roomRef = doc(db as Firestore, 'rooms', roomId);
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as GameRoom);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot error, falling back to local sync:', error);
        // fallback
        onUpdate(getLocalRoom(roomId));
      }
    );
    return unsubscribe;
  } else {
    // Local tab broadcast onSnapshot fallback listener
    onUpdate(getLocalRoom(roomId));

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ROOM_UPDATE' && event.data?.roomId === roomId) {
        onUpdate(event.data.room);
      }
    };

    if (localChannel) {
      localChannel.addEventListener('message', handleMessage);
    }

    // Also poll localStorage briefly every 1s for changes
    const interval = setInterval(() => {
      const current = getLocalRoom(roomId);
      if (current) onUpdate(current);
    }, 1000);

    return () => {
      if (localChannel) {
        localChannel.removeEventListener('message', handleMessage);
      }
      clearInterval(interval);
    };
  }
}

/**
  * Create a new Otaku Quiz Room
  */
export async function createGameRoom(
  hostUser: UserProfile,
  roomName: string,
  category: string,
  timerPerQuestion: number = 10,
  totalQuestions: number = 5
): Promise<GameRoom> {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generateRoomCode();
  const questions = getRandomQuestions(totalQuestions, category);

  const hostPlayer: RoomPlayer = {
    uid: hostUser.uid,
    username: hostUser.username,
    otakuTitle: hostUser.otakuTitle,
    avatarId: hostUser.avatarId,
    isHost: true,
    isReady: true,
    score: 0,
    streak: 0,
    joinedAt: Date.now()
  };

  const newRoom: GameRoom = {
    id: roomId,
    code: roomCode,
    name: roomName || `Salon de ${hostUser.username}`,
    category,
    hostId: hostUser.uid,
    hostName: hostUser.username,
    timerPerQuestion,
    totalQuestions: questions.length,
    currentQuestionIndex: 0,
    state: 'waiting',
    questions,
    questionStartTime: null,
    players: {
      [hostUser.uid]: hostPlayer
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const { db, isConfigured } = getFirebaseInstance();

  if (isConfigured && db) {
    try {
      await setDoc(doc(db as Firestore, 'rooms', roomId), newRoom);
    } catch (e) {
      console.warn('Firestore setDoc failed, saving locally:', e);
    }
  }

  saveLocalRoom(newRoom);
  return newRoom;
}

/**
  * Join an existing room with Code or Room ID
  */
export async function joinGameRoom(roomIdOrCode: string, user: UserProfile): Promise<GameRoom | null> {
  const { db, isConfigured } = getFirebaseInstance();
  let room: GameRoom | null = null;

  if (isConfigured && db) {
    // In real firebase, fetch or fallback
    room = getLocalRoom(roomIdOrCode);
  } else {
    room = getLocalRoom(roomIdOrCode);
  }

  if (!room) return null;

  const playerObj: RoomPlayer = {
    uid: user.uid,
    username: user.username,
    otakuTitle: user.otakuTitle,
    avatarId: user.avatarId,
    isHost: room.hostId === user.uid,
    isReady: false,
    score: 0,
    streak: 0,
    joinedAt: Date.now()
  };

  room.players[user.uid] = playerObj;
  room.updatedAt = Date.now();

  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', room.id), {
        [`players.${user.uid}`]: playerObj,
        updatedAt: Date.now()
      });
    } catch {
      // ignore
    }
  }

  saveLocalRoom(room);
  return room;
}

/**
  * Toggle player ready state
  */
export async function togglePlayerReady(roomId: string, playerUid: string, isReady: boolean) {
  const room = getLocalRoom(roomId);
  if (!room || !room.players[playerUid]) return;

  room.players[playerUid].isReady = isReady;
  room.updatedAt = Date.now();

  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', roomId), {
        [`players.${playerUid}.isReady`]: isReady,
        updatedAt: Date.now()
      });
    } catch {
      // ignore
    }
  }
  saveLocalRoom(room);
}

/**
  * Start the game room match
  */
export async function startGameMatch(roomId: string) {
  const room = getLocalRoom(roomId);
  if (!room) return;

  room.state = 'playing';
  room.currentQuestionIndex = 0;
  room.questionStartTime = Date.now();
  room.updatedAt = Date.now();

  // Reset player answers & scores for new match
  Object.keys(room.players).forEach((uid) => {
    room.players[uid].score = 0;
    room.players[uid].streak = 0;
    room.players[uid].lastAnswerIndex = null;
    room.players[uid].lastAnswerTimeMs = null;
    room.players[uid].lastAnswerCorrect = null;
  });

  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', roomId), {
        state: 'playing',
        currentQuestionIndex: 0,
        questionStartTime: Date.now(),
        players: room.players,
        updatedAt: Date.now()
      });
    } catch {
      // ignore
    }
  }
  saveLocalRoom(room);
}

/**
  * Submit player's QCM answer with instant score calculation
  */
export async function submitQuestionAnswer(
  roomId: string,
  playerUid: string,
  answerIndex: number,
  timeTakenMs: number
) {
  const room = getLocalRoom(roomId);
  if (!room || room.state !== 'playing' || !room.players[playerUid]) return;

  const currentQ = room.questions[room.currentQuestionIndex];
  if (!currentQ) return;

  const isCorrect = answerIndex === currentQ.correctAnswerIndex;
  let pointsEarned = 0;

  if (isCorrect) {
    // Base score = 100 points
    // Speed bonus up to 50 points if answered quickly within the question timer
    const totalTimeAllowedMs = room.timerPerQuestion * 1000;
    const speedRatio = Math.max(0, (totalTimeAllowedMs - timeTakenMs) / totalTimeAllowedMs);
    const speedBonus = Math.round(speedRatio * 50);

    const currentStreak = (room.players[playerUid].streak || 0) + 1;
    const streakBonus = Math.min(currentStreak * 10, 50); // up to 50 bonus points

    pointsEarned = 100 + speedBonus + streakBonus;

    room.players[playerUid].score += pointsEarned;
    room.players[playerUid].streak = currentStreak;
  } else {
    room.players[playerUid].streak = 0;
  }

  room.players[playerUid].lastAnswerIndex = answerIndex;
  room.players[playerUid].lastAnswerTimeMs = timeTakenMs;
  room.players[playerUid].lastAnswerCorrect = isCorrect;
  room.updatedAt = Date.now();

  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', roomId), {
        [`players.${playerUid}`]: room.players[playerUid],
        updatedAt: Date.now()
      });
    } catch {
      // ignore
    }
  }
  saveLocalRoom(room);
}

/**
  * Advance to next question or end game
  */
export async function advanceToNextQuestion(roomId: string) {
  const room = getLocalRoom(roomId);
  if (!room) return;

  const nextIndex = room.currentQuestionIndex + 1;

  if (nextIndex >= room.totalQuestions) {
    room.state = 'game_over';
  } else {
    room.state = 'playing';
    room.currentQuestionIndex = nextIndex;
    room.questionStartTime = Date.now();
    // Clear last answer states for players
    Object.keys(room.players).forEach((uid) => {
      room.players[uid].lastAnswerIndex = null;
      room.players[uid].lastAnswerTimeMs = null;
      room.players[uid].lastAnswerCorrect = null;
    });
  }
  room.updatedAt = Date.now();

  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', roomId), {
        state: room.state,
        currentQuestionIndex: room.currentQuestionIndex,
        questionStartTime: room.questionStartTime,
        players: room.players,
        updatedAt: Date.now()
      });
    } catch {
      // ignore
    }
  }
  saveLocalRoom(room);
}
