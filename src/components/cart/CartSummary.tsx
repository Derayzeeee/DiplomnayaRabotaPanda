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
  <div className="border-0 border-black p-6">
    <h2 className="text-xl font-bold text-black mb-6 pb-4 border-b-2 border-black">
      Сумма заказа
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between text-base">
        <span>Товары ({cart.items.length})</span>
        <span>{cart.totalAmount.toLocaleString('ru-RU')} BYN</span>
      </div>
      <div className="flex justify-between text-base">
      </div>
      <div className="border-t-2 border-black pt-4 mt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Итого</span>
          <span>{cart.totalAmount.toLocaleString('ru-RU')} BYN</span>
        </div>
      </div>
    </div>
    <button 
      onClick={handleCheckout}
      className="w-full mt-8 bg-black text-white py-3 px-4 hover:bg-gray-900 
                transition-colors border-2 border-black"
    >
      Оформить заказ
    </button>
  </div>
);
}