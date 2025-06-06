'use client';

import { useState, useEffect } from 'react';
import FilterWrapper from '@/components/catalog/FilterWrapper';
import SaleProductsList from './SaleProductsList';

interface Color {
  name: string;
  code: string;
}

// Пропсы для клиентского компонента
interface ClientFilterWrapperProps {
  categories: string[];
  sizes: string[];
  colors: Color[];
}

// Общий компонент для индикации загрузки
const LoadingSpinner = () => (
  <div className="text-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    <p className="mt-4 text-gray-600">Загрузка данных...</p>
  </div>
);

export default function ClientFilterWrapper({ 
  categories: initialCategories,
  sizes: initialSizes, 
  colors: initialColors 
}: ClientFilterWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Состояния для фильтров
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    heights: [] as string[],
  });

  // Форматируем цвета один раз при монтировании компонента
  const formattedColors = initialColors.map(color => ({
    name: color.name,
    code: color.code
  }));

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Обработчик ошибок
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Произошла ошибка: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // Показываем загрузку
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-panda-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковая панель с фильтрами */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="border-0 border-panda-black p-6 sticky top-24">
              <FilterWrapper
                categories={initialCategories}
                sizes={initialSizes}
                colors={formattedColors}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Основной контент */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-panda-black">
                Товары со скидкой
              </h2>
            </div>

            <SaleProductsList 
              initialFilters={filters} 
              availableColors={formattedColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}