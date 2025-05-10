'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, CartState } from '@/types/cart';
import type { Color } from '@/types/product';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string; color: Color } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; color: Color; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: Color) => void;
  updateQuantity: (productId: string, size: string, color: Color, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => 
          item.productId === action.payload.productId && 
          item.size === action.payload.size &&
          item.color.code === action.payload.color.code
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: calculateTotal([...state.items, action.payload]),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        item => 
          !(item.productId === action.payload.productId && 
            item.size === action.payload.size &&
            item.color.code === action.payload.color.code)
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => {
        if (
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color.code === action.payload.color.code
        ) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
      };

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'CLEAR_CART' });
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (productId: string, size: string, color: Color) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, color } });
  };

  const updateQuantity = (productId: string, size: string, color: Color, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, color, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}