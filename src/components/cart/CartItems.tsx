'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import QuantitySelector from './QuantitySelector';

export default function CartItems() {
  const { cart, removeItem } = useCart();

  if (!cart) return null;

  const handleRemoveItem = (productId: string, size: string, color: { name: string; code: string }) => {
    if (confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
      removeItem(productId, size, color);
    }
  };

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div
          key={`${item.productId}-${item.size}-${item.color.code}`}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"
        >
          <div className="relative w-24 h-24">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-md"
            />
          </div>

          <div className="flex-grow">
            <Link
              href={`/product/${item.productId}`}
              className="text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              {item.name}
            </Link>
            <div className="mt-1 text-sm text-gray-500">
              Размер: {item.size} • Цвет: {item.color.name}
            </div>
            <div className="mt-2 flex items-center gap-4">
              <QuantitySelector
                productId={item.productId}
                size={item.size}
                color={item.color}
                quantity={item.quantity}
              />
              <button
                onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                className="text-red-600 hover:text-red-700"
                aria-label="Удалить товар"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-medium text-gray-900">
              {item.price.toLocaleString('ru-RU')} ₽
            </div>
            {item.oldPrice && (
              <div className="text-sm text-gray-500 line-through">
                {item.oldPrice.toLocaleString('ru-RU')} ₽
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}