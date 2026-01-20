/**
 * API Service - Typed HTTP client
 */

import axios from 'axios';
import { Restaurant, MenuItem, Order } from '../types';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  // Add auth token if available
  // const token = useAuthStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Restaurant endpoints
export const restaurantApi = {
  getAll: async (): Promise<Restaurant[]> => {
    const { data } = await api.get('/restaurants');
    return data;
  },
  
  getById: async (id: string): Promise<Restaurant> => {
    const { data } = await api.get(`/restaurants/${id}`);
    return data;
  },
  
  search: async (query: string): Promise<Restaurant[]> => {
    const { data } = await api.get(`/restaurants/search?q=${query}`);
    return data;
  },
};

// Menu endpoints
export const menuApi = {
  getByRestaurant: async (restaurantId: string): Promise<MenuItem[]> => {
    const { data } = await api.get(`/restaurants/${restaurantId}/menu`);
    return data;
  },
};

// Order endpoints
export const orderApi = {
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data;
  },
  
  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};

export default api;
