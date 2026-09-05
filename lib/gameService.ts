import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  Firestore,
} from 'firebase/firestore';
import { GameRoom, RoomPlayer, UserProfile } from './types';
import { getFirebaseInstance } from './firebase';
import { getRandomQuestions } from '../data/questions';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OTK-${code}`;
}

function getRequiredDb(): Firestore {
  const { db, isConfigured } = getFirebaseInstance();
  if (!isConfigured || !db) {
    throw new Error('Firebase Firestore n\'est pas encore initialisé.');
  }
  return db as Firestore;
}

// ── 1. Subscribe to all public live rooms in Firestore ─────────────────────────

export function subscribeToPublicRooms(
  onUpdate: (rooms: GameRoom[]) => void,
  onError?: (err: Error) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();
  if (!isConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  const q = query(collection(db as Firestore, 'rooms'), limit(30));
  const unsub = onSnapshot(
    q,
    (snap) => {
      const rooms: GameRoom[] = [];
      snap.forEach((docSnap) => {
        if (docSnap.exists()) {
          rooms.push(docSnap.data() as GameRoom);
        }
      });
      onUpdate(rooms);
    },
    (err) => {
      console.error('❌ Erreur Firestore snapshot salons publics :', err);
      if (onError) onError(err);
      onUpdate([]);
    }
  );
  return unsub;
}

// ── 2. Subscribe to a single game room in Firestore ─────────────────────────────

export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: GameRoom | null) => void,
  onError?: (err: Error) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();
  if (!isConfigured || !db) {
    onUpdate(null);
    return () => {};
  }

  const ref = doc(db as Firestore, 'rooms', roomId);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as GameRoom);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error(`❌ Erreur Firestore snapshot salon ${roomId} :`, err);
      if (onError) onError(err);
    }
  );
}

// ── 3. Create a new Game Room directly in Firestore ───────────────────────────

export async function createGameRoom(
  host: UserProfile,
  roomName: string,
  category: string,
  timerPerQuestion = 10,
  totalQuestions = 5
): Promise<GameRoom> {
  const db = getRequiredDb();
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generateRoomCode();
  const questions = getRandomQuestions(totalQuestions, category);

  const hostPlayer: RoomPlayer = {
    uid: host.uid,
    username: host.username,
    otakuTitle: host.otakuTitle,
    avatarId: host.avatarId,
    isHost: true,
    isReady: true,
    score: 0,
    streak: 0,
    currentQuestionIndex: 0,
    hasFinished: false,
    joinedAt: Date.now(),
  };

  const newRoom: GameRoom = {
    id: roomId,
    code: roomCode,
    name: roomName || `Salon de ${host.username}`,
    category,
    hostId: host.uid,
    hostName: host.username,
    timerPerQuestion,
    totalQuestions: questions.length,
    currentQuestionIndex: 0,
    state: 'waiting',
    questions,
    questionStartTime: null,
    players: { [host.uid]: hostPlayer },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(doc(db, 'rooms', roomId), newRoom);
  console.log(`✅ Salon créé dans Firestore [${roomId}] (Code: ${roomCode})`);

  return newRoom;
}

// ── 4. Join a Game Room ─────────────────────────────────────────────────────────

export async function joinGameRoom(
  codeOrId: string,
  user: UserProfile
): Promise<GameRoom | null> {
  const db = getRequiredDb();
  const rawInput = codeOrId.trim();
  const code = rawInput.toUpperCase();
  let room: GameRoom | null = null;
  let roomDocRef = doc(db, 'rooms', rawInput);

  const directSnap = await getDoc(roomDocRef);
  if (directSnap.exists()) {
    room = directSnap.data() as GameRoom;
  } else {
    const q = query(
      collection(db, 'rooms'),
      where('code', '==', code),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const matchDoc = snap.docs[0];
      room = matchDoc.data() as GameRoom;
      roomDocRef = doc(db, 'rooms', room.id);
    }
  }

  if (!room) {
    return null;
  }

  const player: RoomPlayer = {
    uid: user.uid,
    username: user.username,
    otakuTitle: user.otakuTitle,
    avatarId: user.avatarId,
    isHost: room.hostId === user.uid,
    isReady: false,
    score: 0,
    streak: 0,
    currentQuestionIndex: 0,
    hasFinished: false,
    joinedAt: Date.now(),
  };

  await updateDoc(roomDocRef, {
    [`players.${user.uid}`]: player,
    updatedAt: Date.now(),
  });

  room.players[user.uid] = player;
  return room;
}

// ── 5. Toggle Ready status ─────────────────────────────────────────────────────

export async function togglePlayerReady(
  roomId: string,
  playerUid: string,
  isReady: boolean
) {
  const db = getRequiredDb();
  await updateDoc(doc(db, 'rooms', roomId), {
    [`players.${playerUid}.isReady`]: isReady,
    updatedAt: Date.now(),
  });
}

// ── 6. Start Match in Firestore ────────────────────────────────────────────────

export async function startGameMatch(roomId: string) {
  const db = getRequiredDb();
  const roomRef = doc(db, 'rooms', roomId);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) return;

  const room = snap.data() as GameRoom;
  const updatedPlayers = { ...room.players };

  Object.keys(updatedPlayers).forEach((uid) => {
    updatedPlayers[uid].score = 0;
    updatedPlayers[uid].streak = 0;
    updatedPlayers[uid].currentQuestionIndex = 0;
    updatedPlayers[uid].hasFinished = false;
    updatedPlayers[uid].lastAnswerIndex = null;
    updatedPlayers[uid].lastAnswerTimeMs = null;
    updatedPlayers[uid].lastAnswerCorrect = null;
  });

  // Régénérer un TOUT NOUVEAU lot de questions et d'options mélangées à chaque nouvelle partie !
  const newQuestions = getRandomQuestions(room.totalQuestions || 5, room.category);

  await updateDoc(roomRef, {
    state: 'playing',
    questions: newQuestions,
    currentQuestionIndex: 0,
    questionStartTime: Date.now(),
    players: updatedPlayers,
    updatedAt: Date.now(),
  });
}

// ── 7. Submit Answer for a Player (Individual Progress) ─────────────────────────

export async function submitQuestionAnswer(
  roomId: string,
  playerUid: string,
  questionIdx: number,
  answerIndex: number,
  timeTakenMs: number
) {
  const db = getRequiredDb();
  const roomRef = doc(db, 'rooms', roomId);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) return;

  const room = snap.data() as GameRoom;
  if (room.state !== 'playing' || !room.players[playerUid]) return;

  const player = { ...room.players[playerUid] };
  const currentQ = room.questions[questionIdx];
  if (!currentQ) return;

  const isCorrect = answerIndex === currentQ.correctAnswerIndex;

  if (isCorrect) {
    const totalMs = room.timerPerQuestion * 1000;
    const speedBonus = Math.round(
      Math.max(0, (totalMs - timeTakenMs) / totalMs) * 50
    );
    const streak = (player.streak || 0) + 1;
    const streakBonus = Math.min(streak * 10, 50);
    player.score += 100 + speedBonus + streakBonus;
    player.streak = streak;
  } else {
    player.streak = 0;
  }

  const nextQ = questionIdx + 1;
  player.currentQuestionIndex = nextQ;
  player.lastAnswerIndex = answerIndex;
  player.lastAnswerTimeMs = timeTakenMs;
  player.lastAnswerCorrect = isCorrect;

  if (nextQ >= room.totalQuestions) {
    player.hasFinished = true;
  }

  const updatedPlayers = {
    ...room.players,
    [playerUid]: player,
  };

  // Check if ALL players in the room have finished
  const allFinished = Object.values(updatedPlayers).every((p) => p.hasFinished);

  const updateData: Record<string, unknown> = {
    [`players.${playerUid}`]: player,
    updatedAt: Date.now(),
  };

  if (allFinished) {
    updateData.state = 'game_over';
  }

  await updateDoc(roomRef, updateData);
}

// ── 8. Force End Match (Host can finish game early if needed) ──────────────────

export async function advanceToNextQuestion(roomId: string) {
  const db = getRequiredDb();
  const roomRef = doc(db, 'rooms', roomId);
  await updateDoc(roomRef, {
    state: 'game_over',
    updatedAt: Date.now(),
  });
}

// ── 9. User Profile Persistence ────────────────────────────────────────────────

export async function saveUserProfileToFirestore(user: UserProfile) {
  try {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await setDoc(doc(db as Firestore, 'users', user.uid), user, { merge: true });
    }
  } catch (e) {
    console.error('❌ Erreur écriture profil utilisateur Firestore :', e);
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      const snap = await getDoc(doc(db as Firestore, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    }
  } catch (e) {
    console.error('❌ Erreur lecture profil utilisateur Firestore :', e);
  }
  return null;
}

// ── 10. Record Match Results & Global Leaderboard ────────────────────────────

/**
 * Enregistre les statistiques d'un joueur à la fin d'une partie.
 * Incrémente les victoires, les parties jouées et les points totaux dans Firestore et LocalStorage.
 * Empêche les enregistrements en double grâce à une clé de verrouillage par salon et UID.
 */
export async function recordMatchResults(
  room: GameRoom,
  user: UserProfile
): Promise<UserProfile> {
  if (!user || user.isGuest) return user;

  const lockKey = `otk_recorded_${room.id}_${user.uid}`;
  if (typeof window !== 'undefined' && sessionStorage.getItem(lockKey)) {
    return user;
  }

  const players = Object.values(room.players || {});
  const player = players.find((p) => p.uid === user.uid);
  if (!player) return user;

  // Déterminer si le joueur a gagné (plus haut score du salon > 0)
  const maxScore = Math.max(...players.map((p) => p.score || 0));
  const isWinner = (player.score || 0) === maxScore && maxScore > 0;

  const updated: UserProfile = {
    ...user,
    gamesPlayed: (user.gamesPlayed || 0) + 1,
    wins: (user.wins || 0) + (isWinner ? 1 : 0),
    totalScore: (user.totalScore || 0) + (player.score || 0),
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(lockKey, 'true');
    localStorage.setItem('otakuwars_user', JSON.stringify(updated));
  }

  await saveUserProfileToFirestore(updated);
  console.log(`🏆 Stats de ${user.username} mises à jour dans Firestore ! Victoires: ${updated.wins}, Parties: ${updated.gamesPlayed}`);
  return updated;
}

/**
 * Récupère le classement général des joueurs depuis Firestore.
 */
export async function getGlobalLeaderboard(limitCount = 50): Promise<UserProfile[]> {
  try {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      const q = query(collection(db as Firestore, 'users'), limit(100));
      const snap = await getDocs(q);
      const users: UserProfile[] = [];
      snap.forEach((docSnap) => {
        if (docSnap.exists()) {
          const u = docSnap.data() as UserProfile;
          if (!u.isGuest) {
            users.push(u);
          }
        }
      });

      // Tri décroissant par victoires puis par score total
      users.sort((a, b) => {
        if ((b.wins || 0) !== (a.wins || 0)) {
          return (b.wins || 0) - (a.wins || 0);
        }
        return (b.totalScore || 0) - (a.totalScore || 0);
      });

      return users.slice(0, limitCount);
    }
  } catch (e) {
    console.error('❌ Erreur récupération classement général :', e);
  }
  return [];
}

