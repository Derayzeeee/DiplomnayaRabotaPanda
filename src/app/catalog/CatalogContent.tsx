'use client';

import { useState } from 'react';
import FilterWrapper from '@/components/catalog/FilterWrapper';
import ProductList from './ProductList';
import type { ProductWithId, Color } from '@/types/product';

interface CatalogContentProps {
  products?: ProductWithId[];
  categories: string[];
  sizes: string[];
}

export default function CatalogContent({ products = [], categories, sizes }: CatalogContentProps) {
  const uniqueColors: Color[] = Array.from(
    new Map(
      products
        .filter(product => product.color && product.color.code)
        .map(product => [product.color.code, product.color])
    ).values()
  );

  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    heights: [] as string[],
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <FilterWrapper
          categories={categories}
          sizes={sizes}
          onFiltersChange={handleFiltersChange}
        />
      </aside>
      <div className="flex-1">
        <ProductList initialFilters={filters} />
      </div>
    </div>
  );
}