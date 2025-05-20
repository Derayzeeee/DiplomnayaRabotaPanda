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

interface ApiResponse {
  product: ProductWithId;
  relatedProducts: ProductWithId[];
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        if (!id) {
          throw new Error('No product ID provided');
        }

        console.log('[Debug] Fetching product with ID:', id);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const data: ApiResponse = await response.json();
        console.log('[Debug] Received product data:', data);
        
        if (!data.product) {
          throw new Error('No product data received');
        }

        // Убедимся, что структура цвета корректна
        const productWithFormattedColor = {
          ...data.product,
          color: {
            name: data.product.color?.name || '',
            code: data.product.color?.code || '#000000'
          }
        };

        setProduct(productWithFormattedColor);
      } catch (error) {
        console.error('[Debug] Error in fetchProduct:', error);
        setError(error instanceof Error ? error.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const handleSubmit = async (productData: ProductWithId) => {
    try {
      setLoading(true);
      const resolvedParams = await params;
      const id = resolvedParams.id;

      // Подготавливаем данные для обновления
      const updateData = {
        ...productData,
        // Убедимся, что цвет обновляется корректно
        color: {
          name: productData.color.name,
          code: productData.color.code
        },
        stockQuantity: Number(productData.stockQuantity),
        lowStockThreshold: Number(productData.lowStockThreshold)
      };

      console.log('[Debug] Submitting product data:', updateData);

      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      console.log('[Debug] Updated product:', updatedProduct);
      
      router.refresh();
      router.push('/catalog');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Ошибка! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Товар не найден! </strong>
          <span className="block sm:inline">Продукт с указанным ID не существует.</span>
        </div>
      </div>
    );
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