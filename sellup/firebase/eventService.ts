import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QuerySnapshot,
  DocumentData,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { auth } from './config';
import { Event, Seller } from '@/store/eventStore';

// Collection name in Firestore
const EVENTS_COLLECTION = 'events';

/**
 * Convert Firestore data to Event object
 */
const convertFirestoreEventToEvent = (id: string, data: DocumentData): Event => {
  return {
    id,
    name: data.name,
    category: data.category,
    date: data.date.toDate().toISOString(),
    location: data.location,
    description: data.description,
    price: data.price,
    image: data.image,
    additionalInfo: data.additionalInfo,
    seller: {
      id: data.seller.id,
      name: data.seller.name,
      contact: data.seller.contact,
    },
    type: data.type as 'buy' | 'sell',
  };
};

/**
 * Firebase Firestore service for events
 */
class FirestoreEventService {
  /**
   * Get all events with optional filtering
   */
  async getEvents(options: {
    category?: string;
    type?: 'buy' | 'sell';
    page?: number;
    pageSize?: number;
  } = {}): Promise<Event[]> {
    try {
      const { category, type, page = 1, pageSize = 20 } = options;
      
      // Start building the query
      let eventsQuery = collection(db, EVENTS_COLLECTION);
      let constraints = [];
      
      // Add filters
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      if (type) {
        constraints.push(where('type', '==', type));
      }
      
      // Add ordering
      constraints.push(orderBy('date', 'desc'));
      
      // Apply pagination
      constraints.push(limit(pageSize));
      
      // If it's not the first page, we need the last document from the previous page
      // This is a simplified approach; in a real app, you would store the last document
      if (page > 1) {
        // In a real implementation, you would get this from the previous query
        // This is just a placeholder for the concept
        const lastVisibleDoc = null;
        if (lastVisibleDoc) {
          constraints.push(startAfter(lastVisibleDoc));
        }
      }
      
      // Apply all constraints to the query
      const finalQuery = query(eventsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot: QuerySnapshot = await getDocs(finalQuery);
      
      // Convert query results to Event objects
      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        events.push(convertFirestoreEventToEvent(doc.id, doc.data()));
      });
      
      return events;
    } catch (error: any) {
      console.error('Error getting events:', error);
      throw new Error(error.message || 'Failed to fetch events');
    }
  }

  /**
   * Get events by category
   */
  async getEventsByCategory(category: string): Promise<Event[]> {
    return this.getEvents({ category });
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<Event> {
    try {
      const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, id));
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      return convertFirestoreEventToEvent(eventDoc.id, eventDoc.data());
    } catch (error: any) {
      console.error(`Error getting event ${id}:`, error);
      throw new Error(error.message || 'Failed to fetch event');
    }
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    try {
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to create an event');
      }
      
      // Prepare event data for Firestore
      const newEvent = {
        ...eventData,
        date: Timestamp.fromDate(new Date(eventData.date)),
        seller: {
          id: currentUser.uid,
          name: currentUser.displayName || 'Anonymous',
          contact: eventData.seller.contact,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Add document to Firestore
      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), newEvent);
      
      // Return the created event
      return {
        ...eventData,
        id: docRef.id,
      };
    } catch (error: any) {
      console.error('Error creating event:', error);
      throw new Error(error.message || 'Failed to create event');
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    try {
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to update an event');
      }
      
      // Get the event to verify ownership
      const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, id));
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      const eventDocData = eventDoc.data();
      
      // Check if the current user is the owner of the event
      if (eventDocData.seller.id !== currentUser.uid) {
        throw new Error('You can only update your own events');
      }
      
      // Prepare update data
      const updateData: any = {
        ...eventData,
        updatedAt: serverTimestamp(),
      };
      
      // Convert date string to Timestamp if provided
      if (eventData.date) {
        updateData.date = Timestamp.fromDate(new Date(eventData.date));
      }
      
      // Update the document
      await updateDoc(doc(db, EVENTS_COLLECTION, id), updateData);
      
      // Get the updated event
      const updatedEventDoc = await getDoc(doc(db, EVENTS_COLLECTION, id));
      
      if (!updatedEventDoc.exists()) {
        throw new Error('Failed to retrieve updated event');
      }
      
      return convertFirestoreEventToEvent(id, updatedEventDoc.data());
    } catch (error: any) {
      console.error(`Error updating event ${id}:`, error);
      throw new Error(error.message || 'Failed to update event');
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to delete an event');
      }
      
      // Get the event to verify ownership
      const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, id));
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      const eventDocData = eventDoc.data();
      
      // Check if the current user is the owner of the event
      if (eventDocData.seller.id !== currentUser.uid) {
        throw new Error('You can only delete your own events');
      }
      
      // Delete the document
      await deleteDoc(doc(db, EVENTS_COLLECTION, id));
    } catch (error: any) {
      console.error(`Error deleting event ${id}:`, error);
      throw new Error(error.message || 'Failed to delete event');
    }
  }

  /**
   * Upload an image for an event
   */
  async uploadEventImage(file: Blob, fileName: string): Promise<string> {
    try {
      // Create storage reference
      const storageRef = ref(storage, `event-images/${fileName}`);
      
      // Upload file
      const uploadTask = await uploadBytesResumable(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  /**
   * Get events created by the current user
   */
  async getMyEvents(): Promise<Event[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to view your events');
      }
      
      const eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('seller.id', '==', currentUser.uid),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(eventsQuery);
      
      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        events.push(convertFirestoreEventToEvent(doc.id, doc.data()));
      });
      
      return events;
    } catch (error: any) {
      console.error('Error getting user events:', error);
      throw new Error(error.message || 'Failed to fetch your events');
    }
  }
}

export const firestoreEventService = new FirestoreEventService();
export default firestoreEventService; 