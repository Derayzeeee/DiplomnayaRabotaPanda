'use client';

import { useState } from 'react';
import { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    // Здесь будет логика добавления в корзину
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Товар добавлен в корзину');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2 border border-gray-300 rounded-md"
        >
          -
        </button>
        <span className="text-lg font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="p-2 border border-gray-300 rounded-md"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`
          w-full py-4 px-8 text-lg font-medium rounded-md
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-900'
          }
        `}
      >
        {isLoading ? 'Добавление...' : 'Добавить в корзину'}
      </button>
    </div>
  );
}