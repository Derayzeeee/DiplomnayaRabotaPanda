'use client';

import { useState, useEffect } from 'react';
import FilterWrapper from '@/components/catalog/FilterWrapper';
import SaleProductsList from './SaleProductsList';

interface Color {
  name: string;
  code: string;
}

interface Product {
  _id: string;
  category: string;
  sizes: string[];
  color: Color;
  isSale: boolean;
  price: number;
  oldPrice?: number;
  name: string;
}

export default function ClientFilterWrapper() {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    heights: [] as string[],
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/products?isSale=true');
        if (!response.ok) {
          throw new Error('Failed to fetch sale products');
        }
        
        const products = await response.json() as Product[];

        const uniqueCategories = Array.from(
          new Set(products.map((product: Product) => product.category))
        ).filter(Boolean) as string[];
        setCategories(uniqueCategories);

        const uniqueSizes = Array.from(
          new Set(products.flatMap((product: Product) => product.sizes))
        ).filter(Boolean) as string[];
        setSizes(uniqueSizes);

        const uniqueColors = Array.from(
          new Map(
            products
              .filter((product: Product) => product.color && product.color.code)
              .map((product: Product) => [
                product.color.code,
                {
                  name: product.color.name,
                  code: product.color.code
                }
              ])
          ).values()
        ) as Color[];
        setColors(uniqueColors);

      } catch (err) {
        console.error('Error fetching sale data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch sale data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const formattedColors = colors.map(color => ({
    name: color.name,
    code: color.code
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0">
        <div className="border-0 border-panda-black p-6 sticky top-24">
          <FilterWrapper
            categories={categories}
            sizes={sizes}
            colors={formattedColors}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-6">
        </div>
        <SaleProductsList 
          initialFilters={filters} 
          availableColors={formattedColors}
        />
      </div>
    </div>
  );
}