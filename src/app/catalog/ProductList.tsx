'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProductFilters } from '@/hooks/useProductFilters';
import { Product, Color, ProductWithId } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';

type SortOption = 'newest' | 'priceAsc' | 'priceDesc';

interface FiltersState {
  categories: string[];
  sizes: string[];
  colors: string[];
  heights: string[];
}

interface ProductListProps {
  initialFilters?: Partial<FiltersState>;
  onFilteredCountChange?: (count: number) => void;
  setColors?: (colors: Array<Color>) => void;
}

export default function ProductList({ 
  initialFilters,
  onFilteredCountChange,
  setColors 
}: ProductListProps) {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);

  const { filterProducts, updateFilters } = useProductFilters({
    products,
    colors: availableColors
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialFilters) {
      const completeFilters: FiltersState = {
        categories: initialFilters.categories || [],
        sizes: initialFilters.sizes || [],
        colors: initialFilters.colors || [],
        heights: initialFilters.heights || []
      };
      updateFilters(completeFilters);
    }
  }, [initialFilters, updateFilters]);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const rawData = await response.json();
      
      const productsWithStringId: ProductWithId[] = rawData.map((item: any) => ({
        ...item,
        id: item.id || item._id,
        _id: item._id.toString(),
        isFavorite: false
      }));
      
      setProducts(productsWithStringId);

      // Изменяем логику группировки цветов
      const uniqueColors: Color[] = Array.from(
        new Map(
          productsWithStringId
            .filter(product => product.color && product.color.code)
            .map(product => [
              product.color.name.toLowerCase(), // Группируем по имени в нижнем регистре
              {
                name: product.color.name,
                code: product.color.code
              }
            ])
        ).values()
      );

      // Сохраняем цвета в локальное состояние
      setAvailableColors(uniqueColors);

      // Если есть внешний обработчик setColors, передаем ему цвета
      if (setColors) {
        setColors(uniqueColors);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }

  const sortProducts = (products: ProductWithId[]) => {
    switch (sortBy) {
      case 'priceAsc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return [...products].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const filteredProducts = filterProducts(products);
  const sortedProducts = sortProducts(filteredProducts);

  useEffect(() => {
    onFilteredCountChange?.(filteredProducts.length);
  }, [filteredProducts.length, onFilteredCountChange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Показано {filteredProducts.length} товаров
        </p>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none w-full min-w-[200px] py-2 pl-4 pr-10 text-sm
                    bg-white border border-panda-gray-medium text-panda-black
                    hover:border-panda-black focus:border-panda-black focus:outline-none
                    transition-colors duration-200 cursor-pointer"
          >
            <option value="newest">Сначала новые</option>
            <option value="priceAsc">Сначала дешевле</option>
            <option value="priceDesc">Сначала дороже</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              className="w-4 h-4 text-panda-gray-dark" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Товары не найдены
          </h3>
          <p className="text-gray-600">
            Попробуйте изменить параметры фильтрации
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {sortedProducts.map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ProductCard 
                product={product}
                onFavoriteChange={(isFavorite: boolean) => {
                  const updatedProducts = products.map(p => 
                    p._id === product._id ? { ...p, isFavorite } : p
                  );
                  setProducts(updatedProducts);
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}