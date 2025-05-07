// src/components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ProductWithId } from '@/types/product';

interface ProductCardProps {
  product: ProductWithId;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] && isValidUrl(product.images[0])
    ? product.images[0]
    : '/fallback-image.jpg';

  return (
    <Link href={`/product/${product._id}`} className="group">
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
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.isSale && product.oldPrice ? (
            <>
              <span className="text-lg font-bold text-red-600">
                {product.price} ₽
              </span>
              <span className="text-sm text-gray-500 line-through">
                {product.oldPrice} ₽
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {product.price} ₽
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {product.colors.slice(0, 3).map((color) => (
              <div
                key={color.code}
                className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-200"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center">
                <span className="text-[8px] font-medium text-gray-600">
                  +{product.colors.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {product.sizes.length} {product.sizes.length === 1 ? 'размер' : 'размеров'}
          </div>
        </div>
      </div>
    </Link>
  );
}