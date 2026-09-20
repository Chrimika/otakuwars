/**
 * Service Firebase pour le jeu "Rafale Otaku"
 * Gestion des salons, joueurs, réponses et scores en temps réel
 */

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
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import {
  CharacterRushRoom,
  CharacterRushPlayer,
  CharacterRushAnswer,
  CharacterRushScoreSummary,
  UserProfile,
} from './types';
import { getFirebaseInstance } from './firebase';
import { generateCharacterRushThemes, validateCharacterForTheme } from './geminiService';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RFO-${code}`;
}

function getRequiredDb(): Firestore {
  const { db, isConfigured } = getFirebaseInstance();
  if (!isConfigured || !db) {
    throw new Error('Firebase Firestore n\'est pas encore initialisé.');
  }
  return db as Firestore;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * S'abonner à tous les salons publics Rafale Otaku
 */
export function subscribeToCharacterRushRooms(
  onUpdate: (rooms: CharacterRushRoom[]) => void,
  onError?: (err: Error) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();
  if (!isConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  const q = query(collection(db as Firestore, 'characterRushRooms'), limit(30));
  const unsub = onSnapshot(
    q,
    (snap) => {
      const rooms: CharacterRushRoom[] = [];
      snap.forEach((docSnap) => {
        if (docSnap.exists()) {
          rooms.push(docSnap.data() as CharacterRushRoom);
        }
      });
      onUpdate(rooms);
    },
    (err) => {
      console.error('❌ Erreur Firestore snapshot salons Rafale Otaku :', err);
      if (onError) onError(err);
      onUpdate([]);
    }
  );
  return unsub;
}

/**
 * S'abonner à un salon spécifique
 */
export function subscribeToCharacterRushRoom(
  roomId: string,
  onUpdate: (room: CharacterRushRoom | null) => void,
  onError?: (err: Error) => void
): () => void {
  const { db, isConfigured } = getFirebaseInstance();
  if (!isConfigured || !db) {
    onUpdate(null);
    return () => {};
  }

  const ref = doc(db as Firestore, 'characterRushRooms', roomId);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as CharacterRushRoom);
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

// ═══════════════════════════════════════════════════════════════════════════
// ROOM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Créer un nouveau salon Rafale Otaku
 */
export async function createCharacterRushRoom(
  user: UserProfile,
  roomName: string,
  timerPerTheme: number = 15,
  totalThemes: number = 20
): Promise<CharacterRushRoom> {
  const db = getRequiredDb();
  const roomId = `rush_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const code = generateRoomCode();

  // Créer la structure du salon
  const newRoom: CharacterRushRoom = {
    id: roomId,
    code,
    name: roomName,
    hostId: user.uid,
    hostName: user.username,
    timerPerTheme,
    totalThemes,
    currentThemeIndex: 0,
    state: 'waiting',
    themes: [], // Sera généré au démarrage
    themeStartTime: null,
    players: {
      [user.uid]: {
        uid: user.uid,
        username: user.username,
        otakuTitle: user.otakuTitle,
        avatarId: user.avatarId,
        isHost: true,
        isReady: true,
        score: 0,
        answers: {},
        joinedAt: Date.now(),
      },
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isGeneratingThemes: false,
  };

  await setDoc(doc(db, 'characterRushRooms', roomId), newRoom);
  return newRoom;
}

/**
 * Rejoindre un salon par code
 */
export async function joinCharacterRushRoom(
  code: string,
  user: UserProfile
): Promise<CharacterRushRoom | null> {
  const db = getRequiredDb();
  const q = query(
    collection(db, 'characterRushRooms'),
    where('code', '==', code.toUpperCase()),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error('Salon introuvable. Vérifie le code.');
  }

  const roomDoc = snap.docs[0];
  const room = roomDoc.data() as CharacterRushRoom;

  if (room.state !== 'waiting') {
    throw new Error('Ce salon est déjà en cours de partie.');
  }

  if (room.players[user.uid]) {
    return room;
  }

  const newPlayer: CharacterRushPlayer = {
    uid: user.uid,
    username: user.username,
    otakuTitle: user.otakuTitle,
    avatarId: user.avatarId,
    isHost: false,
    isReady: false,
    score: 0,
    answers: {},
    joinedAt: Date.now(),
  };

  await updateDoc(doc(db, 'characterRushRooms', room.id), {
    [`players.${user.uid}`]: newPlayer,
    updatedAt: Date.now(),
  });

  return { ...room, players: { ...room.players, [user.uid]: newPlayer } };
}

/**
 * Réinitialiser un salon pour une nouvelle partie (régénère les thèmes)
 */
