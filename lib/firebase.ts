import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ─── Config codée en dur (vos clés otaku-wars) ────────────────────────────────
// Ces valeurs sont publiques (NEXT_PUBLIC_*) — c'est normal qu'elles soient
// dans le code client. La sécurité passe par les règles Firestore.
const HARDCODED_CONFIG = {
  apiKey: 'AIzaSyDMzrByFsgMoRw4n8KBKgodUFd5FiX5xJY',
  authDomain: 'otaku-wars.firebaseapp.com',
  projectId: 'otaku-wars',
  storageBucket: 'otaku-wars.firebasestorage.app',
  messagingSenderId: '785742272867',
  appId: '1:785742272867:web:34f70d4318f73982c81b56',
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _ready = false;

/**
 * Initialise Firebase une seule fois.
 * Appelé explicitement depuis un useEffect côté client (jamais côté serveur).
 */
export function initFirebase() {
  if (_ready) return; // déjà fait

  try {
    const cfg = {
      apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || HARDCODED_CONFIG.apiKey,
      authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || HARDCODED_CONFIG.authDomain,
      projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || HARDCODED_CONFIG.projectId,
      storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || HARDCODED_CONFIG.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || HARDCODED_CONFIG.messagingSenderId,
      appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || HARDCODED_CONFIG.appId,
    };

    _app  = getApps().length ? getApp() : initializeApp(cfg);
    _auth = getAuth(_app);
    _db   = getFirestore(_app);
    _ready = true;

    console.log('🔥 Firebase connecté au projet :', cfg.projectId);
  } catch (e) {
    console.error('❌ Erreur initialisation Firebase :', e);
  }
}

/**
 * Retourne les instances Firebase.
 * Si initFirebase() n'a pas encore été appelé, le tente maintenant.
 */
export function getFirebaseInstance(): {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  isConfigured: boolean;
} {
  if (!_ready && typeof window !== 'undefined') {
    // Tentative tardive (fallback)
    initFirebase();
  }
  return { app: _app, auth: _auth, db: _db, isConfigured: _ready };
}

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/** Conservé pour compatibilité — non utilisé dans le flux normal */
export function saveCustomFirebaseConfig(_config: FirebaseConfig) {
  // Le projet est déjà fixé via les constantes ci-dessus
}
