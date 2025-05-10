'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (
    productId: string,
    size: string,
    color: { name: string; code: string },
    newQuantity: number
  ) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  const handleRemoveItem = (
    productId: string,
    size: string,
    color: { name: string; code: string }
  ) => {
    if (confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
      removeItem(productId, size, color);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

        {state.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Ваша корзина пуста</p>
            <Link
              href="/catalog"
              className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {state.items.map((item, index) => (
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
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.productId, item.size, item.color)
                          }
                          className="text-red-600 hover:text-red-700"
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
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Сумма заказа
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-base">
                    <span>Товары ({state.items.length})</span>
                    <span>{state.total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Итого</span>
                      <span>{state.total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}