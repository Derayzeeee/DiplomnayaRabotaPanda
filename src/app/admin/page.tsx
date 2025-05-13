'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductWithId } from '@/types/product';

export default function AdminPanel() {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products?isAdmin=true');
    const data = await response.json();
    setProducts(data);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const response = await fetch(`/api/products?id=${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Обновляем список товаров после удаления
          setProducts(products.filter(product => product._id !== productId));
        } else {
          const error = await response.json();
          alert(`Ошибка при удалении товара: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Произошла ошибка при удалении товара');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <button
          onClick={() => router.push('/admin/products/new')}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Добавить товар
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Изображение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.price} BYN
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}