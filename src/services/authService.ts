import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';

export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, provider);
};

export const signInWithMicrosoft = () => {
  const provider = new OAuthProvider('microsoft.com');
  // Microsoft usually works better with common tenant for generic apps
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, provider);
};

export const sendPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // Sync UID to cookie for the extension to read
      document.cookie = `mindmark_uid=${user.uid}; path=/; max-age=31536000; SameSite=Lax`;
      
      // Task 1: Secure Extension Auth (Cross-Context)
      // Broadcast to the MindMark extension if installed
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        // You would typically use the actual extension ID here. 
        // For a public extension, use the known Web Store ID.
        // For local development, this relies on externally_connectable in the extension manifest.
        try {
          // Since we are the web page sending to our own background script (which must declare externally_connectable)
          // We broadcast via window.postMessage first as a fallback, or if we know the ID, we can send directly.
          window.postMessage({ type: 'MINDMARK_AUTH_SYNC', userId: user.uid }, '*');
          
          // Note: If we had the EXTENSION_ID, we would do:
          // chrome.runtime.sendMessage(EXTENSION_ID, { type: 'AUTH_SYNC', userId: user.uid });
        } catch (e) {
          console.warn('Could not communicate with extension:', e);
        }
      }
    } else {
      document.cookie = `mindmark_uid=; path=/; max-age=0; SameSite=Lax`;
    }
    callback(user);
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
