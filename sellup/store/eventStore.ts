import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { events as mockEvents } from '@/constants/mockData';

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
  addEvent: (event: Omit<Event, 'id'>) => void;
  getEventsByCategory: (category: string) => Event[];
  getEventById: (id: string) => Event | undefined;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: mockEvents as Event[],
      isLoading: false,
      error: null,
      
      addEvent: (eventData) => {
        const newEvent = {
          ...eventData,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      
      getEventsByCategory: (category) => {
        return get().events.filter(event => event.category === category);
      },
      
      getEventById: (id) => {
        return get().events.find(event => event.id === id);
      },
    }),
    {
      name: 'events-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);