'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../../ProductForm';
import type { ProductWithId } from '@/types/product';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Ошибка при загрузке товара');
      router.push('/admin');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
        sizes: formData.getAll('sizes'),
        colors: JSON.parse(formData.get('colors') as string || '[]'),
        images: formData.getAll('images').map(img => String(img)),
      };

      const response = await fetch(`/api/products?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Ошибка при обновлении товара');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="container mx-auto px-4 py-8 pt-24">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
        <ProductForm 
          initialData={product} 
          onSubmit={handleSubmit} 
          loading={loading}
        />
      </div>
    </div>
  );
}