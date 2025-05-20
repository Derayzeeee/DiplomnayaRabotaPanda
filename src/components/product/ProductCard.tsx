'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductWithId } from '@/types/product';
import FavoriteButton from './FavoriteButton';
import { getProductImageSizes } from '@/lib/imageUtils';

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
    ? getProductImageSizes.medium(product.images[0])
    : '/fallback-image.jpg';

  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Контейнер изображения */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa]">
        <div 
          className="relative w-full" 
          style={{ paddingBottom: '150%' }}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product.name || 'Product Image'}
              fill
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              quality={75}
            />
          )}
        </div>

        {/* Метки Sale и New */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isSale && (
            <div className="bg-red-500 text-white px-3 py-1 text-xs font-medium">
              SALE
            </div>
          )}
          {product.isNewProduct && (
            <div className="bg-panda-black text-black px-3 py-1 text-xs font-medium">
              NEW
            </div>
          )}
        </div> 

        {/* Кнопка избранного */}
        <div className="absolute top-2 right-2">
          <FavoriteButton
            productId={product._id}
            initialIsFavorite={product.isFavorite}
            onFavoriteChange={onFavoriteChange}
          />
        </div>
      </div>
      
      {/* Информация о продукте */}
      <Link 
        href={`/product/${product._id}`} 
        className="block mt-3 space-y-1 group-hover:opacity-80 transition-opacity duration-300"
      >
        <h3 className="text-sm text-panda-black font-normal">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.isSale && product.oldPrice ? (
            <>
              <span className="text-base font-medium text-red-500">
                {product.price.toFixed(2)} BYN
              </span>
              <span className="text-sm text-panda-gray-dark line-through">
                {product.oldPrice.toFixed(2)} BYN
              </span>
            </>
          ) : (
            <span className="text-base font-medium text-panda-black">
              {product.price.toFixed(2)} BYN
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-panda-gray-dark mt-1">
          {/* Цвет */}
          {product.color && product.color.code ? (
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full border border-panda-gray-medium"
                style={{ backgroundColor: product.color.code }}
                title={product.color.name}
              />
              <span>{product.color.name}</span>
            </div>
          ) : null}
          {/* Размеры */}
          <div>
            {product.sizes.length} {
              product.sizes.length === 1 ? 'размер' : 
              product.sizes.length >= 2 && product.sizes.length <= 4 ? 'размера' : 
              'размеров'
            }
          </div>
        </div>
      </Link>
    </motion.div>
  );
}