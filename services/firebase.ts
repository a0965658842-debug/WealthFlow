
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getEnv } from "./utils";

// Helper to sanitize keys (remove quotes, newlines, and whitespace which often cause api-key-not-valid errors)
const sanitize = (key: string | undefined): string => {
  if (!key) return '';
  return key.replace(/['"\s\n\r]/g, '').trim();
};

const apiKey = sanitize(getEnv("FIREBASE_API_KEY") || getEnv("REACT_APP_FIREBASE_API_KEY"));
const authDomain = sanitize(getEnv("FIREBASE_AUTH_DOMAIN") || getEnv("REACT_APP_FIREBASE_AUTH_DOMAIN"));
const projectId = sanitize(getEnv("FIREBASE_PROJECT_ID") || getEnv("REACT_APP_FIREBASE_PROJECT_ID"));
const storageBucket = sanitize(getEnv("FIREBASE_STORAGE_BUCKET") || getEnv("REACT_APP_FIREBASE_STORAGE_BUCKET"));
const messagingSenderId = sanitize(getEnv("FIREBASE_MESSAGING_SENDER_ID") || getEnv("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"));
const appId = sanitize(getEnv("FIREBASE_APP_ID") || getEnv("REACT_APP_FIREBASE_APP_ID"));

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

let app: FirebaseApp | undefined;
let auth: Auth;
let db: Firestore;

// 嘗試初始化 Firebase，如果失敗（例如沒有 Key），不會讓程式崩潰
try {
  // Check if apiKey appears valid (not empty and reasonable length)
  if (apiKey && apiKey.length > 10 && projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config is missing or invalid. Authentication will not work.");
    // 建立一個假的 auth 物件避免 undefined error
    auth = {} as Auth; 
    db = {} as Firestore;
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  auth = {} as Auth;
  db = {} as Firestore;
}

export { auth, db, app };
export const isFirebaseInitialized = !!(app && apiKey && apiKey.length > 10);
