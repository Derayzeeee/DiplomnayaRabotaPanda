'use client';

import { useState } from 'react';
import FilterWrapper from '@/components/catalog/FilterWrapper';
import NewProductsList from './NewProductsList';
import { Color } from '@/types/product';

interface ClientFilterWrapperProps {
  categories: string[];
  sizes: string[];
  colors: Color[];
}

export default function ClientFilterWrapper({ categories, sizes, colors }: ClientFilterWrapperProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    heights: [] as string[],
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const formattedColors = colors.map(color => ({
    name: color.name,
    code: color.code
  }));

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
        <NewProductsList 
          initialFilters={filters}
          availableColors={formattedColors}
        />
      </div>
    </div>
  );
}