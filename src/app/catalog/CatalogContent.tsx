'use client';

import { useState } from 'react';
import FilterWrapper from '@/components/catalog/FilterWrapper';
import ProductList from './ProductList';

interface Color {
  name: string;
  code: string;
}

interface CatalogContentProps {
  categories: string[];
  sizes: string[];
  colors: Color[];
}

export default function CatalogContent({ categories, sizes, colors }: CatalogContentProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
  });

  const handleFiltersChange = (newFilters: {
    categories: string[];
    sizes: string[];
    colors: string[];
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <FilterWrapper
          categories={categories}
          sizes={sizes}
          colors={colors}
          onFiltersChange={handleFiltersChange}
        />
      </aside>

      <div className="flex-1">
        <ProductList initialFilters={filters} />
      </div>
    </div>
  );
}