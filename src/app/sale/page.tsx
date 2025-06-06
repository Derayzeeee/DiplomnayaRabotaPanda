import { Suspense } from 'react';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Loading from './loading';
import ClientFilterWrapper from './ClientFilterWrapper';
import { cache } from 'react';

// Добавляем конфигурацию для динамического рендеринга
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Кэшируем получение данных в рамках одного запроса
const getData = cache(async () => {
  try {
    await dbConnect();

    // Получаем все данные параллельно
    const [categories, uniqueSizes, products] = await Promise.all([
      Category.find({}).lean(),
      Product.distinct('sizes', { isSale: true }),
      Product.find({ isSale: true }).lean()
    ]);

    // Получаем уникальные цвета из продуктов
    const uniqueColors = Array.from(
      new Set(
        products.map(product => 
          JSON.stringify({ name: product.color.name, code: product.color.code })
        )
      )
    ).map(colorStr => JSON.parse(colorStr));

    return {
      categories: categories.map(cat => cat.name),
      sizes: uniqueSizes,
      colors: uniqueColors
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Возвращаем пустые массивы в случае ошибки
    return {
      categories: [],
      sizes: [],
      colors: []
    };
  }
});

export default async function SalePage() {
  const { categories, sizes, colors } = await getData();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 pt-24">
          <div className="flex flex-col space-y-6">
            <div className="text-left max-w-2xl mx-left mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Распродажа</h1>
              <p className="mt-4 text-lg text-gray-600">
                Специальные предложения и выгодные цены
              </p>
            </div>

            <Suspense fallback={<Loading />}>
              <ClientFilterWrapper
                categories={categories}
                sizes={sizes}
                colors={colors}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}