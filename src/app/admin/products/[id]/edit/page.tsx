'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../../ProductForm';
import type { ProductWithId } from '@/types/product';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        if (!id) {
          console.error('No product ID provided');
          return;
        }

        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [params]);

  const handleSubmit = async (productData: any) => {
    try {
      setLoading(true);
      const resolvedParams = await params;
      const id = resolvedParams.id;

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Дожидаемся ответа от сервера
      await response.json();

      // Изменяем порядок: сначала обновляем данные, потом делаем навигацию
      router.refresh();
      // Используем абсолютный путь и await для навигации
      await router.push('/catalog');
      
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}