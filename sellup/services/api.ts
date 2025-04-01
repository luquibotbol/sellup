import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual API URL
const API_URL = 'https://your-api-url.com/api';

// Request headers
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('auth-token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Generic fetch function with error handling
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    }

    // Handle empty responses
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default {
  // Auth endpoints
  auth: {
    signIn: async (email: string, password: string) => {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        await AsyncStorage.setItem('auth-token', response.token);
      }
      
      return response;
    },
    
    signInWithProvider: async (provider: string, token: string) => {
      const response = await fetchAPI(`/auth/${provider}`, {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      
      if (response.token) {
        await AsyncStorage.setItem('auth-token', response.token);
      }
      
      return response;
    },
    
    signOut: async () => {
      await AsyncStorage.removeItem('auth-token');
      return true;
    },
    
    getProfile: async () => {
      return await fetchAPI('/auth/profile');
    },
  },
  
  // Events endpoints
  events: {
    getAll: async () => {
      return await fetchAPI('/events');
    },
    
    getByCategory: async (category: string) => {
      return await fetchAPI(`/events/category/${category}`);
    },
    
    getById: async (id: string) => {
      return await fetchAPI(`/events/${id}`);
    },
    
    create: async (eventData: any) => {
      return await fetchAPI('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },
    
    update: async (id: string, eventData: any) => {
      return await fetchAPI(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
    },
    
    delete: async (id: string) => {
      return await fetchAPI(`/events/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Categories endpoints
  categories: {
    getAll: async () => {
      return await fetchAPI('/categories');
    },
  },
};