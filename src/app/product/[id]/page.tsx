import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import ProductGallery from '@/components/product/ProductGallery';
import SizeSelector from '@/components/product/SizeSelector';
import ColorSelector from '@/components/product/ColorSelector';
import AddToCartButton from '@/components/product/AddToCartButton';
import FavoriteButton from '@/components/product/FavoriteButton';
import type { ProductWithId } from '@/types/product';
import Loading from './loading';
import Footer from '@/components/layout/Footer';
import RelatedProducts from './RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface MongoProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: Array<{ name: string; code: string }>;
  isNewProduct: boolean;
  isSale: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id || !Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  try {
    const rawProduct = (await Product.findById(id).lean()) as unknown;
    if (!rawProduct) {
      notFound();
    }

    // Проверяем, что rawProduct соответствует нашему интерфейсу
    const mongoProduct = rawProduct as MongoProduct;

    const product: ProductWithId = {
      _id: mongoProduct._id.toString(),
      name: mongoProduct.name,
      description: mongoProduct.description,
      price: mongoProduct.price,
      oldPrice: mongoProduct.oldPrice,
      images: mongoProduct.images,
      category: mongoProduct.category,
      sizes: mongoProduct.sizes,
      colors: mongoProduct.colors.map(color => ({
        name: color.name,
        code: color.code
      })),
      isNewProduct: mongoProduct.isNewProduct,
      isSale: mongoProduct.isSale,
      inStock: mongoProduct.inStock,
      createdAt: mongoProduct.createdAt.toISOString(),
      updatedAt: mongoProduct.updatedAt.toISOString()
    };

    const rawRelatedProducts = (await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .lean()) as unknown;

    // Проверяем, что rawRelatedProducts соответствует массиву MongoProduct
    const mongoRelatedProducts = rawRelatedProducts as MongoProduct[];

    const relatedProducts: ProductWithId[] = mongoRelatedProducts.map(prod => ({
      _id: prod._id.toString(),
      name: prod.name,
      description: prod.description,
      price: prod.price,
      oldPrice: prod.oldPrice,
      images: prod.images,
      category: prod.category,
      sizes: prod.sizes,
      colors: prod.colors.map(color => ({
        name: color.name,
        code: color.code
      })),
      isNewProduct: prod.isNewProduct,
      isSale: prod.isSale,
      inStock: prod.inStock,
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString()
    }));

    return (
      <div className="bg-white min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Suspense fallback={<Loading />}>
              <div>
                <ProductGallery images={product.images} productName={product.name} />
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {product.isSale ? (
                        <>
                          <span className="text-2xl font-bold text-red-600">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                          {product.oldPrice && (
                            <span className="text-xl text-gray-500 line-through">
                              {product.oldPrice.toLocaleString('ru-RU')} ₽
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Индикаторы статуса товара */}
                      <div className="flex gap-2">
                        {product.isNewProduct && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Новинка
                          </span>
                        )}
                        {product.isSale && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Скидка
                          </span>
                        )}
                      </div>
                      {/* Кнопка избранного */}
                      <FavoriteButton 
                        productId={product._id}
                        className="!bg-gray-100 hover:!bg-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm">
                  <p>{product.description}</p>
                </div>

                <div className="space-y-4">
                  <SizeSelector sizes={product.sizes} />
                  <ColorSelector colors={product.colors} />
                  <div className="flex items-center gap-4">
                    <AddToCartButton product={product} />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Доставка</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      1-3 рабочих дня. Бесплатная доставка при заказе от 5000 ₽
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Статус</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </p>
                  </div>
                </div>
              </div>
            </Suspense>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Похожие товары
              </h2>
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}