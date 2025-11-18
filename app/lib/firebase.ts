// app/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

function createFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Single app + db instances shared everywhere
const app = createFirebaseApp();
const db: Firestore = getFirestore(app);

/** Get Auth only on the client. Returns null on the server. */
export function getClientAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  const auth = getAuth(app);
  // set persistence once (safe to call repeatedly)
  setPersistence(auth, browserLocalPersistence).catch(() => {});
  return auth;
}

/** Firestore client – used from client components like profile page */
export function getClientDb(): Firestore {
  return db;
}

export { app, db };
