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
            {/* Основное изображение */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <div 
                    className="relative w-full" 
                    style={{ 
                        // Соотношение 10:15 = (15/10 * 100)% = 150%
                        paddingBottom: '150%'
                    }}
                >
                    <Image
                        src={getOptimizedImageUrl(images[mainImage], 1000)}
                        alt={productName}
                        fill
                        className="object-contain"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority
                        quality={85}
                    />
                </div>
            </div>

            {/* Миниатюры */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <button
                        key={image}
                        onClick={() => setMainImage(index)}
                        className={`relative bg-gray-100 rounded-lg overflow-hidden
                            ${mainImage === index ? 'ring-2 ring-black' : ''}
                            hover:opacity-80 transition-opacity`}
                    >
                        <div 
                            className="relative w-full" 
                            style={{ 
                                // Сохраняем то же соотношение 10:15 для миниатюр
                                paddingBottom: '150%'
                            }}
                        >
                            <Image
                                src={getProductImageSizes.thumbnail(image)}
                                alt={`${productName} ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="(min-width: 1024px) 15vw, 25vw"
                                quality={60}
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}