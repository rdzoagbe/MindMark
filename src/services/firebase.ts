import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';

/**
 * Firebase configuration with environment variables and hardcoded fallbacks.
 * This ensures the app doesn't crash in production environments (like GitHub Pages)
 * where VITE_FIREBASE_* environment variables might not be injected at runtime.
 */
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
}, firebaseConfig.firestoreDatabaseId);

/**
 * Validate Connection to Firestore
 * CRITICAL CONSTRAINT: When the application initially boots, call getFromServer to test the connection to Firestore.
 */
async function testConnection() {
  try {
    // We use a dummy path to test connectivity
    await getDocFromServer(doc(db, '_internal_', 'connectivity_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline or the project ID is incorrect.");
    }
    // Skip logging for other errors (like 404 or permission denied), 
    // as this is simply a connection test to verify the backend is reachable.
  }
}

// Run connection test in the background
testConnection();
