import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Mock authentication
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user = {
            id: '1',
            name: 'John Doe',
            email,
            profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Invalid email or password', isLoading: false });
        }
      },
      
      signInWithProvider: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          // Mock provider authentication
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user = {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: `Failed to sign in with ${provider}`, isLoading: false });
        }
      },
      
      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);