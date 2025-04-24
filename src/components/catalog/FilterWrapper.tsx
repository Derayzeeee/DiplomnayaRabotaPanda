'use client';

import { useState, useCallback } from 'react';
import Filters from './Filters';

interface Color {
  name: string;
  code: string;
}

interface FilterWrapperProps {
  categories: string[];
  sizes: string[];
  colors: Color[];
  onFiltersChange?: (filters: {
    categories: string[];
    sizes: string[];
    colors: string[];
  }) => void;
}

export default function FilterWrapper({ 
  categories, 
  sizes, 
  colors,
  onFiltersChange 
}: FilterWrapperProps) {
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
  });

  const uniqueColors = Array.from(new Map(
    colors.map(color => [color.code, color])
  ).values());

  const handleFilterChange = useCallback((filters: {
    categories: string[];
    sizes: string[];
    colors: string[];
  }) => {
    setActiveFilters(filters);
    onFiltersChange?.(filters);
  }, [onFiltersChange]);

  return (
    <Filters
      categories={categories}
      sizes={sizes}
      colors={uniqueColors}
      onFilterChange={handleFilterChange}
      initialFilters={activeFilters}
    />
  );
}