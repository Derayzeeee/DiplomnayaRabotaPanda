'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductWithId } from '@/types/product';

interface ProductDetailsProps {
  product: ProductWithId;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-center"
          />
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.isSale && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              Sale
            </div>
          )}
          {product.isNewProduct && (
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              New
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
        </div>

        <div className="flex items-center gap-4">
          {product.isSale && product.salePrice ? (
            <>
              <span className="text-3xl font-bold text-red-600">
                {product.salePrice} BYN
              </span>
              <span className="text-xl text-gray-500 line-through">
                {product.price} BYN
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {product.price} BYN
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Размер</h3>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedSize === size
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
            <h3 className="text-sm font-medium text-gray-900">Цвет</h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: product.color.code }}
                title={product.color.name}
              />
              <span className="text-sm">{product.color.name}</span>
            </div>
          </div>

        <button
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
          onClick={() => {
            // Добавление в корзину
          }}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}