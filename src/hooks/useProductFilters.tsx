'use client';

import { useState, useCallback } from 'react';
import { ProductWithId } from '@/types/product';

interface Filters {
  categories: string[];
  sizes: string[];
  colors: string[];
}

export function useProductFilters(initialProducts: ProductWithId[]) {
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    sizes: [],
    colors: [],
  });

  const filterProducts = useCallback((products: ProductWithId[]) => {
    return products.filter(product => {
      // Проверка категорий
      if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
        return false;
      }

      // Проверка размеров
      if (activeFilters.sizes.length > 0 && !product.sizes.some(size => activeFilters.sizes.includes(size))) {
        return false;
      }

      // Проверка цветов (product.color может быть undefined)
      if (
        activeFilters.colors.length > 0 &&
        !(
          product.color &&
          typeof product.color.code === "string" &&
          activeFilters.colors
            .map(c => c.toLowerCase())
            .includes(product.color.code.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });
  }, [activeFilters]);

  const updateFilters = useCallback((newFilters: Filters) => {
    setActiveFilters(newFilters);
  }, []);

  return {
    activeFilters,
    updateFilters,
    filterProducts,
  };
}