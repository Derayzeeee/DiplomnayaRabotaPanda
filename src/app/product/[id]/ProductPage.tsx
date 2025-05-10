'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { ProductWithId, Color } from '@/types/product';
import ProductGallery from '@/components/product/ProductGallery';
import SizeSelector from '@/components/product/SizeSelector';
import ColorSelector from '@/components/product/ColorSelector';
import AddToCartButton from '@/components/product/AddToCartButton';
import FavoriteButton from '@/components/product/FavoriteButton';
import SizeChart from '@/components/common/SizeChart';
import Loading from './loading';
import Footer from '@/components/layout/Footer';
import RelatedProducts from './RelatedProducts';
import { useCart } from '@/context/CartContext';
import { CATEGORIES_WITH_HEIGHT } from '@/constants/filters';

interface ProductPageProps {
  id: string;
}

export default function ProductPage({ id }: ProductPageProps) {
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithId[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert('Пожалуйста, выберите размер и цвет');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    alert('Товар добавлен в корзину');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return notFound();
  }

  const showHeightInfo = CATEGORIES_WITH_HEIGHT.includes(product.category);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Галерея изображений */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Информация о продукте */}
          <div className="space-y-6">
            {/* Заголовок и цена */}
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
                  <FavoriteButton 
                    productId={product._id}
                    className="!bg-gray-100 hover:!bg-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Описание */}
            <div className="prose prose-sm">
              <p>{product.description}</p>
            </div>

            {/* Выбор размера, цвета и количества */}
            <div className="space-y-4">
              {/* Размеры и таблица размеров */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Размеры</h3>
                  <SizeChart />
                </div>
                <SizeSelector 
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>

              {/* Цвета */}
              <ColorSelector 
                colors={product.colors}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />

              {/* Количество и кнопка добавления в корзину */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !selectedSize || !selectedColor}
                  className={`flex-1 px-6 py-3 rounded-md text-white transition-colors ${
                    product.inStock && selectedSize && selectedColor
                      ? 'bg-black hover:bg-gray-800'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {/* Доставка */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Доставка</h3>
                <p className="mt-2 text-sm text-gray-600">
                  1-3 рабочих дня. Бесплатная доставка при заказе от 5000 ₽
                </p>
              </div>
              
              {/* Статус наличия */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Статус</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </p>
              </div>

              {/* Информация о росте */}
              {showHeightInfo && product.heights && product.heights.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Рост</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.heights.map((height: string) => ( // Добавляем явную типизацию
                      <span
                        key={height}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {height} см
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Категория */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Категория</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {product.category}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Похожие товары */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Похожие товары
            </h2>
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}