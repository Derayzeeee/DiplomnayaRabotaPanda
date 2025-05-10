import type { Color } from './product';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  size: string;
  color: Color;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}