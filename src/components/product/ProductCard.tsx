'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductWithId } from '@/types/product';
import FavoriteButton from './FavoriteButton';

interface ProductCardProps {
  product: ProductWithId;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ProductCard({ product, onFavoriteChange }: ProductCardProps) {
  const imageUrl = product.images?.[0] && isValidUrl(product.images[0])
    ? product.images[0]
    : '/fallback-image.jpg';

  return (
    <motion.div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name || 'Product Image'}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.isSale && (
            <div className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-medium">
              Sale
            </div>
          )}
          {product.isNewProduct && (
            <div className="bg-indigo-600 text-white px-2 py-1 rounded-md text-sm font-medium">
              New
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex flex-col gap-2">
          <FavoriteButton
              productId={product._id}
              initialIsFavorite={product.isFavorite}
              onFavoriteChange={onFavoriteChange}
            />
        </div>
      </div>
      
      <Link href={`/product/${product._id}`} className="block mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.isSale && product.oldPrice ? (
            <>
              <span className="text-lg font-bold text-red-600">
                {product.price} BYN
              </span>
              <span className="text-sm text-gray-500 line-through">
                {product.oldPrice} BYN
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {product.price} BYN
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Цвет (только один) */}
          {product.color && product.color.code ? (
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-200"
                style={{ backgroundColor: product.color.code }}
                title={product.color.name}
              />
              <span className="text-xs text-gray-600">{product.color.name}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Нет цвета</span>
          )}
          <div className="text-sm text-gray-500">
            {product.sizes.length} {product.sizes.length === 1 ? 'размер' : 'размеров'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}