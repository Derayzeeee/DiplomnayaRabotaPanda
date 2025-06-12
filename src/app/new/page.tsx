import { Suspense } from 'react';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Loading from './loading';
import ClientFilterWrapper from './ClientFilterWrapper';

export default async function NewProductsPage() {
  await dbConnect();

  const categories = await Category.find({}).lean();
  const uniqueSizes = await Product.distinct('sizes', { isNewProduct: true });
  
  const products = await Product.find({ isNewProduct: true }).lean();
  const uniqueColors = Array.from(
    new Set(
      products.map(product => 
        JSON.stringify({ name: product.color.name, code: product.color.code })
      )
    )
  ).map(colorStr => JSON.parse(colorStr));

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 pt-24">
          <div className="flex flex-col space-y-6">
            <div className="text-left max-w-2xl mx-left mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Новинки</h1>
              <p className="mt-4 text-lg text-gray-600">
                Откройте для себя наши последние поступления
              </p>
            </div>

            <Suspense fallback={<Loading />}>
              <ClientFilterWrapper
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