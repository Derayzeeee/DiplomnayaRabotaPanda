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

  // Изменяем только стили, сохраняя всю логику
return (
  <div className="space-y-6"> {/* Увеличили отступ между items */}
    {cart.items.map((item) => (
      <div
        key={`${item.productId}-${item.size}-${item.color.code}`}
        className="flex items-center gap-6 p-6 bg-white shadow" // Заменили shadow на border, убрали rounded
      >
        <div className="relative w-24 h-32"> {/* Немного увеличили высоту изображения */}
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover" // Убрали rounded
          />
        </div>

        <div className="flex-grow">
          <Link
            href={`/product/${item.productId}`}
            className="text-lg font-medium text-black hover:text-gray-600 transition-colors" // Изменили цвета
          >
            {item.name}
          </Link>
          <div className="mt-2 text-sm text-gray-600"> {/* Увеличили отступ, изменили цвет */}
            Размер: {item.size} • Цвет: {item.color.name}
          </div>
          <div className="mt-4 flex items-center gap-6"> {/* Увеличили отступы */}
            <QuantitySelector
              productId={item.productId}
              size={item.size}
              color={item.color}
              quantity={item.quantity}
            />
            <button
              onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
              className="text-black hover:text-gray-600 transition-colors" // Изменили цвета
              aria-label="Удалить товар"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-medium text-black"> {/* Увеличили размер, изменили цвет */}
            {item.price.toLocaleString('ru-RU')} BYN
          </div>
          {item.oldPrice && (
            <div className="text-sm text-gray-500 line-through mt-1">
              {item.oldPrice.toLocaleString('ru-RU')} BYN
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
}