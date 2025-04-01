import AsyncStorage from '@react-native-async-storage/async-storage';
import { events as mockEvents } from '@/constants/mockData';
import { Event } from '@/store/eventStore';
import { PaymentMethod, User } from '@/store/authStore';

// Mock user data
const mockUsers = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    paymentMethods: [
      {
        id: 'pm1',
        type: 'card',
        name: 'Visa ending in 4242',
        isDefault: true,
        details: 'Expires 12/25',
      },
      {
        id: 'pm2',
        type: 'paypal',
        name: 'PayPal',
        isDefault: false,
        details: 'alex@example.com',
      },
    ],
  },
  {
    id: 'u2',
    name: 'Maya Rodriguez',
    email: 'maya@example.com',
    password: 'password123',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA',
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize mock events with status
const initializedMockEvents = mockEvents.map(event => ({
  ...event,
  status: 'active'
}));

export default {
  // Auth endpoints
  auth: {
    signIn: async (email: string, password: string) => {
      // Simulate network delay
      await delay(800);
      
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      const token = `mock-token-${generateId()}`;
      await AsyncStorage.setItem('auth-token', token);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    },
    
    signInWithProvider: async (provider: 'google' | 'apple') => {
      // Simulate network delay
      await delay(800);
      
      // Use first mock user for social login
      const user = mockUsers[0];
      const { password: _, ...userWithoutPassword } = user;
      
      const token = `mock-${provider}-token-${generateId()}`;
      await AsyncStorage.setItem('auth-token', token);
      
      return { user: userWithoutPassword, token };
    },
    
    signOut: async () => {
      await AsyncStorage.removeItem('auth-token');
      return true;
    },
    
    getProfile: async () => {
      const token = await AsyncStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await delay(500);
      
      // Return first user for simplicity
      const user = mockUsers[0];
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },
    
    updateProfile: async (userData: Partial<User>) => {
      const token = await AsyncStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await delay(800);
      
      // Update user data
      const userIndex = 0; // Always update first user for simplicity
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData,
      };
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword;
    },
    
    addPaymentMethod: async (method: Omit<PaymentMethod, 'id'>) => {
      const token = await AsyncStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await delay(1000);
      
      // Add payment method
      const userIndex = 0; // Always update first user for simplicity
      const newMethod = {
        ...method,
        id: `pm${generateId()}`,
      };
      
      // If this is the first payment method or it's set as default
      if (!mockUsers[userIndex].paymentMethods || method.isDefault) {
        // Set all other methods to non-default
        if (mockUsers[userIndex].paymentMethods) {
          mockUsers[userIndex].paymentMethods = mockUsers[userIndex].paymentMethods.map(m => ({
            ...m,
            isDefault: false,
          }));
        } else {
          mockUsers[userIndex].paymentMethods = [];
        }
      }
      
      mockUsers[userIndex].paymentMethods.push(newMethod);
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword;
    },
    
    removePaymentMethod: async (id: string) => {
      const token = await AsyncStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await delay(800);
      
      // Remove payment method
      const userIndex = 0; // Always update first user for simplicity
      
      if (!mockUsers[userIndex].paymentMethods) {
        throw new Error('No payment methods found');
      }
      
      const methodIndex = mockUsers[userIndex].paymentMethods.findIndex(m => m.id === id);
      
      if (methodIndex === -1) {
        throw new Error('Payment method not found');
      }
      
      // Check if it's the default method
      if (mockUsers[userIndex].paymentMethods[methodIndex].isDefault) {
        throw new Error('Cannot remove default payment method');
      }
      
      mockUsers[userIndex].paymentMethods.splice(methodIndex, 1);
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword;
    },
    
    setDefaultPaymentMethod: async (id: string) => {
      const token = await AsyncStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await delay(800);
      
      // Set default payment method
      const userIndex = 0; // Always update first user for simplicity
      
      if (!mockUsers[userIndex].paymentMethods) {
        throw new Error('No payment methods found');
      }
      
      const methodIndex = mockUsers[userIndex].paymentMethods.findIndex(m => m.id === id);
      
      if (methodIndex === -1) {
        throw new Error('Payment method not found');
      }
      
      // Set all methods to non-default
      mockUsers[userIndex].paymentMethods = mockUsers[userIndex].paymentMethods.map(m => ({
        ...m,
        isDefault: m.id === id,
      }));
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword;
    },
  },
  
  // Events endpoints
  events: {
    getAll: async () => {
      // Simulate network delay
      await delay(1000);
      
      // Get events from AsyncStorage if available, otherwise use mock data
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        if (storedEvents) {
          return JSON.parse(storedEvents);
        }
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
      }
      
      // Initialize with mock data if nothing in storage
      await AsyncStorage.setItem('events', JSON.stringify(initializedMockEvents));
      return initializedMockEvents;
    },
    
    getByCategory: async (category: string) => {
      // Simulate network delay
      await delay(800);
      
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        const events = storedEvents ? JSON.parse(storedEvents) : initializedMockEvents;
        return events.filter((event: Event) => event.category === category);
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        return initializedMockEvents.filter(event => event.category === category);
      }
    },
    
    getById: async (id: string) => {
      // Simulate network delay
      await delay(500);
      
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        const events = storedEvents ? JSON.parse(storedEvents) : initializedMockEvents;
        const event = events.find((e: Event) => e.id === id);
        
        if (!event) {
          throw new Error('Event not found');
        }
        
        return event;
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        const event = initializedMockEvents.find(e => e.id === id);
        
        if (!event) {
          throw new Error('Event not found');
        }
        
        return event;
      }
    },
    
    create: async (eventData: Omit<Event, 'id'>) => {
      // Simulate network delay
      await delay(1200);
      
      const newEvent = {
        ...eventData,
        id: generateId(),
      };
      
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        const events = storedEvents ? JSON.parse(storedEvents) : initializedMockEvents;
        const updatedEvents = [...events, newEvent];
        await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Error writing to AsyncStorage:', error);
      }
      
      return newEvent;
    },
    
    update: async (id: string, eventData: Partial<Event>) => {
      // Simulate network delay
      await delay(1000);
      
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        const events = storedEvents ? JSON.parse(storedEvents) : initializedMockEvents;
        
        const eventIndex = events.findIndex((e: Event) => e.id === id);
        if (eventIndex === -1) {
          throw new Error('Event not found');
        }
        
        const updatedEvent = { ...events[eventIndex], ...eventData };
        events[eventIndex] = updatedEvent;
        
        await AsyncStorage.setItem('events', JSON.stringify(events));
        return updatedEvent;
      } catch (error) {
        console.error('Error updating event in AsyncStorage:', error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      // Simulate network delay
      await delay(800);
      
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        const events = storedEvents ? JSON.parse(storedEvents) : initializedMockEvents;
        
        const updatedEvents = events.filter((e: Event) => e.id !== id);
        await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
        
        return { success: true };
      } catch (error) {
        console.error('Error deleting event from AsyncStorage:', error);
        throw error;
      }
    },
  },
  
  // Categories endpoints
  categories: {
    getAll: async () => {
      // Simulate network delay
      await delay(600);
      
      // Return categories from mockData
      const { categories } = await import('@/constants/mockData');
      return categories;
    },
  },
};