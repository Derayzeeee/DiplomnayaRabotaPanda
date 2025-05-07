'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import type { ProductWithId } from '@/types/product';
import Loading from './loading';
import Footer from '@/components/layout/Footer';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ProductWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-8">Избранное</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">У вас пока нет избранных товаров</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
          {favorites.map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <ProductCard 
                product={product} 
                onFavoriteChange={(isFavorite) => {
                  if (!isFavorite) {
                    setFavorites(prevFavorites => 
                      prevFavorites.filter(fav => fav._id !== product._id)
                    );
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      <Footer/>
    </div>
  );
}