export async function resetCharacterRushRoom(roomId: string): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error('Salon introuvable');
  }

  const room = roomSnap.data() as CharacterRushRoom;

  console.log('🔄 RESET ROOM:', roomId, '- Thèmes avant:', room.themes?.length || 0);

  // Réinitialiser tous les joueurs
  const resetPlayers: Record<string, CharacterRushPlayer> = {};
  Object.entries(room.players || {}).forEach(([uid, player]) => {
    resetPlayers[uid] = {
      ...player,
      isReady: false, // Corrigé: isReady au lieu de ready
      answers: {}, // Objet vide, pas array
      score: 0,
    };
  });

  // Réinitialiser la room
  await updateDoc(roomRef, {
    state: 'waiting',
    players: resetPlayers,
    themes: [], // ⚠️ VIDER les thèmes!
    currentThemeIndex: 0,
    themeStartTime: null,
    isGeneratingThemes: false,
    updatedAt: Date.now(),
  });

  console.log('✅ RESET DONE - Thèmes vidés, room en état waiting');
}

/**
 * Quitter un salon
 */
export async function leaveCharacterRushRoom(roomId: string, userId: string): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as CharacterRushRoom;
  const updatedPlayers = { ...room.players };
  delete updatedPlayers[userId];

  // Si plus de joueurs, supprimer le salon
  if (Object.keys(updatedPlayers).length === 0) {
    // await deleteDoc(roomRef);
    return;
  }

  // Si l'hôte part, transférer à un autre joueur
  let hostId = room.hostId;
  if (hostId === userId) {
    const newHostId = Object.keys(updatedPlayers)[0];
    hostId = newHostId;
    updatedPlayers[newHostId].isHost = true;
  }

  await updateDoc(roomRef, {
    players: updatedPlayers,
    hostId,
    updatedAt: Date.now(),
  });
}

/**
 * Marquer un joueur comme prêt
 */
