'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  status: string;
}

const MotionDiv = motion.div;

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/popular-products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching random products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !products.length) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Рекомендуемые товары
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <MotionDiv
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <Link href={`/product/${product.id}`}>
                <div className="aspect-[4/5] relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.status === 'NEW' && (
                      <span className="bg-black text-white px-3 py-1 text-sm font-medium">
                        Новинка
                      </span>
                    )}
                    {product.status === 'SALE' && (
                      <span className="bg-red-500 text-white px-3 py-1 text-sm font-medium">
                        Скидка
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price.toLocaleString('ru-RU')} BYN
                    </span>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}