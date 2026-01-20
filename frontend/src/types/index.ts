/**
 * TypeScript Types for the App
 */

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  distance: string;
  tags: string[];
  promo?: string;
  isFavorite?: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isVeg: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  required: boolean;
  maxSelections: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: 'delivery' | 'dine-in' | 'takeaway';
  deliveryAddress?: {
    hostelBlock: string;
    roomNumber: string;
  };
  tableNumber?: string;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  createdAt: string;
  estimatedTime?: string;
  trackingUpdates?: TrackingUpdate[];
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingUpdate {
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}
