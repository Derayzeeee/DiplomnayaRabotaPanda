'use client';

import { useState, useCallback } from 'react';
import { ProductWithId, Color } from '@/types/product';

interface Filters {
  categories: string[];
  sizes: string[];
  colors: string[];
  heights: string[];
}

interface UseProductFiltersProps {
  products: ProductWithId[];
  colors?: Color[];
}

export function useProductFilters({colors = [] }: UseProductFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    sizes: [],
    colors: [],
    heights: []
  });

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setActiveFilters(prev => ({
      ...prev,
      ...newFilters,
      categories: newFilters.categories || prev.categories,
      sizes: newFilters.sizes || prev.sizes,
      colors: newFilters.colors || prev.colors,
      heights: newFilters.heights || prev.heights
    }));
  }, []);

  const filterProducts = useCallback((products: ProductWithId[]) => {
    return products.filter(product => {
      if (activeFilters.categories.length > 0 && 
          !activeFilters.categories.includes(product.category)) {
        return false;
      }

      if (activeFilters.sizes.length > 0 && 
          !product.sizes.some(size => activeFilters.sizes.includes(size))) {
        return false;
      }

      if (activeFilters.colors.length > 0) {
        const selectedColors = activeFilters.colors;
        const productColorName = product.color.name.toLowerCase();
        
        const isColorMatched = colors.some(availableColor => 
          availableColor.name.toLowerCase() === productColorName && 
          selectedColors.includes(availableColor.code)
        );

        if (!isColorMatched) {
          return false;
        }
      }

      if (activeFilters.heights.length > 0 && 
          product.heights && 
          Array.isArray(product.heights) && 
          !product.heights.some(height => activeFilters.heights.includes(height))) {
        return false;
      }

      return true;
    });
  }, [activeFilters, colors]);

  return { filterProducts, updateFilters };
}