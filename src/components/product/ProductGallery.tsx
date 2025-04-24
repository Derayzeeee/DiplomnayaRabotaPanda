'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[mainImage]}
          alt={productName}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setMainImage(index)}
            className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 
              ${mainImage === index ? 'ring-2 ring-black' : ''}`}
          >
            <Image
              src={image}
              alt={`${productName} ${index + 1}`}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}