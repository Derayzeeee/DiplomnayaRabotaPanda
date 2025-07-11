import { Suspense } from 'react';
import dbConnect from '@/lib/db/mongoose';
import CatalogContent from './CatalogContent';
import Loading from './loading';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CatalogPage() {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 pt-24">
          <div className="flex flex-col space-y-6">
            <div className="text-left max-w-2xl mx-left mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Каталог</h1>
              <p className="mt-4 text-lg text-gray-600">
                Найдите свой идеальный стиль в нашей коллекции
              </p>
            </div>

            <Suspense fallback={<Loading />}>
              <CatalogContent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}