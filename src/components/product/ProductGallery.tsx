'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, getProductImageSizes } from '@/lib/imageUtils';

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
                    src={getOptimizedImageUrl(images[mainImage], 1000)}
                    alt={productName}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
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
                            src={getProductImageSizes.thumbnail(image)}
                            alt={`${productName} ${index + 1}`}
                            fill
                            className="object-cover object-center"
                            sizes="(min-width: 1024px) 15vw, 25vw"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}