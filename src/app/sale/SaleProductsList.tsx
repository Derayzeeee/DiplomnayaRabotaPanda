'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import { useProductFilters } from '@/hooks/useProductFilters';
import type { ProductWithId, Color } from '@/types/product';

type SortOption = 'newest' | 'priceAsc' | 'priceDesc';

interface SaleProductsListProps {
  initialFilters?: {
    categories: string[];
    sizes: string[];
    colors: string[];
    heights: string[];
  };
  availableColors: Color[];
}

interface RawProduct {
  _id: {
    toString(): string;
  };
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  images: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  isSale: boolean;
  color: Color;
  sizes: string[];
  heights: string[];
}

export default function SaleProductsList({ initialFilters, availableColors }: SaleProductsListProps) {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);

  const { filterProducts, updateFilters } = useProductFilters({ 
    products, 
    colors: availableColors
  });

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  useEffect(() => {
    if (initialFilters) {
      updateFilters(initialFilters);
    }
  }, [initialFilters, updateFilters]);

  async function fetchSaleProducts() {
    try {
      const response = await fetch('/api/products/sale');
      const data = await response.json();
      const productsWithStringId = data.map((product: RawProduct) => ({
        ...product,
        _id: product._id.toString()
      }));
      setProducts(productsWithStringId);
    } catch (err) {
      console.error('Failed to fetch sale products:', err);
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
        return products;
    }
  };

  const filteredProducts = filterProducts(products);
  const sortedProducts = sortProducts(filteredProducts);

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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
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
              show: { opacity: 1, y: 0 }
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
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
            Товаров по скидке не найдено
          </h3>
          <p className="text-gray-600">
            Попробуйте изменить параметры фильтрации
          </p>
        </motion.div>
      )}
    </div>
  );
}