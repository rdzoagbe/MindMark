import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value || typeof value !== 'string' || value.trim() === '') {
    // Fallback for AI Studio environment if env vars are not yet propagated
    const fallbacks: Record<string, string> = {
      VITE_FIREBASE_API_KEY: 'AIzaSyAWXJvUm-1yd0tpaIgyvcRfw3b_fUP0tww',
      VITE_FIREBASE_AUTH_DOMAIN: 'saas-guard-c146e.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'saas-guard-c146e',
      VITE_FIREBASE_STORAGE_BUCKET: 'saas-guard-c146e.firebasestorage.app',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '797282215228',
      VITE_FIREBASE_APP_ID: '1:797282215228:web:4684bd158ffd082d846a39',
    };
    if (fallbacks[name]) return fallbacks[name];
    throw new Error(`Missing required Firebase configuration: ${name}`);
  }
  return value.trim();
}

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
};

console.log('Firebase debug', {
  apiKeyPrefix: firebaseConfig.apiKey.slice(0, 8),
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appIdPrefix: firebaseConfig.appId.slice(0, 12),
});

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
