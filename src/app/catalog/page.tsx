import { Suspense } from 'react';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import CatalogContent from './CatalogContent';
import Loading from './loading';
import Footer from '@/components/layout/Footer';

export default async function CatalogPage() {
  await dbConnect();
  
  const categories = await Category.find({}).lean();
  const uniqueSizes = await Product.distinct('sizes');
  const uniqueColorObjects = await Product.distinct('colors');

  // Убираем дубликаты цветов по коду цвета
  const uniqueColors = Array.from(new Map(
    uniqueColorObjects
      .filter(color => typeof color === 'object' && color !== null)
      .map(color => [color.code, { name: color.name, code: color.code }])
  ).values());

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 pt-24">
          <div className="flex flex-col space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Каталог</h1>
              <p className="mt-4 text-lg text-gray-600">
                Найдите свой идеальный стиль в нашей коллекции
              </p>
            </div>

            <Suspense fallback={<Loading />}>
              <CatalogContent
                categories={categories.map(cat => cat.name)}
                sizes={uniqueSizes}
                colors={uniqueColors}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}