'use client';

import { useState } from 'react';
import Filters from '@/components/catalog/Filters';
import SaleProductsList from './SaleProductsList';

interface FilterWrapperProps {
  categories: string[];
  sizes: string[];
  colors: Array<{
    name: string;
    code: string;
  }>;
}

interface Filters {
  categories: string[];
  sizes: string[];
  colors: string[];
}

export default function FilterWrapper({ categories, sizes, colors }: FilterWrapperProps) {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sizes: [],
    colors: []
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <Filters
          categories={categories}
          sizes={sizes}
          colors={colors}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </aside>

      <div className="flex-1">
        <SaleProductsList initialFilters={filters} />
      </div>
    </div>
  );
}