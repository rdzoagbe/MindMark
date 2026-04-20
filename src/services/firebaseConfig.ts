/**
 * Firebase Configuration
 * 
 * This file uses environment variables as the primary source of truth.
 * For CI environments like GitHub Actions, set these in your Secrets.
 * 
 * In AI Studio, these are automatically populated or can be set in the .env file.
 */

// Strictly require variables from import.meta.env
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
};

// Validate variables and issue console warnings if any are missing
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    console.warn(`[FirebaseConfig] Warning: ${key} is missing in environment variables. Authentication or Database may fail to initialize.`);
  }
});

// Fallback logic implemented gracefully for dev
export const firebaseConfig = config;
