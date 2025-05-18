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
  stockQuantity: number; // Добавляем проверку количества
}

export default function AddToCartButton({
  productId,
  name,
  price,
  oldPrice,
  image,
  selectedSize,
  selectedColor,
  stockQuantity, // Добавляем параметр
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  // Проверяем наличие товара
  const isAvailable = stockQuantity > 0;

  // Если товара нет в наличии
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

  // Если пользователь не авторизован
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

  // Обработчик для авторизованного пользователя
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Пожалуйста, выберите размер и цвет');
      return;
    }

    // Дополнительная проверка наличия перед добавлением
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
        oldPrice,
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

  // Кнопка для авторизованного пользователя
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