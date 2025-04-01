import { app, auth, db, storage } from './config';
import firebaseAuthService from './authService';
import firestoreEventService from './eventService';

export {
  app,
  auth,
  db,
  storage,
  firebaseAuthService,
  firestoreEventService,
};

/**
 * Initialize Firebase configuration
 * This is a placeholder for future configuration needs
 */
export const initializeFirebase = () => {
  // The Firebase app is already initialized in the config file
  // This function is a hook for any additional initialization
  console.log('Firebase initialized');
}; 