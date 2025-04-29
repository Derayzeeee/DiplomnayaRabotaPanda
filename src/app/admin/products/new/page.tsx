'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../ProductForm';
import type { ProductWithId } from '@/types/product';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      // Преобразуем FormData в объект
      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
        sizes: formData.getAll('sizes'),
        colors: JSON.parse(formData.get('colors') as string || '[]'),
        images: formData.getAll('images').map(img => String(img)),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Добавить новый товар</h1>
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}