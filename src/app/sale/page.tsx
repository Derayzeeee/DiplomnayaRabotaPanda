import { Suspense } from 'react';
import Loading from './loading';
import ClientFilterWrapper from './ClientFilterWrapper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SalePage() {
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
              <ClientFilterWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}