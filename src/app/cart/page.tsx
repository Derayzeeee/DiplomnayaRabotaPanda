'use client';

import { useCart } from '@/context/CartContext';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import LoadingCart from '@/components/cart/LoadingCart';

export default function CartPage() {
  const { cart, isLoading, error } = useCart();

  if (isLoading) {
    return <LoadingCart />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}