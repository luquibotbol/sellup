import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from './config';
import { User } from '@/store/authStore';

/**
 * Convert a Firebase user to our app's user model
 */
export const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    profileImage: firebaseUser.photoURL || undefined,
  };
};

/**
 * Firebase authentication service
 */
class FirebaseAuthService {
  /**
   * Sign in with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      return mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
      // Convert Firebase error to a more user-friendly error
      const errorCode = error.code;
      
      if (errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      } else if (errorCode === 'auth/user-disabled') {
        throw new Error('This account has been disabled.');
      } else {
        throw new Error(error.message || 'Failed to sign in.');
      }
    }
  }

  /**
   * Register a new user with email and password
   */
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      // Create the user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Update the user's profile with their name
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      
      return mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
      // Convert Firebase error to a more user-friendly error
      const errorCode = error.code;
      
      if (errorCode === 'auth/email-already-in-use') {
        throw new Error('This email is already in use.');
      } else if (errorCode === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (errorCode === 'auth/weak-password') {
        throw new Error('The password is too weak.');
      } else {
        throw new Error(error.message || 'Failed to create account.');
      }
    }
  }

  /**
   * Sign in with a third-party provider (Google, Apple)
   */
  async signInWithProvider(provider: 'google' | 'apple', token: string): Promise<User> {
    try {
      let credential;
      
      if (provider === 'google') {
        // For Google, token would be an ID token
        credential = GoogleAuthProvider.credential(token);
      } else if (provider === 'apple') {
        // For Apple, token would be an ID token
        const appleProvider = new OAuthProvider('apple.com');
        credential = appleProvider.credential({
          idToken: token,
        });
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
      
      const userCredential = await signInWithCredential(auth, credential);
      return mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
      throw new Error(error.message || `Failed to sign in with ${provider}.`);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out.');
    }
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    
    if (firebaseUser) {
      return mapFirebaseUserToUser(firebaseUser);
    }
    
    return null;
  }

  /**
   * Update the user's profile
   */
  async updateUserProfile(userData: { displayName?: string, photoURL?: string }): Promise<User> {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('No authenticated user.');
      }
      
      await updateProfile(firebaseUser, userData);
      
      return mapFirebaseUserToUser(firebaseUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile.');
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService; 