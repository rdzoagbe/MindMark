import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const LANGUAGES = ['EN', 'FR', 'ES', 'PT', 'ZH', 'DE'];

interface LanguageContextType {
  preferredLanguage: string;
  isSavingLanguage: boolean;
  LANGUAGES: string[];
  handleLanguageChange: (newLang: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferredLanguage, setPreferredLanguage] = useState<string>('EN');
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);

  // Initial load from local storage
  useEffect(() => {
    const localLang = localStorage.getItem('preferredLanguage');
    if (localLang && LANGUAGES.includes(localLang)) {
      setPreferredLanguage(localLang);
    }
  }, []);

  // Listen to Firestore changes if authenticated
  useEffect(() => {
    if (!user) return;
    
    setIsSavingLanguage(true); // Treat initial fetch as a loading state briefly

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.settings?.preferredLanguage && LANGUAGES.includes(data.settings.preferredLanguage)) {
          setPreferredLanguage(data.settings.preferredLanguage);
          localStorage.setItem('preferredLanguage', data.settings.preferredLanguage);
        }
      }
      setIsSavingLanguage(false);
    }, (error) => {
      console.error("Language sync error:", error);
      setIsSavingLanguage(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLanguageChange = async (newLang: string) => {
    // Optimistic update - this makes the UI instant across all components!
    setPreferredLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    
    if (!user) return;

    setIsSavingLanguage(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        settings: {
          preferredLanguage: newLang
        }
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save preferred language:', err);
      // Revert if necessary, but optimistic is usually fine here
    } finally {
      setIsSavingLanguage(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ preferredLanguage, isSavingLanguage, handleLanguageChange, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
