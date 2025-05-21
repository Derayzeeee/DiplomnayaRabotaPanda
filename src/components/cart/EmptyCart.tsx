import Link from 'next/link';

export default function EmptyCart() {
  return (
  <div className="min-h-screen bg-white pt-24">
    <div className="container mx-auto px-4">
      <div className="text-center py-16 border-0 border-black"> {/* Добавили рамку */}
        <h1 className="text-3xl font-bold text-black mb-4">
          Корзина пуста
        </h1>
        <p className="text-gray-600 mb-8">
          Добавьте товары в корзину, чтобы оформить заказ
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-black text-white px-8 py-3 
                   hover:bg-gray-900 transition-colors border-2 border-black" // Убрали rounded, добавили border
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  </div>
);
}