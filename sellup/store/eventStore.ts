import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockApi from '@/services/mockApi';

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
  status?: 'active' | 'completed' | 'cancelled' | 'pending';
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchEventsByCategory: (category: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEventStatus: (id: string, status: 'active' | 'completed' | 'cancelled' | 'pending') => Promise<void>;
  getEventsByCategory: (category: string) => Event[];
  getEventById: (id: string) => Event | undefined;
  getUserEvents: (userId: string) => Event[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,
      error: null,
      
      fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          const events = await mockApi.events.getAll();
          set({ events, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to fetch events', 
            isLoading: false 
          });
        }
      },
      
      fetchEventsByCategory: async (category) => {
        set({ isLoading: true, error: null });
        try {
          const events = await mockApi.events.getByCategory(category);
          // Merge with existing events, replacing any with the same ID
          const existingEvents = get().events.filter(
            e => e.category !== category
          );
          set({ 
            events: [...existingEvents, ...events], 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || `Failed to fetch ${category} events`, 
            isLoading: false 
          });
        }
      },
      
      addEvent: async (eventData) => {
        set({ isLoading: true, error: null });
        try {
          // Set default status to active
          const eventWithStatus = {
            ...eventData,
            status: 'active' as const
          };
          
          const newEvent = await mockApi.events.create(eventWithStatus);
          set((state) => ({
            events: [...state.events, newEvent],
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to create event', 
            isLoading: false 
          });
          throw error; // Re-throw to handle in the UI
        }
      },
      
      updateEventStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          const updatedEvent = await mockApi.events.update(id, { status });
          
          set((state) => ({
            events: state.events.map(event => 
              event.id === id ? { ...event, status } : event
            ),
            isLoading: false
          }));
          
          return updatedEvent;
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to update event status', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      getEventsByCategory: (category) => {
        return get().events.filter(event => event.category === category);
      },
      
      getEventById: (id) => {
        return get().events.find(event => event.id === id);
      },
      
      getUserEvents: (userId) => {
        return get().events.filter(event => event.seller.id === userId);
      },
    }),
    {
      name: 'events-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist the events array
        events: state.events
      }),
    }
  )
);