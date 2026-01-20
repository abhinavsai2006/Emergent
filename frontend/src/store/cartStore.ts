/**
 * Cart Store - Shopping cart state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: string[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  orderType: 'delivery' | 'dine-in' | 'takeaway';
  scheduledTime: string | null;
  deliveryAddress: {
    hostelBlock: string;
    roomNumber: string;
  } | null;
  
  // Computed
  totalItems: () => number;
  subtotal: () => number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>, restaurant: { id: string; name: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'delivery' | 'dine-in' | 'takeaway') => void;
  setScheduledTime: (time: string | null) => void;
  setDeliveryAddress: (address: { hostelBlock: string; roomNumber: string } | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      orderType: 'delivery',
      scheduledTime: null,
      deliveryAddress: null,
      
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      subtotal: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      
      addItem: (item, restaurant) => set((state) => {
        // If cart has items from different restaurant, clear it first
        if (state.restaurantId && state.restaurantId !== restaurant.id) {
          return {
            items: [{ ...item, id: Date.now().toString() }],
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
          };
        }
        
        // Check if item already exists
        const existingIndex = state.items.findIndex(
          (i) => i.menuItemId === item.menuItemId && 
                 JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
        );
        
        if (existingIndex > -1) {
          const newItems = [...state.items];
          newItems[existingIndex].quantity += item.quantity;
          return { items: newItems };
        }
        
        return {
          items: [...state.items, { ...item, id: Date.now().toString() }],
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        };
      }),
      
      removeItem: (itemId) => set((state) => {
        const newItems = state.items.filter((i) => i.id !== itemId);
        return {
          items: newItems,
          restaurantId: newItems.length > 0 ? state.restaurantId : null,
          restaurantName: newItems.length > 0 ? state.restaurantName : null,
        };
      }),
      
      updateQuantity: (itemId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.id !== itemId) };
        }
        return {
          items: state.items.map((i) => 
            i.id === itemId ? { ...i, quantity } : i
          ),
        };
      }),
      
      clearCart: () => set({
        items: [],
        restaurantId: null,
        restaurantName: null,
        scheduledTime: null,
      }),
      
      setOrderType: (type) => set({ orderType: type }),
      
      setScheduledTime: (time) => set({ scheduledTime: time }),
      
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
    }),
    {
      name: 'campus-bites-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
