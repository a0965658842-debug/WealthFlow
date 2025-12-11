
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getEnv } from "./utils";

// 使用安全的 getEnv 工具來讀取變數，避免白畫面崩潰
const apiKey = getEnv("FIREBASE_API_KEY") || getEnv("REACT_APP_FIREBASE_API_KEY");
const authDomain = getEnv("FIREBASE_AUTH_DOMAIN") || getEnv("REACT_APP_FIREBASE_AUTH_DOMAIN");
const projectId = getEnv("FIREBASE_PROJECT_ID") || getEnv("REACT_APP_FIREBASE_PROJECT_ID");
const storageBucket = getEnv("FIREBASE_STORAGE_BUCKET") || getEnv("REACT_APP_FIREBASE_STORAGE_BUCKET");
const messagingSenderId = getEnv("FIREBASE_MESSAGING_SENDER_ID") || getEnv("REACT_APP_FIREBASE_MESSAGING_SENDER_ID");
const appId = getEnv("FIREBASE_APP_ID") || getEnv("REACT_APP_FIREBASE_APP_ID");

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
  if (apiKey && projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config is missing. Authentication will not work.");
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
export const isFirebaseInitialized = !!(app && apiKey);
