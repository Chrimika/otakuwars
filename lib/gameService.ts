import { doc, collection, onSnapshot, setDoc, updateDoc, getDocs, query, where, limit, Firestore } from 'firebase/firestore';
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

// ── Local store & fallback (BroadcastChannel + localStorage) ──────────────────

let localChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  localChannel = new BroadcastChannel('otakuwars_rooms_channel');
}

const localRoomStore: Record<string, GameRoom> = {};

function saveLocalRoom(room: GameRoom) {
  localRoomStore[room.id] = room;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`otaku_room_${room.id}`, JSON.stringify(room));
    localStorage.setItem(`otaku_room_code_${room.code}`, JSON.stringify(room));
  }
  localChannel?.postMessage({ type: 'ROOM_UPDATE', roomId: room.id, room });
}

function getLocalRoom(idOrCode: string): GameRoom | null {
  if (localRoomStore[idOrCode]) return localRoomStore[idOrCode];
  if (typeof window === 'undefined') return null;
  const raw =
    localStorage.getItem(`otaku_room_${idOrCode}`) ||
    localStorage.getItem(`otaku_room_code_${idOrCode}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GameRoom;
    localRoomStore[parsed.id] = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function getAllLocalRooms(): GameRoom[] {
  const seen = new Set<string>();
  const list: GameRoom[] = [];

  Object.values(localRoomStore).forEach((r) => {
    if (!seen.has(r.id)) { seen.add(r.id); list.push(r); }
  });

  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('otaku_room_room_')) {
        try {
          const r = JSON.parse(localStorage.getItem(key)!) as GameRoom;
          if (r?.id && !seen.has(r.id)) { seen.add(r.id); list.push(r); }
        } catch { /* ignore */ }
      }
    }
  }
  return list;
}

// ── Public rooms live list ────────────────────────────────────────────────────

export function subscribeToPublicRooms(
  onUpdate: (rooms: GameRoom[]) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();

  if (isConfigured && db) {
    const q = query(collection(db as Firestore, 'rooms'), limit(20));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rooms = snap.docs.map((d) => {
          const r = d.data() as GameRoom;
          localRoomStore[r.id] = r;
          return r;
        });
        onUpdate(rooms);
      },
      (err) => { console.warn('Firestore public rooms error:', err); onUpdate(getAllLocalRooms()); }
    );
    return unsub;
  }

  onUpdate(getAllLocalRooms());
  const handleMsg = (e: MessageEvent) => {
    if (e.data?.type === 'ROOM_UPDATE') onUpdate(getAllLocalRooms());
  };
  localChannel?.addEventListener('message', handleMsg);
  const iv = setInterval(() => onUpdate(getAllLocalRooms()), 2000);
  return () => {
    localChannel?.removeEventListener('message', handleMsg);
    clearInterval(iv);
  };
}

// ── Single room subscription with live store sync ──────────────────────────────

export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: GameRoom | null) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();

  if (isConfigured && db) {
    const ref = doc(db as Firestore, 'rooms', roomId);
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const roomData = snap.data() as GameRoom;
          localRoomStore[roomData.id] = roomData;
          onUpdate(roomData);
        } else {
          onUpdate(null);
        }
      },
      (err) => { console.warn('Firestore room snapshot error:', err); onUpdate(getLocalRoom(roomId)); }
    );
  }

  onUpdate(getLocalRoom(roomId));
  const handleMsg = (e: MessageEvent) => {
    if (e.data?.type === 'ROOM_UPDATE' && e.data.roomId === roomId) onUpdate(e.data.room);
  };
  localChannel?.addEventListener('message', handleMsg);
  const iv = setInterval(() => { const r = getLocalRoom(roomId); if (r) onUpdate(r); }, 1000);
  return () => {
    localChannel?.removeEventListener('message', handleMsg);
    clearInterval(iv);
  };
}

// ── Create room ───────────────────────────────────────────────────────────────

export async function createGameRoom(
  host: UserProfile,
  roomName: string,
  category: string,
  timerPerQuestion = 10,
  totalQuestions = 5
): Promise<GameRoom> {
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
    joinedAt: Date.now(),
  };

  const room: GameRoom = {
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

  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    try {
      await setDoc(doc(db as Firestore, 'rooms', roomId), room);
    } catch (e) {
      console.warn('Firestore setDoc failed, saving locally:', e);
    }
  }

  saveLocalRoom(room);
  return room;
}

// ── Join room by code (Firestore query OR local lookup) ───────────────────────

export async function joinGameRoom(
  codeOrId: string,
  user: UserProfile
): Promise<GameRoom | null> {
  const { db, isConfigured } = getFirebaseInstance();
  let room: GameRoom | null = null;

  const code = codeOrId.trim().toUpperCase();

  if (isConfigured && db) {
    try {
      const byId = await import('firebase/firestore').then(({ getDoc }) =>
        getDoc(doc(db as Firestore, 'rooms', codeOrId))
      );
      if (byId.exists()) {
        room = byId.data() as GameRoom;
      }
    } catch { /* ignore */ }

    if (!room) {
      try {
        const q = query(
          collection(db as Firestore, 'rooms'),
          where('code', '==', code),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) room = snap.docs[0].data() as GameRoom;
      } catch (e) {
        console.warn('Firestore code query failed, falling back to local:', e);
      }
    }
  }

  if (!room) room = getLocalRoom(codeOrId) || getLocalRoom(code);
  if (!room) return null;

  const player: RoomPlayer = {
    uid: user.uid,
    username: user.username,
    otakuTitle: user.otakuTitle,
    avatarId: user.avatarId,
    isHost: room.hostId === user.uid,
    isReady: false,
    score: 0,
    streak: 0,
    joinedAt: Date.now(),
  };

  room.players[user.uid] = player;
  room.updatedAt = Date.now();

  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', room.id), {
        [`players.${user.uid}`]: player,
        updatedAt: Date.now(),
      });
    } catch { /* ignore */ }
  }

  saveLocalRoom(room);
  return room;
}

// ── Toggle ready ──────────────────────────────────────────────────────────────

export async function togglePlayerReady(roomId: string, playerUid: string, isReady: boolean) {
  const room = getLocalRoom(roomId);
  if (!room?.players[playerUid]) return;

  room.players[playerUid].isReady = isReady;
  room.updatedAt = Date.now();

  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    try {
      await updateDoc(doc(db as Firestore, 'rooms', roomId), {
        [`players.${playerUid}.isReady`]: isReady,
        updatedAt: Date.now(),
      });
    } catch { /* ignore */ }
  }
  saveLocalRoom(room);
}

// ── Start game ────────────────────────────────────────────────────────────────

export async function startGameMatch(roomId: string) {
  const room = getLocalRoom(roomId);
  if (!room) return;

  room.state = 'playing';
  room.currentQuestionIndex = 0;
  room.questionStartTime = Date.now();
  room.updatedAt = Date.now();

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
        questionStartTime: room.questionStartTime,
        players: room.players,
        updatedAt: Date.now(),
      });
    } catch { /* ignore */ }
  }
  saveLocalRoom(room);
}

// ── Submit answer ─────────────────────────────────────────────────────────────

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

  if (isCorrect) {
    const totalMs = room.timerPerQuestion * 1000;
    const speedBonus = Math.round(Math.max(0, (totalMs - timeTakenMs) / totalMs) * 50);
    const streak = (room.players[playerUid].streak || 0) + 1;
    const streakBonus = Math.min(streak * 10, 50);
    room.players[playerUid].score += 100 + speedBonus + streakBonus;
    room.players[playerUid].streak = streak;
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
        updatedAt: Date.now(),
      });
    } catch { /* ignore */ }
  }
  saveLocalRoom(room);
}

// ── Advance question ──────────────────────────────────────────────────────────

export async function advanceToNextQuestion(roomId: string) {
  const room = getLocalRoom(roomId);
  if (!room) return;

  const next = room.currentQuestionIndex + 1;

  if (next >= room.totalQuestions) {
    room.state = 'game_over';
  } else {
    room.state = 'playing';
    room.currentQuestionIndex = next;
    room.questionStartTime = Date.now();
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
        updatedAt: Date.now(),
      });
    } catch { /* ignore */ }
  }
  saveLocalRoom(room);
}
