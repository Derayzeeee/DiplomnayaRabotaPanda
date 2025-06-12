'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import type { Color } from '@/types/product';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  selectedSize: string;
  selectedColor: Color;
  stockQuantity: number;
  isSale: boolean;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  oldPrice,
  image,
  selectedSize,
  selectedColor,
  stockQuantity,
  isSale
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();


  const isAvailable = stockQuantity > 0;


  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        Нет в наличии
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="w-full py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
      >
        Войдите в аккаунт чтобы добавить товар в корзину
      </button>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Пожалуйста, выберите размер и цвет');
      return;
    }

    if (!isAvailable) {
      alert('К сожалению, товар закончился');
      return;
    }

    try {
      setIsLoading(true);
      await addItem({
        productId,
        name,
        price,
        oldPrice: isSale ? oldPrice : undefined,
        image,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      });
      alert('Товар успешно добавлен в корзину!');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Не удалось добавить товар в корзину');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full py-3 rounded-lg bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
    >
      {isLoading ? 'Добавление...' : 'Добавить в корзину'}
    </button>
  );
}