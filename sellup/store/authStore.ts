import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockApi from '@/services/mockApi';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  phone?: string;
  address?: string;
  paymentMethods?: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'venmo' | 'cashapp';
  name: string;
  isDefault: boolean;
  details: string;
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
  loadUser: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      loadUser: async () => {
        try {
          set({ isLoading: true });
          const user = await mockApi.auth.getProfile();
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          // Token might be invalid or expired
          await mockApi.auth.signOut();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mockApi.auth.signIn(email, password);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Invalid email or password', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      signInWithProvider: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mockApi.auth.signInWithProvider(provider);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || `Failed to sign in with ${provider}`, 
            isLoading: false 
          });
          throw error;
        }
      },
      
      signOut: async () => {
        try {
          await mockApi.auth.signOut();
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      updateUserProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await mockApi.auth.updateProfile(userData);
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to update profile', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      addPaymentMethod: async (method) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await mockApi.auth.addPaymentMethod(method);
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to add payment method', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      removePaymentMethod: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await mockApi.auth.removePaymentMethod(id);
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to remove payment method', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      setDefaultPaymentMethod: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await mockApi.auth.setDefaultPaymentMethod(id);
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to set default payment method', 
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        // Only persist these fields
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);