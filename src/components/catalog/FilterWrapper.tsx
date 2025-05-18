'use client';

import { useState, useCallback } from 'react';
import Filters from './Filters';
import { Color } from '@/types/product';

interface FilterWrapperProps {
  categories: string[];
  sizes: string[];
  colors: Color[]; // Добавляем colors в пропсы
  onFiltersChange?: (filters: {
    categories: string[];
    sizes: string[];
    colors: string[];
    heights: string[];
  }) => void;
}

export default function FilterWrapper({ 
  categories, 
  sizes,
  colors, // Принимаем colors из пропсов
  onFiltersChange 
}: FilterWrapperProps) {
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    heights: [] as string[],
  });

  const handleFilterChange = useCallback((filters: typeof activeFilters) => {
    setActiveFilters(filters);
    onFiltersChange?.(filters);
  }, [onFiltersChange]);

  return (
    <div>
      <Filters
        categories={categories}
        sizes={sizes}
        colors={colors} // Передаем цвета дальше в компонент Filters
        onFilterChange={handleFilterChange}
        initialFilters={activeFilters}
      />
    </div>
  );
}