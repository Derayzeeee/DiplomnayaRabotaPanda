'use client';

import { useCart } from '@/context/CartContext';
import type { Color } from '@/types/product';

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
  quantity
}: QuantitySelectorProps) {
  const { updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  return (
    <div className="flex items-center border rounded-md">
      <button
        onClick={() => handleQuantityChange(quantity - 1)}
        className="px-3 py-1 hover:bg-gray-100"
        aria-label="Уменьшить количество"
      >
        -
      </button>
      <span className="px-3 py-1">{quantity}</span>
      <button
        onClick={() => handleQuantityChange(quantity + 1)}
        className="px-3 py-1 hover:bg-gray-100"
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
}