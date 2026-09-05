import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const getDefaultConfig = (): FirebaseConfig => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('otakuwars_firebase_config');
    if (custom) {
      try {
        return JSON.parse(custom);
      } catch {
        // ignore invalid json
      }
    }
  }
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDMzrByFsgMoRw4n8KBKgodUFd5FiX5xJY',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'otaku-wars.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'otaku-wars',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'otaku-wars.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '785742272867',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:785742272867:web:34f70d4318f73982c81b56',
  };
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;
let isConfigured = false;

export function initFirebase(config?: FirebaseConfig) {
  const cfg = config || getDefaultConfig();
  if (cfg.apiKey && cfg.projectId) {
    try {
      if (!getApps().length) {
        firebaseApp = initializeApp(cfg);
      } else {
        firebaseApp = getApp();
      }
      firebaseAuth = getAuth(firebaseApp);
      firebaseDb = getFirestore(firebaseApp);
      isConfigured = true;
      console.log('🔥 Firebase initialisé avec succès !');
    } catch (e) {
      console.warn('⚠️ Échec d\'initialisation Firebase:', e);
      isConfigured = false;
    }
  } else {
    isConfigured = false;
  }
}

// Initial call
if (typeof window !== 'undefined') {
  initFirebase();
}

export function getFirebaseInstance() {
  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb,
    isConfigured
  };
}

export function saveCustomFirebaseConfig(config: FirebaseConfig) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('otakuwars_firebase_config', JSON.stringify(config));
    initFirebase(config);
  }
}
