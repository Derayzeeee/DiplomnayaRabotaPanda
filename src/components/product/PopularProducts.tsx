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
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-none h-12 w-12 border-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !products.length) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-black mb-12 text-center tracking-tight">
          Популярные товары
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <MotionDiv
              key={product.id}
              whileHover={{ y: -5 }}
              className="group bg-white border-2 border-black transition-all duration-300 overflow-hidden" 
            >
              <Link href={`/product/${product.id}`}>
                <div className="aspect-[4/5] relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.status === 'NEW' && (
                      <span className="bg-white text-black px-4 py-1 text-sm font-medium border-2 border-black">
                        Новинка
                      </span>
                    )}
                    {product.status === 'SALE' && (
                      <span className="bg-black text-white px-4 py-1 text-sm font-medium border-2 border-white">
                        Скидка
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-black group-hover:text-gray-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl font-bold text-black">
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