'use client';

import { useState, useEffect } from 'react';
import FilterWrapper from '@/components/catalog/FilterWrapper';
import ProductList from './ProductList';
import { Product, Color } from '@/types/product';

export default function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json() as Product[];
        
        setProducts(data);

        const uniqueCategories = Array.from(
          new Set(data.map((product: Product) => product.category))
        ) as string[];
        setCategories(uniqueCategories);

        const uniqueSizes = Array.from(
          new Set(data.flatMap((product: Product) => product.sizes))
        ) as string[];
        setSizes(uniqueSizes);

        const uniqueColors = Array.from(
          new Map(
            data
              .filter((product: Product) => product.color && product.color.code)
              .map((product: Product) => [product.color.code, product.color])
          ).values()
        ) as Color[];
        setColors(uniqueColors);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    heights: [] as string[],
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-panda-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковая панель с фильтрами */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="border-0 border-panda-black p-6 sticky top-24">
              <FilterWrapper
                categories={categories}
                sizes={sizes}
                colors={colors}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Основной контент */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-panda-black">

              </h2>
            </div>

            <ProductList 
              initialFilters={filters}
              onFilteredCountChange={setFilteredCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}