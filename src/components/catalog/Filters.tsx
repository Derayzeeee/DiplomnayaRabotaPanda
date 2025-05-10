'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CATEGORIES, 
  SIZES, 
  HEIGHTS,
  CATEGORIES_WITH_HEIGHT 
} from '@/constants/filters';

interface Color {
  name: string;
  code: string;
}

interface FiltersProps {
  categories: string[];
  sizes: string[];
  colors: Array<{
    name: string;
    code: string;
  }>;
  onFilterChange: (filters: {
    categories: string[];
    sizes: string[];
    colors: string[];
    heights: string[];
  }) => void;
  initialFilters?: {
    categories: string[];
    sizes: string[];
    colors: string[];
    heights: string[];
  };
}

export default function Filters({
  categories,
  sizes,
  colors,
  onFilterChange,
  initialFilters,
}: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters?.sizes || []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialFilters?.colors || []
  );
  const [selectedHeights, setSelectedHeights] = useState<string[]>(
    initialFilters?.heights || []
  );

  const showHeightFilter = selectedCategories.some(category => 
    CATEGORIES_WITH_HEIGHT.includes(category)
  );

  const handleFilterChange = (
    type: 'categories' | 'sizes' | 'colors' | 'heights',
    value: string
  ) => {
    let newSelection: string[] = [];

    switch (type) {
      case 'categories':
        newSelection = selectedCategories.includes(value)
          ? selectedCategories.filter((c) => c !== value)
          : [...selectedCategories, value];
        setSelectedCategories(newSelection);
        break;
      case 'sizes':
        newSelection = selectedSizes.includes(value)
          ? selectedSizes.filter((s) => s !== value)
          : [...selectedSizes, value];
        setSelectedSizes(newSelection);
        break;
      case 'colors':
        newSelection = selectedColors.includes(value)
          ? selectedColors.filter((c) => c !== value)
          : [...selectedColors, value];
        setSelectedColors(newSelection);
        break;
      case 'heights':
        newSelection = selectedHeights.includes(value)
          ? selectedHeights.filter((h) => h !== value)
          : [...selectedHeights, value];
        setSelectedHeights(newSelection);
        break;
    }

    onFilterChange({
      categories: type === 'categories' ? newSelection : selectedCategories,
      sizes: type === 'sizes' ? newSelection : selectedSizes,
      colors: type === 'colors' ? newSelection : selectedColors,
      heights: type === 'heights' ? newSelection : selectedHeights,
    });
  };

  const isAnyFilterActive = selectedCategories.length > 0 || 
                          selectedSizes.length > 0 || 
                          selectedColors.length > 0 ||
                          selectedHeights.length > 0;

  return (
    <div className="space-y-8">
      {/* Категории */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Категории</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <motion.label
              key={category}
              className="flex items-center cursor-pointer group"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleFilterChange('categories', category)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {category}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Размеры */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Размеры</h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <motion.button
              key={size}
              onClick={() => handleFilterChange('sizes', size)}
              className={`
                py-2 px-3 text-sm font-medium rounded-md transition-all duration-200
                ${selectedSizes.includes(size)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300 hover:border-indigo-500 hover:text-indigo-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Рост */}
      {showHeightFilter && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Рост</h3>
          <div className="grid grid-cols-3 gap-2">
            {HEIGHTS.map((height) => (
              <motion.button
                key={height}
                onClick={() => handleFilterChange('heights', height)}
                className={`
                  py-2 px-3 text-sm font-medium rounded-md transition-all duration-200
                  ${selectedHeights.includes(height)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-300 hover:border-indigo-500 hover:text-indigo-600'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {height}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Цвета */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Цвета</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.code}
              onClick={() => handleFilterChange('colors', color.code)}
              className={`
                w-8 h-8 rounded-full relative
                border border-gray-200
                ${selectedColors.includes(color.code)
                  ? 'ring-2 ring-offset-2 ring-indigo-600'
                  : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 transition-all duration-200'
                }
                ${color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white'
                  ? 'ring-1 ring-gray-200'
                  : ''
                }
              `}
              style={{
                backgroundColor: color.code,
                boxShadow: color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white'
                  ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
                  : 'none'
              }}
              title={color.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {selectedColors.includes(color.code) && (
                <span className={`
                  absolute inset-0 flex items-center justify-center
                  ${color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white'
                    ? 'text-gray-800'
                    : 'text-white'
                  }
                `}>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Кнопка сброса фильтров */}
      {isAnyFilterActive && (
        <motion.button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedSizes([]);
            setSelectedColors([]);
            setSelectedHeights([]);
            onFilterChange({
              categories: [],
              sizes: [],
              colors: [],
              heights: []
            });
          }}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Сбросить все фильтры
        </motion.button>
      )}
    </div>
  );
}