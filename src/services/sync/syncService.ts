/**
 * Placeholder Cloud Sync Service
 * To be replaced with Supabase or Firebase integration in the future.
 */

import { Session } from '../../types';

export const syncService = {
  syncSessionsToCloud: async (sessions: Session[]): Promise<void> => {
    console.log('Sync: Syncing sessions to cloud (Coming Soon)', sessions.length);
  },

  fetchSessionsFromCloud: async (): Promise<Session[]> => {
    console.log('Sync: Fetching sessions from cloud (Coming Soon)');
    return [];
  }
};
