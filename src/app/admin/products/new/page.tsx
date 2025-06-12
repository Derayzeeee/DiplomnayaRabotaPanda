'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../ProductForm';
import type { Product } from '@/types/product';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (productData: Product) => {

    if (loading) return;

    try {
      setLoading(true);
      
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

      await response.json();

      router.refresh();
      router.push('/catalog');
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Создать новый товар</h1>
      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}