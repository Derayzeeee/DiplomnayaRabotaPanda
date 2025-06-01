'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductWithId } from '@/types/product';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

// Компонент для отображения статуса
const StatusBadge = ({ 
  type, 
  text 
}: { 
  type: 'success' | 'error' | 'warning', 
  text: string 
}) => {
  const styles = {
    base: "text-xs px-2.5 py-1 rounded-full font-medium",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800"
  };

  return (
    <span className={`${styles.base} ${styles[type]}`}>
      {text}
    </span>
  );
};

export default function AdminPanel() {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const [productToDelete, setProductToDelete] = useState<ProductWithId | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products?isAdmin=true');
    const data = await response.json();
    setProducts(data);
  };

  const handleDeleteProduct = async (product: ProductWithId) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products?id=${productToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productToDelete._id));
      } else {
        const error = await response.json();
        alert(`Ошибка при удалении товара: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Произошла ошибка при удалении товара');
    } finally {
      setProductToDelete(null);
    }
  };

  const getStockStatus = (product: ProductWithId) => {
    if (!product.inStock) {
      return { type: 'error' as const, text: 'Нет в наличии' };
    }

    if (product.stockQuantity === 0) {
      return { type: 'error' as const, text: 'Закончился' };
    }

    if (product.stockQuantity <= product.lowStockThreshold) {
      return { 
        type: 'warning' as const, 
        text: 'Заканчивается'
      };
    }

    return { 
      type: 'success' as const, 
      text: 'В наличии'
    };
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
                На складе
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
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
                  {product.isSale && product.oldPrice && product.oldPrice > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.oldPrice} BYN
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.stockQuantity} шт.
                  </div>
                  <div className="text-xs text-gray-500">
                    Порог: {product.lowStockThreshold} шт.
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    const status = getStockStatus(product);
                    return (
                      <StatusBadge 
                        type={status.type} 
                        text={status.text}
                      />
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
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

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Удаление товара"
        message={`Вы точно хотите удалить товар "${productToDelete?.name}" из каталога? Это действие необратимо и не может быть отменено!`}
        type="danger"
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
      />
    </div>
  );
}