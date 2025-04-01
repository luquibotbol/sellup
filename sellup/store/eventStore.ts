import { create } from 'zustand';
import { firestoreEventService } from '@/firebase';

export interface Seller {
  id: string;
  name: string;
  contact: string;
}

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
  location: string;
  description: string;
  price: number;
  image: string;
  additionalInfo?: string;
  seller: Seller;
  type: 'buy' | 'sell';
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: (options?: {
    category?: string;
    type?: 'buy' | 'sell';
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  getEventsByCategory: (category: string) => Promise<Event[]>;
  getEventById: (id: string) => Promise<Event | undefined>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  clearError: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,
  
  fetchEvents: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const events = await firestoreEventService.getEvents(options);
      set({ events, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  addEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const newEvent = await firestoreEventService.createEvent(eventData);
      set((state) => ({
        events: [...state.events, newEvent],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  getEventsByCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const events = await firestoreEventService.getEventsByCategory(category);
      set({ isLoading: false });
      return events;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events by category';
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },
  
  getEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const event = await firestoreEventService.getEventById(id);
      set({ isLoading: false });
      return event;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch event';
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },
  
  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEvent = await firestoreEventService.updateEvent(id, eventData);
      
      // Update the event in the local state
      set((state) => ({
        events: state.events.map((event) => 
          event.id === id ? updatedEvent : event
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await firestoreEventService.deleteEvent(id);
      
      // Remove the event from the local state
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  fetchMyEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await firestoreEventService.getMyEvents();
      set({ events, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch your events';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));