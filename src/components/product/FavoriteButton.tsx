'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  className?: string;
}

export default function FavoriteButton({ 
  productId, 
  initialIsFavorite = false,
  onFavoriteChange,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch('/api/favorites/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds: productId }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsInitialized(true);
      }
    };

    checkFavoriteStatus();
  }, [productId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);

      const response = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      onFavoriteChange?.(newIsFavorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert('Произошла ошибка при обновлении избранного. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
     <motion.button
      onClick={toggleFavorite}
      className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md
                 hover:bg-panda-gray-light transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-panda-gray-dark'}`}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </motion.button>
  );
}