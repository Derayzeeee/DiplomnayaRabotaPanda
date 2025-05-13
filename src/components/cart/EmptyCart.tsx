import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Корзина пуста
          </h1>
          <p className="text-gray-500 mb-8">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  );
}