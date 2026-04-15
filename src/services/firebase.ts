import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAWXJvUm-1yd0tpaIgyvcRfw3b_fUP0tww",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "saas-guard-c146e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "saas-guard-c146e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "saas-guard-c146e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "797282215228",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:797282215228:web:4684bd158ffd082d846a39",
};

// Runtime validation to prevent silent failures
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
] as const;

for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    console.warn(`Missing required Firebase configuration: ${key}. Using fallback if available.`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
