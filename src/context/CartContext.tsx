'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Cart, CartItem } from '@/types/cart';
import type { Color } from '@/types/product';


export const CartContext = createContext<{
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string, size: string, color: Color) => Promise<void>;
  updateQuantity: (productId: string, size: string, color: Color, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>; // Добавляем новую функцию
}>({
  cart: null,
  isLoading: false,
  error: null,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {}, // Добавляем новую функцию
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Функция для получения корзины с сервера
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.status === 401) {
        setCart(null);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  }, [router, isAuthenticated]);

  // Загружаем корзину при изменении статуса аутентификации
  useEffect(() => {
    setCart(null); // Очищаем текущую корзину перед загрузкой новой
    fetchCart();
  }, [fetchCart, isAuthenticated]);

  // Функция для добавления товара в корзину
  const addItem = async (item: CartItem) => {
  // Проверяем авторизацию перед любыми действиями с корзиной
  if (!isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (response.status === 401) {
      router.push('/login');
      return;
    }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
     } catch (err) {
    console.error('Error adding item to cart:', err);
    setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    throw err;
  } finally {
    setIsLoading(false);
  }
};

  // Функция для обновления количества товара
  const updateQuantity = async (
    productId: string,
    size: string,
    color: Color,
    newQuantity: number
  ) => {
    if (!isAuthenticated || !cart) {
      router.push('/login');
      return;
    }

    try {
      // Создаем копию текущей корзины
      const updatedCart = {
        ...cart,
        items: cart.items.map(item => {
          if (
            item.productId === productId &&
            item.size === size &&
            item.color.code === color.code
          ) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      };

      // Оптимистично обновляем UI
      setCart(updatedCart);

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size, color, quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quantity');
      }

      const serverCart = await response.json();
      setCart(serverCart);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      // В случае ошибки перезагружаем корзину
      fetchCart();
    }
  };

  // Функция для удаления товара из корзины
  const removeItem = async (productId: string, size: string, color: Color) => {
    if (!isAuthenticated || !cart) {
      router.push('/login');
      return;
    }

    try {
      // Создаем копию текущей корзины без удаляемого товара
      const updatedCart = {
        ...cart,
        items: cart.items.filter(item => 
          !(item.productId === productId &&
            item.size === size &&
            item.color.code === color.code)
        )
      };

      // Оптимистично обновляем UI
      setCart(updatedCart);

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size, color }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item');
      }

      const serverCart = await response.json();
      setCart(serverCart);
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      // В случае ошибки перезагружаем корзину
      fetchCart();
    }
  };

  // Функция для очистки корзины
   const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/cart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      // Очищаем состояние корзины
      setCart(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart, // Добавляем функцию в провайдер
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Хук для использования контекста корзины
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}