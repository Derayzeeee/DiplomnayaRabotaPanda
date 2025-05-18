'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

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
  className = ''
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
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`relative z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {isFavorite ? (
        <HeartIconSolid className="w-6 h-6 text-red-500" />
      ) : (
        <HeartIcon className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
}