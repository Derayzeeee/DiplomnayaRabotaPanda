import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Types } from 'mongoose';
import ProductPage from './ProductPage';
import Loading from './loading';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPageWrapper({ params }: ProductPageProps) {
  const id = params.id;

  if (!id || !Types.ObjectId.isValid(id)) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <ProductPage id={id} />
    </Suspense>
  );
}