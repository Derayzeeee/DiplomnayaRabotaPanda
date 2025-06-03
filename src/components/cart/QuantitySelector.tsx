'use client';

import { useCart } from '@/context/CartContext';
import type { Color } from '@/types/product';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface QuantitySelectorProps {
  productId: string;
  size: string;
  color: Color;
  quantity: number;
}

export default function QuantitySelector({
  productId,
  size,
  color,
  quantity: initialQuantity
}: QuantitySelectorProps) {
  const { updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);

  // Получаем актуальное количество товара при монтировании компонента
  useEffect(() => {
    const checkStock = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product stock');
        }
        const data = await response.json();
        setStockQuantity(data.product.stockQuantity);

        // Если текущее количество больше доступного, корректируем его
        if (initialQuantity > data.product.stockQuantity) {
          handleQuantityChange(data.product.stockQuantity);
        }
      } catch (error) {
        console.error('Error checking stock:', error);
        toast.error('Ошибка при проверке наличия товара');
      }
    };

    checkStock();
  }, [productId, initialQuantity]);

  // Обновляем локальное состояние при изменении пропсов
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (isLoading || stockQuantity === null) return;

    if (newQuantity < 1) {
      toast.error('Количество не может быть меньше 1');
      return;
    }

    if (newQuantity > stockQuantity) {
      toast.error(`Доступно только ${stockQuantity} шт.`);
      // Устанавливаем максимально доступное количество
      newQuantity = stockQuantity;
    }

    setIsLoading(true);
    try {
      await updateQuantity(productId, size, color, newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      // Ошибка уже обработана в CartContext
    } finally {
      setIsLoading(false);
    }
  };

  if (stockQuantity === null) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Контейнер с фиксированной высотой для кнопок */}
      <div className="h-[38px] flex items-center border rounded-md">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className={`h-full px-3 transition-colors ${
            quantity <= 1 || isLoading 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'hover:bg-gray-100'
          }`}
          disabled={quantity <= 1 || isLoading}
          aria-label="Уменьшить количество"
        >
          -
        </button>
        <div className="h-full flex items-center justify-center px-3 min-w-[40px]">
          {isLoading ? (
            <div className="animate-pulse">...</div>
          ) : (
            quantity
          )}
        </div>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className={`h-full px-3 transition-colors ${
            quantity >= stockQuantity || isLoading 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'hover:bg-gray-100'
          }`}
          disabled={quantity >= stockQuantity || isLoading}
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>
      {(stockQuantity === 0 || quantity >= stockQuantity) && (
        <div className="absolute left-0 top-[calc(100%+4px)] whitespace-nowrap">
          <p className={`text-sm ${stockQuantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
            {stockQuantity === 0 
              ? 'Товар закончился'
              : 'Достигнут лимит доступного количества'
            }
          </p>
        </div>
      )}
    </div>
  );
}