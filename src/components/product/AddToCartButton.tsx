'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { ProductWithId } from '@/types/product';

interface AddToCartButtonProps {
  product: ProductWithId;
  selectedSize?: string;
  selectedColor?: { name: string; code: string };
  quantity?: number;
}

export default function AddToCartButton({
  product,
  selectedSize,
  selectedColor,
  quantity = 1
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Пожалуйста, выберите размер и цвет');
      return;
    }

    setIsLoading(true);
    try {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
      // Можно добавить уведомление об успешном добавлении
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Произошла ошибка при добавлении товара в корзину');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || !product.inStock}
      className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
        product.inStock
          ? 'bg-black hover:bg-gray-800'
          : 'bg-gray-400 cursor-not-allowed'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        'Добавление...'
      ) : product.inStock ? (
        'Добавить в корзину'
      ) : (
        'Нет в наличии'
      )}
    </button>
  );
}