import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Session } from '../types';

const getSessionsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'sessions');
};

export const subscribeToSessions = (userId: string, callback: (sessions: Session[]) => void) => {
  const q = query(getSessionsCollection(userId), orderBy('updatedAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore timestamps back to numbers if needed, 
        // but the prompt says createdAt/updatedAt are numbers in the type.
        // If they are stored as numbers in Firestore, this is fine.
      } as Session;
    });
    callback(sessions);
  }, (error) => {
    console.error("Error subscribing to sessions:", error);
  });
};

export const saveSessionToCloud = async (userId: string, session: Session) => {
  const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
  await setDoc(sessionRef, {
    ...session,
    updatedAt: Date.now()
  });
};

export const deleteSessionFromCloud = async (userId: string, sessionId: string) => {
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  await deleteDoc(sessionRef);
};
