'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedSizes.length > 0 || 
    selectedColors.length > 0 || 
    selectedHeights.length > 0;

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

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedHeights([]);
    
    onFilterChange({
      categories: [],
      sizes: [],
      colors: [],
      heights: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка сброса */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-panda-black">Фильтры</h2>
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetFilters}
              className="text-sm text-panda-gray-dark hover:text-panda-black 
                       underline-offset-4 hover:underline transition-colors duration-200"
            >
              Сбросить все
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Активные фильтры */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-4 border-b border-panda-gray-medium overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <motion.button
                  key={`cat-${category}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleFilterChange('categories', category)}
                  className="inline-flex items-center px-2 py-1 text-xs bg-panda-gray-light
                           text-panda-black hover:bg-panda-gray-medium transition-colors duration-200"
                >
                  {category}
                  <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              ))}
              {selectedSizes.map((size) => (
                <motion.button
                  key={`size-${size}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleFilterChange('sizes', size)}
                  className="inline-flex items-center px-2 py-1 text-xs bg-panda-gray-light
                           text-panda-black hover:bg-panda-gray-medium transition-colors duration-200"
                >
                  Размер {size}
                  <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              ))}
              {selectedColors.map((colorCode) => {
                const colorName = colors.find(c => c.code === colorCode)?.name;
                return (
                  <motion.button
                    key={`color-${colorCode}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleFilterChange('colors', colorCode)}
                    className="inline-flex items-center px-2 py-1 text-xs bg-panda-gray-light
                             text-panda-black hover:bg-panda-gray-medium transition-colors duration-200"
                  >
                    {colorName}
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                );
              })}
              {selectedHeights.map((height) => (
                <motion.button
                  key={`height-${height}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleFilterChange('heights', height)}
                  className="inline-flex items-center px-2 py-1 text-xs bg-panda-gray-light
                           text-panda-black hover:bg-panda-gray-medium transition-colors duration-200"
                >
                  Рост {height}
                  <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Категории */}
      <div>
        <h3 className="text-sm font-medium text-panda-black mb-3 uppercase tracking-wider">
          Категории
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <motion.label
              key={category}
              className="flex items-center cursor-pointer group text-sm"
              whileHover={{ x: 2 }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleFilterChange('categories', category)}
                className="w-4 h-4 border-panda-gray-medium text-panda-black 
                          focus:ring-panda-black focus:ring-offset-0"
              />
              <span className="ml-2 text-panda-gray-dark group-hover:text-panda-black 
                             transition-colors duration-200">
                {category}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Размеры */}
      <div>
        <h3 className="text-sm font-medium text-panda-black mb-3 uppercase tracking-wider">
          Размеры
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleFilterChange('sizes', size)}
              className={`px-3 py-1 text-sm border transition-all duration-200
                ${selectedSizes.includes(size)
                  ? 'border-panda-black bg-panda-black text-black'
                  : 'border-panda-gray-medium text-panda-gray-dark hover:border-panda-black hover:text-panda-black'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Цвета */}
      <div>
        <h3 className="text-sm font-medium text-panda-black mb-3 uppercase tracking-wider">
          Цвета
        </h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.code}
              onClick={() => handleFilterChange('colors', color.code)}
              className="group relative"
              title={color.name}
            >
              <div
                className={`w-6 h-6 rounded-full transition-transform duration-200
                  ${selectedColors.includes(color.code)
                    ? 'ring-1 ring-panda-black ring-offset-1'
                    : 'hover:scale-110'
                  }`}
                style={{ backgroundColor: color.code }}
              />
              <span className="sr-only">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Рост */}
      {showHeightFilter && (
        <div>
          <h3 className="text-sm font-medium text-panda-black mb-3 uppercase tracking-wider">
            Рост
          </h3>
          <div className="flex gap-2">
            {HEIGHTS.map((height) => (
              <button
                key={height}
                onClick={() => handleFilterChange('heights', height)}
                className={`px-3 py-1 text-sm border transition-all duration-200
                  ${selectedHeights.includes(height)
                    ? 'border-panda-black bg-panda-black text-white'
                    : 'border-panda-gray-medium text-panda-gray-dark hover:border-panda-black hover:text-panda-black'
                  }`}
              >
                {height}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}