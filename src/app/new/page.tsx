import { Suspense } from 'react';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Loading from './loading';
import Footer from '@/components/layout/Footer';
import FilterWrapper from './FilterWrapper';

export default async function NewProductsPage() {
  await dbConnect();

  // Получаем все категории и уникальные размеры/цвета из новых товаров
  const categories = await Category.find({}).lean();
  const uniqueSizes = await Product.distinct('sizes', { isNewProduct: true });
  const uniqueColorObjects = await Product.distinct('colors', { isNewProduct: true });

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
              <h1 className="text-4xl font-bold text-gray-900">Новинки</h1>
              <p className="mt-4 text-lg text-gray-600">
                Откройте для себя наши последние поступления
              </p>
            </div>

            <Suspense fallback={<Loading />}>
              <FilterWrapper
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