export async function toggleCharacterRushReady(
  roomId: string,
  userId: string
): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as CharacterRushRoom;
  const player = room.players[userId];
  if (!player) return;

  await updateDoc(roomRef, {
    [`players.${userId}.isReady`]: !player.isReady,
    updatedAt: Date.now(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME FLOW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Démarrer la partie (générer les thèmes avec Gemini)
 */
export async function startCharacterRushGame(roomId: string): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error('Salon introuvable');
  }

  const room = roomSnap.data() as CharacterRushRoom;

  // Indiquer qu'on génère les thèmes
  await updateDoc(roomRef, {
    isGeneratingThemes: true,
    updatedAt: Date.now(),
  });

  try {
    // Générer les thèmes avec Gemini
    console.log('🎨 Génération de', room.totalThemes, 'thèmes avec Gemini...');
    const themes = await generateCharacterRushThemes(room.totalThemes);
    console.log('✅ Thèmes générés:', themes.length, '- Premier thème:', themes[0]?.theme);

    // Démarrer le jeu
    await updateDoc(roomRef, {
      themes,
      state: 'playing',
      currentThemeIndex: 0,
      themeStartTime: Date.now(),
      isGeneratingThemes: false,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Erreur génération thèmes:', error);
    // En cas d'erreur, revenir à l'état waiting
    await updateDoc(roomRef, {
      isGeneratingThemes: false,
      updatedAt: Date.now(),
    });
    throw error;
  }
}

/**
 * Passer au thème suivant
 */
export /**
 * Valider toutes les réponses en batch pour un thème donné
 */
async function validateThemeAnswersBatch(roomId: string, themeId: string): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as CharacterRushRoom;
  const theme = room.themes.find(t => t.id === themeId);
  if (!theme) return;

  console.log(`🔍 Validation batch pour thème "${theme.theme}"...`);

  // Collecter toutes les réponses de tous les joueurs pour ce thème
  const allAnswersToValidate: Array<{
    userId: string;
    characterName: string;
    answerIndex: number;
  }> = [];

  Object.entries(room.players).forEach(([userId, player]) => {
    const answers = player.answers[themeId] || [];
    answers.forEach((answer, index) => {
      if (answer.validationStatus === 'pending') {
        allAnswersToValidate.push({
          userId,
          characterName: answer.characterName,
          answerIndex: index,
        });
      }
    });
  });

  if (allAnswersToValidate.length === 0) {
    console.log('✅ Aucune réponse à valider');
    return;
  }

  console.log(`🔍 ${allAnswersToValidate.length} réponses à valider...`);

  // Préparer la requête batch
  const validationRequests = allAnswersToValidate.map(a => ({
    characterName: a.characterName,
    theme: theme.theme,
    themeEn: theme.themeEn,
  }));

  try {
    // Appeler l'API de validation batch
    const response = await fetch('/api/groq/validate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: validationRequests }),
    });

    if (!response.ok) {
      throw new Error(`Batch validation failed: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    console.log(`✅ Validation terminée: ${results.filter((r: any) => r.valid).length}/${results.length} valides`);

    // Mettre à jour toutes les réponses dans Firebase
    const updates: Record<string, any> = {};
    
    allAnswersToValidate.forEach((answerData, index) => {
      const result = results[index];
      if (!result) return;

      const { userId, answerIndex } = answerData;
      const player = room.players[userId];
      const answers = [...(player.answers[themeId] || [])];
      
      if (answers[answerIndex]) {
        answers[answerIndex] = {
          ...answers[answerIndex],
          validationStatus: result.valid ? 'valid' : 'invalid',
          confidence: result.confidence,
          reason: result.reason,
          details: result.details, // Nouveau champ avec détails
        };

        updates[`players.${userId}.answers.${themeId}`] = answers;
      }
    });

    // Recalculer les scores
    Object.entries(room.players).forEach(([userId, player]) => {
      let totalValidAnswers = 0;
      Object.values(player.answers).forEach((themeAnswers) => {
        themeAnswers.forEach((answer) => {
          if (answer.validationStatus === 'valid') {
            totalValidAnswers++;
          }
        });
      });
      updates[`players.${userId}.score`] = totalValidAnswers;
    });

    updates.updatedAt = Date.now();

    await updateDoc(roomRef, updates);
    console.log('✅ Firebase mis à jour avec les résultats');

  } catch (error) {
    console.error('❌ Erreur validation batch:', error);
    // En cas d'erreur, on accepte toutes les réponses par défaut
    const updates: Record<string, any> = {};
    
    allAnswersToValidate.forEach((answerData) => {
      const { userId, answerIndex } = answerData;
      const player = room.players[userId];
      const answers = [...(player.answers[themeId] || [])];
      
      if (answers[answerIndex]) {
        answers[answerIndex] = {
          ...answers[answerIndex],
          validationStatus: 'valid',
          confidence: 0.6,
          reason: 'Validation automatique (erreur)',
          details: 'Accepté automatiquement suite à une erreur de validation.',
        };

        updates[`players.${userId}.answers.${themeId}`] = answers;
        updates[`players.${userId}.score`] = (room.players[userId].score || 0) + 1;
      }
    });

    updates.updatedAt = Date.now();
    await updateDoc(roomRef, updates);
  }
}

/**
 * Avancer au thème suivant (et valider les réponses du thème actuel)
 */
export async function advanceToNextTheme(roomId: string): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as CharacterRushRoom;
  const currentTheme = room.themes[room.currentThemeIndex];

  // 🔥 VALIDER TOUTES LES RÉPONSES DU THÈME ACTUEL EN BATCH
  if (currentTheme) {
    await validateThemeAnswersBatch(roomId, currentTheme.id);
  }

  const nextIndex = room.currentThemeIndex + 1;

  if (nextIndex >= room.themes.length) {
    // Fin du jeu
    await updateDoc(roomRef, {
      state: 'game_over',
      themeStartTime: null,
      updatedAt: Date.now(),
    });
  } else {
    // Thème suivant
    await updateDoc(roomRef, {
      currentThemeIndex: nextIndex,
      themeStartTime: Date.now(),
      state: 'playing',
      updatedAt: Date.now(),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ANSWER SUBMISSION & VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Soumettre une réponse (acceptée localement, validation à la fin du thème)
 */
export async function submitCharacterAnswer(
  roomId: string,
  userId: string,
  themeId: string,
  characterName: string
): Promise<void> {
  const db = getRequiredDb();
  const roomRef = doc(db, 'characterRushRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as CharacterRushRoom;
  const player = room.players[userId];
  if (!player) return;

  const currentTheme = room.themes[room.currentThemeIndex];
  if (!currentTheme || currentTheme.id !== themeId) {
    throw new Error('Thème invalide');
  }

  // Vérifier si le personnage n'a pas déjà été soumis par ce joueur pour ce thème
  const existingAnswers = player.answers[themeId] || [];
  const alreadySubmitted = existingAnswers.some(
    (a) => a.characterName.toLowerCase().trim() === characterName.toLowerCase().trim()
  );

  if (alreadySubmitted) {
    throw new Error('Personnage déjà soumis');
  }

  // Créer la nouvelle réponse (acceptée localement, validation plus tard)
  const newAnswer: CharacterRushAnswer = {
    characterName: characterName.trim(),
    submittedAt: Date.now(),
    validationStatus: 'pending', // Sera validé à la fin du thème
  };

  // Ajouter la réponse
  const updatedAnswers = [...existingAnswers, newAnswer];

  await updateDoc(roomRef, {
    [`players.${userId}.answers.${themeId}`]: updatedAnswers,
    updatedAt: Date.now(),
  });

  // PAS de validation immédiate! On valide tout en batch à la fin du thème
}

/**
 * Validation asynchrone d'une réponse
 */
async function validateAnswerAsync(
  roomId: string,
  userId: string,
  themeId: string,
  characterName: string,
  theme: string,
  themeEn: string
): Promise<void> {
  try {
    const result = await validateCharacterForTheme(characterName, theme, themeEn);

    const db = getRequiredDb();
    const roomRef = doc(db, 'characterRushRooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return;

    const room = roomSnap.data() as CharacterRushRoom;
    const player = room.players[userId];
    if (!player) return;

    const answers = player.answers[themeId] || [];
    const answerIndex = answers.findIndex(
      (a) => a.characterName.toLowerCase().trim() === characterName.toLowerCase().trim()
    );

    if (answerIndex === -1) return;

    // Mettre à jour le statut de validation
    answers[answerIndex] = {
      ...answers[answerIndex],
      validationStatus: result.valid ? 'valid' : 'invalid',
      reason: result.reason,
      confidence: result.confidence,
    };

    // Calculer le nouveau score
    const totalValidAnswers = Object.values(player.answers).reduce((total, themeAnswers) => {
      return total + themeAnswers.filter((a) => a.validationStatus === 'valid').length;
    }, 0);

    await updateDoc(roomRef, {
      [`players.${userId}.answers.${themeId}`]: answers,
      [`players.${userId}.score`]: totalValidAnswers,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Erreur validation réponse:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculer le classement final
 */
export function calculateCharacterRushLeaderboard(
  room: CharacterRushRoom
): CharacterRushScoreSummary[] {
  const summaries: CharacterRushScoreSummary[] = Object.values(room.players).map((player) => {
    const allAnswers = Object.values(player.answers).flat();
    const totalAnswers = allAnswers.length;
    const validAnswers = allAnswers.filter((a) => a.validationStatus === 'valid').length;
    const accuracy = totalAnswers > 0 ? (validAnswers / totalAnswers) * 100 : 0;

    // Trouver le meilleur thème
    let bestTheme: { theme: string; score: number } | undefined;
    let maxScore = 0;

    Object.entries(player.answers).forEach(([themeId, answers]) => {
      const score = answers.filter((a) => a.validationStatus === 'valid').length;
      if (score > maxScore) {
        maxScore = score;
        const theme = room.themes.find((t) => t.id === themeId);
        if (theme) {
          bestTheme = { theme: theme.theme, score };
        }
      }
    });

    return {
      uid: player.uid,
      username: player.username,
      otakuTitle: player.otakuTitle,
      avatarId: player.avatarId,
      totalScore: validAnswers,
      totalAnswers,
      accuracy,
      rank: 0, // Sera calculé après tri
      bestTheme,
    };
  });

  // Trier par score décroissant, puis par précision
  summaries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.accuracy - a.accuracy;
  });

  // Attribuer les rangs
  summaries.forEach((s, i) => {
    s.rank = i + 1;
  });

  return summaries;
}

/**
 * Enregistrer les résultats dans le profil utilisateur
 */
export async function recordCharacterRushResults(
  room: CharacterRushRoom,
  user: UserProfile
): Promise<UserProfile> {
  const leaderboard = calculateCharacterRushLeaderboard(room);
  const playerSummary = leaderboard.find((s) => s.uid === user.uid);

  if (!playerSummary) return user;

  const isWinner = playerSummary.rank === 1;
  const updatedProfile: UserProfile = {
    ...user,
    gamesPlayed: user.gamesPlayed + 1,
    wins: isWinner ? user.wins + 1 : user.wins,
    totalScore: user.totalScore + playerSummary.totalScore,
  };

  // Sauvegarder dans Firestore si configuré
  const { db, isConfigured } = getFirebaseInstance();
  if (isConfigured && db) {
    const userRef = doc(db as Firestore, 'users', user.uid);
    await updateDoc(userRef, {
      gamesPlayed: updatedProfile.gamesPlayed,
      wins: updatedProfile.wins,
      totalScore: updatedProfile.totalScore,
    });
  }

  return updatedProfile;
}
