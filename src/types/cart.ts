import type { Color } from './product';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  size: string;
  color: Color; // теперь только один цвет
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: Date;
}

export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string, size: string, color: Color) => Promise<void>;
  updateQuantity: (productId: string, size: string, color: Color, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}