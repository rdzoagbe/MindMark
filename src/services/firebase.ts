import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration with environment variables and hardcoded fallbacks.
 * This ensures the app doesn't crash in production environments (like GitHub Pages)
 * where VITE_FIREBASE_* environment variables might not be injected at runtime.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAWXJvUm-1yd0tpaIgyvcRfw3b_fUP0tww",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "saas-guard-c146e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "saas-guard-c146e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "saas-guard-c146e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "797282215228",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:797282215228:web:4684bd158ffd082d846a39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
