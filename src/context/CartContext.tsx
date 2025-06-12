'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import type { Cart, CartItem, CartContextType } from '@/types/cart';
import type { Color } from '@/types/product';
import { toast } from 'react-hot-toast';

const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: true,
  error: null,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        setCart(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Ошибка при загрузке корзины');
        toast.error('Ошибка при загрузке корзины');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const addItem = async (item: CartItem) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const stockResponse = await fetch(`/api/products/${item.productId}`);
      if (!stockResponse.ok) {
        throw new Error('Не удалось проверить наличие товара');
      }
      const productData = await stockResponse.json();
      const stockQuantity = productData.product.stockQuantity;

      if (item.quantity > stockQuantity) {
        toast.error(`Доступно только ${stockQuantity} шт.`);
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при добавлении товара');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
      toast.success('Товар добавлен в корзину');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ошибка при добавлении товара в корзину');
      }
    }
  };

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
      const stockResponse = await fetch(`/api/products/${productId}`);
      if (!stockResponse.ok) {
        throw new Error('Не удалось проверить наличие товара');
      }
      const productData = await stockResponse.json();
      const stockQuantity = productData.product.stockQuantity;

      if (newQuantity > stockQuantity) {
        const updatedCart = {
          ...cart,
          items: cart.items.map(item => {
            if (
              item.productId === productId &&
              item.size === size &&
              item.color.code === color.code
            ) {
              return { ...item, quantity: stockQuantity };
            }
            return item;
          })
        };
        setCart(updatedCart);

        await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            size,
            color,
            quantity: stockQuantity
          }),
        });

        toast.error(`Доступно только ${stockQuantity} шт.`);
        return;
      }

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
      setCart(updatedCart);

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size, color, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении количества');
      }

      const serverCart = await response.json();
      setCart(serverCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const originalCart = await response.json();
          setCart(originalCart);
        }
      } catch (restoreError) {
        console.error('Error restoring cart state:', restoreError);
      }

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ошибка при обновлении количества');
      }
    }
  };

  const removeItem = async (productId: string, size: string, color: Color) => {
    if (!isAuthenticated || !cart) {
      router.push('/login');
      return;
    }

    try {
      const updatedCart = {
        ...cart,
        items: cart.items.filter(item => 
          !(item.productId === productId &&
            item.size === size &&
            item.color.code === color.code)
        )
      };
      setCart(updatedCart);

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size, color }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }

      const serverCart = await response.json();
      setCart(serverCart);
      toast.success('Товар удален из корзины');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const originalCart = await response.json();
          setCart(originalCart);
        }
      } catch (restoreError) {
        console.error('Error restoring cart state:', restoreError);
      }

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ошибка при удалении товара из корзины');
      }
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !cart) {
      return;
    }

    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Ошибка при очистке корзины');
      }

      setCart(null);
      toast.success('Корзина очищена');
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ошибка при очистке корзины');
      }
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};