import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartSummary() {
  const router = useRouter();
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!cart) return null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Сумма заказа
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between text-base">
          <span>Товары ({cart.items.length})</span>
          <span>{cart.totalAmount.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className="flex justify-between text-base">
          <span>Доставка</span>
          <span>Бесплатно</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-lg font-medium">
            <span>Итого</span>
            <span>{cart.totalAmount.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>
      <button 
        onClick={handleCheckout}
        className="w-full mt-6 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
      >
        Оформить заказ
      </button>
    </div>
  );
}