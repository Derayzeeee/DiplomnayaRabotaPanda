'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import type { ProductWithId } from '@/types/product';
import ProductGallery from '@/components/product/ProductGallery';
import SizeSelector from '@/components/product/SizeSelector';
import FavoriteButton from '@/components/product/FavoriteButton';
import SizeChart from '@/components/common/SizeChart';
import Toast from '@/components/ui/Toast';
import Loading from './loading';
import RelatedProducts from './RelatedProducts';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES_WITH_HEIGHT } from '@/constants/filters';

interface ProductPageProps {
  id: string;
}

export default function ProductPage({ id }: ProductPageProps) {
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithId[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };


  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!product || !selectedSize) {
      showNotification('Пожалуйста, выберите размер', 'error');
      return;
    }

    if (product.stockQuantity === 0) {
      showNotification('К сожалению, товар закончился', 'error');
      return;
    }

    if (product.stockQuantity < quantity) {
      showNotification(`К сожалению, доступно только ${product.stockQuantity} шт.`, 'error');
      setQuantity(product.stockQuantity);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.images[0],
        size: selectedSize,
        color: product.color,
        quantity,
      });
      showNotification('Товар успешно добавлен в корзину', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Не удалось добавить товар в корзину', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) return <Loading />;
  if (!product) return notFound();

  const showHeightInfo = CATEGORIES_WITH_HEIGHT.includes(product.category);
  const canAddToCart = product.stockQuantity > 0 && isAuthenticated && selectedSize && !isAddingToCart;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                        {product.price.toLocaleString('ru-RU')} BYN
                      </span>
                      {product.oldPrice && (
                        <span className="text-xl text-gray-500 line-through">
                          {product.oldPrice.toLocaleString('ru-RU')} BYN
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price.toLocaleString('ru-RU')} BYN
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

            <div className="prose prose-sm">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4">
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

              <div>
                <h3 className="text-sm font-medium text-gray-900">Цвет</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: product.color.code }}
                    title={product.color.name}
                  />
                  <span className="text-sm">{product.color.name}</span>
                </div>
              </div>

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
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`flex-1 px-6 py-3 rounded-md text-white transition-colors ${
                    !isAuthenticated
                      ? 'bg-gray-500 hover:bg-gray-600'
                      : canAddToCart
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!isAuthenticated
                    ? 'Войдите в аккаунт чтобы добавить товар в корзину'
                    : product.stockQuantity === 0
                      ? 'Нет в наличии'
                      : !selectedSize
                        ? 'Выберите размер'
                        : isAddingToCart
                          ? 'Добавление...'
                          : 'Добавить в корзину'}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              

              {showHeightInfo && product.heights && product.heights.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Рост</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.heights.map((height: string) => (
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
            </div>
          </div>
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
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}