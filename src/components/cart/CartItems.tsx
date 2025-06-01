'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import QuantitySelector from './QuantitySelector';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useState } from 'react';

interface ItemToDelete {
  productId: string;
  size: string;
  color: {
    name: string;
    code: string;
  };
  name: string;
}

export default function CartItems() {
  const { cart, removeItem } = useCart();
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);

  if (!cart) return null;

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.productId, itemToDelete.size, itemToDelete.color);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {cart.items.map((item) => (
        <div
          key={`${item.productId}-${item.size}-${item.color.code}`}
          className="flex items-center gap-6 p-6 bg-white shadow"
        >
          <div className="relative w-24 h-32">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-grow">
            <Link
              href={`/product/${item.productId}`}
              className="text-lg font-medium text-black hover:text-gray-600 transition-colors"
            >
              {item.name}
            </Link>
            <div className="mt-2 text-sm text-gray-600">
              Размер: {item.size} • Цвет: {item.color.name}
            </div>
            <div className="mt-4 flex items-center gap-6">
              <QuantitySelector
                productId={item.productId}
                size={item.size}
                color={item.color}
                quantity={item.quantity}
              />
              <button
                onClick={() => setItemToDelete({
                  productId: item.productId,
                  size: item.size,
                  color: item.color,
                  name: item.name
                })}
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Удалить товар"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-medium text-black">
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

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Удаление товара"
        message={`Вы хотите удалить "${itemToDelete?.name}" из корзины?`}
        type="danger"
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
      />
    </div>
  );
}