import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Session, SessionStatus } from '../types';
import { sessionMigrations } from '../utils/sessionMigrations';
import { storage } from '../utils/storage';
import { useAuth } from './useAuth';
import { usePlan } from './usePlan';
import { subscribeToSessions, saveSessionToCloud, deleteSessionFromCloud } from '../services/sessionService';

const STORAGE_KEY = 'context-saver-sessions';

const SAMPLE_DATA: Session[] = [
  {
    id: 'sample-1',
    title: 'Welcome to Context Saver',
    category: 'Onboarding',
    currentTask: 'Exploring the app features.',
    pauseReason: 'Just getting started!',
    nextStep: 'Create your first real session by clicking the "New Session" button.',
    notes: 'Context Saver helps you save what you were doing, why you paused, and what to do next. This way, you can resume instantly without losing momentum.',
    tags: ['onboarding', 'tutorial'],
    links: [{ id: 'l1', label: 'Documentation', url: 'https://github.com/rolanddzoagbe/context-saver' }],
    priority: 'high',
    status: 'active',
    pinned: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];

export function useSessions() {
  const { user, isAuthenticated } = useAuth();
  const { isPro } = usePlan();
  const [localSessions, setLocalSessions] = useLocalStorage<Session[]>(STORAGE_KEY, []);
  const [cloudSessions, setCloudSessions] = useState<Session[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Cloud sync is only for Pro users who are logged in
  const canSync = isAuthenticated && isPro;

  // Source of truth depends on sync capability
  const sessions = canSync ? cloudSessions : localSessions;

  // Initialize with sample data if empty and not syncing
  useEffect(() => {
    if (!canSync && localSessions.length === 0 && !storage.get('has-initialized', false)) {
      setLocalSessions(SAMPLE_DATA);
      storage.set('has-initialized', true);
    }
  }, [canSync, localSessions.length, setLocalSessions]);

  // Subscribe to cloud sessions when syncing is enabled
  useEffect(() => {
    if (canSync && user) {
      setIsSyncing(true);
      const unsubscribe = subscribeToSessions(user.uid, (sessions) => {
        setCloudSessions(sessions);
        setIsSyncing(false);
      });
      return () => unsubscribe();
    } else {
      setCloudSessions([]);
      setIsSyncing(false);
    }
  }, [canSync, user]);

  const addSession = async (sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (canSync && user) {
      await saveSessionToCloud(user.uid, newSession);
    } else {
      setLocalSessions((prev) => [newSession, ...prev]);
    }
    return newSession;
  };

  const updateSession = async (id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const sessionToUpdate = sessions.find(s => s.id === id);
    if (!sessionToUpdate) return;

    const updatedSession = { ...sessionToUpdate, ...sessionData, updatedAt: Date.now() };

    if (canSync && user) {
      await saveSessionToCloud(user.uid, updatedSession);
    } else {
      setLocalSessions((prev) =>
        prev.map((session) =>
          session.id === id ? updatedSession : session
        )
      );
    }
  };

  const deleteSession = async (id: string) => {
    if (canSync && user) {
      await deleteSessionFromCloud(user.uid, id);
    } else {
      setLocalSessions((prev) => prev.filter((session) => session.id !== id));
    }
  };

  const duplicateSession = async (id: string) => {
    const sessionToDuplicate = sessions.find(s => s.id === id);
    if (sessionToDuplicate) {
      const { id: _, createdAt: __, updatedAt: ___, ...rest } = sessionToDuplicate;
      return addSession({
        ...rest,
        title: `${rest.title} (Copy)`,
      });
    }
  };

  const togglePin = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      await updateSession(id, { pinned: !session.pinned });
    }
  };

  const updateStatus = async (id: string, status: SessionStatus) => {
    await updateSession(id, { status });
  };

  const archiveSession = async (id: string) => {
    await updateStatus(id, 'archived');
  };

  const restoreSession = async (id: string) => {
    await updateStatus(id, 'active');
  };

  const markAsDone = async (id: string) => {
    await updateStatus(id, 'done');
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear ALL sessions? This cannot be undone.')) {
      if (canSync && user) {
        // For cloud, we'd need to delete each one or have a batch delete
        // For simplicity in this first version, let's just delete them one by one
        for (const session of cloudSessions) {
          await deleteSessionFromCloud(user.uid, session.id);
        }
      } else {
        setLocalSessions([]);
      }
    }
  };

  const importSessions = async (importedSessions: any[]) => {
    const migrated = sessionMigrations.migrate(importedSessions);
    if (canSync && user) {
      for (const session of migrated) {
        await saveSessionToCloud(user.uid, session);
      }
    } else {
      setLocalSessions(migrated);
    }
  };

  const getSummary = () => {
    const active = sessions.filter(s => s.status === 'active').length;
    const archived = sessions.filter(s => s.status === 'archived').length;
    const done = sessions.filter(s => s.status === 'done').length;
    const blocked = sessions.filter(s => s.status === 'blocked').length;
    
    return {
      total: sessions.length,
      active,
      archived,
      done,
      blocked,
      recent: sessions.slice(0, 3)
    };
  };

  return {
    sessions,
    isSyncing,
    addSession,
    updateSession,
    deleteSession,
    duplicateSession,
    togglePin,
    updateStatus,
    archiveSession,
    restoreSession,
    markAsDone,
    clearAllData,
    importSessions,
    getSummary,
  };
}
