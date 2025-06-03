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

export function useProductFilters({ products, colors = [] }: UseProductFiltersProps) {
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
      // Фильтрация по категориям
      if (activeFilters.categories.length > 0 && 
          !activeFilters.categories.includes(product.category)) {
        return false;
      }

      // Фильтрация по размерам
      if (activeFilters.sizes.length > 0 && 
          !product.sizes.some(size => activeFilters.sizes.includes(size))) {
        return false;
      }

      // Фильтрация по цветам
      if (activeFilters.colors.length > 0) {
        // Находим соответствующий цвет в списке доступных цветов по имени
        const selectedColors = activeFilters.colors;
        const productColorName = product.color.name.toLowerCase();
        
        // Проверяем, есть ли цвет продукта среди выбранных цветов
        const isColorMatched = colors.some(availableColor => 
          availableColor.name.toLowerCase() === productColorName && 
          selectedColors.includes(availableColor.code)
        );

        if (!isColorMatched) {
          return false;
        }
      }

      // Фильтрация по росту
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