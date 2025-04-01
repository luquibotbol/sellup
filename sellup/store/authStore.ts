import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuthService } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

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
  signOut: () => Promise<void>;
  clearError: () => void;
  updateUserProfile: (userData: { displayName?: string, photoURL?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await firebaseAuthService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
          set({ error: errorMessage, isLoading: false });
        }
      },
      
      signInWithProvider: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, you would use expo-auth-session or similar to get the token
          // This is a placeholder for the concept
          const token = 'mock-provider-token';
          
          const user = await firebaseAuthService.signInWithProvider(provider, token);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to sign in with ${provider}`;
          set({ error: errorMessage, isLoading: false });
        }
      },
      
      signOut: async () => {
        set({ isLoading: true });
        try {
          await firebaseAuthService.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          console.error('Error during sign out:', error);
          // Still consider the user logged out even if the API call fails
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      updateUserProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await firebaseAuthService.updateUserProfile(userData);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
          set({ error: errorMessage, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Set up auth state listener
if (auth) {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        profileImage: firebaseUser.photoURL || undefined,
      };
      
      // Only update if the user is not already set or if the user info has changed
      const currentState = useAuthStore.getState();
      if (!currentState.user || currentState.user.id !== user.id) {
        useAuthStore.setState({ user, isAuthenticated: true });
      }
    } else {
      // User is signed out
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }
  });
}