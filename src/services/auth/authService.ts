/**
 * Placeholder Authentication Service
 * To be replaced with Supabase Auth or Firebase Auth in the future.
 */

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const authService = {
  login: async (): Promise<void> => {
    console.log('Auth: Login requested (Coming Soon)');
  },

  logout: async (): Promise<void> => {
    console.log('Auth: Logout requested');
  },

  getCurrentUser: (): User | null => {
    return null;
  },

  isAuthenticated: (): boolean => {
    return false;
  }
};
