import { useLocalStorage } from './useLocalStorage';
import { Session } from '../types';

const STORAGE_KEY = 'context-saver-sessions';

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEY, []);

  const addSession = (sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const updateSession = (id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? { ...session, ...sessionData, updatedAt: Date.now() }
          : session
      )
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const duplicateSession = (id: string) => {
    const sessionToDuplicate = sessions.find(s => s.id === id);
    if (sessionToDuplicate) {
      const { id: _, createdAt: __, updatedAt: ___, ...rest } = sessionToDuplicate;
      return addSession({
        ...rest,
        title: `${rest.title} (Copy)`,
      });
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL sessions? This cannot be undone.')) {
      setSessions([]);
    }
  };

  const importSessions = (importedSessions: Session[]) => {
    setSessions(importedSessions);
  };

  const exportSessions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `context-saver-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    duplicateSession,
    clearAllData,
    importSessions,
    exportSessions,
  };
}
