'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}

type DeliveryMethod = 'pickup' | 'courier' | 'post';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [totalWithDelivery, setTotalWithDelivery] = useState(cart?.totalAmount || 0);
  
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phoneNumber: '',
    address: 'г. Брест, Советская ул., 97', // Значение по умолчанию для самовывоза
    city: 'Брест', // Значение по умолчанию для самовывоза
    postalCode: '224030' // Значение по умолчанию для самовывоза
  });

  // Обновляем общую сумму при изменении способа доставки или суммы корзины
  useEffect(() => {
    if (!cart) return;

    let newTotal = cart.totalAmount;
    if (deliveryMethod === 'courier' && cart.totalAmount < 200) {
      newTotal += 5;
    }
    setTotalWithDelivery(newTotal);
  }, [deliveryMethod, cart]);

  const handleDeliveryChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);

    if (method === 'pickup') {
      setFormData(prev => ({
        ...prev,
        address: 'г. Брест, Советская ул., 97',
        city: 'Брест',
        postalCode: '224030'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        address: '',
        city: '',
        postalCode: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      setError('Корзина пуста');
      return;
    }

    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (deliveryMethod !== 'pickup') {
      if (!formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
        setError('Пожалуйста, заполните адрес доставки');
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          totalAmount: totalWithDelivery,
          shippingAddress: formData,
          deliveryMethod: deliveryMethod
        }),
      });

      if (orderResponse.status === 401) {
        router.push('/login');
        return;
      }

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const clearResponse = await fetch('/api/cart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!clearResponse.ok) {
        console.error('Failed to clear cart');
      }

      router.push('/cart');
      alert('Заказ успешно оформлен!');
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Произошла ошибка при оформлении заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!cart || cart.items.length === 0) {
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

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Оформление заказа
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Способ доставки */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Способ доставки</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => handleDeliveryChange('pickup')}
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <span className="text-sm text-gray-900">Самовывоз (бесплатно)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="courier"
                      checked={deliveryMethod === 'courier'}
                      onChange={() => handleDeliveryChange('courier')}
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <span className="text-sm text-gray-900">
                      Курьерская доставка 
                      {cart.totalAmount >= 200 
                        ? ' (бесплатно)' 
                        : ' (5 BYN)'}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="post"
                      checked={deliveryMethod === 'post'}
                      onChange={() => handleDeliveryChange('post')}
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <span className="text-sm text-gray-900">Почтой Беларуси (по тарифам почты)</span>
                  </label>
                </div>
                
                {/* Информация о способе доставки */}
                <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                  {deliveryMethod === 'pickup' && (
                    <p>
                      Вы можете забрать заказ по адресу: г. Брест, Советская ул., 97<br />
                      Время работы: Пн-Пт с 9:00 до 18:00
                    </p>
                  )}
                  {deliveryMethod === 'courier' && (
                    <p>
                      Доставка осуществляется на следующий рабочий день.<br />
                      {cart.totalAmount >= 200 
                        ? 'При заказе от 200 BYN доставка бесплатная.' 
                        : 'Стоимость доставки 5 BYN. При заказе от 200 BYN доставка бесплатная.'}
                    </p>
                  )}
                  {deliveryMethod === 'post' && (
                    <p>
                      Доставка осуществляется Почтой Беларуси.<br />
                      Срок доставки 3-5 рабочих дней.<br />
                      Стоимость рассчитывается по тарифам Почты Беларуси.
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <Link href="/delivery" className="text-sm text-black hover:underline">
                    Подробнее об условиях доставки
                  </Link>
                </div>
              </div>

              {/* Контактная информация */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  ФИО
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              {/* Адрес доставки (скрыт при самовывозе) */}
              {deliveryMethod !== 'pickup' && (
                <>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Адрес
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Город
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Почтовый индекс
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </form>
          </div>

          {/* Сводка заказа */}
          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Ваш заказ
              </h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color.code}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Размер: {item.size}, Цвет: {item.color.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Количество: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString('ru-RU')} BYN
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-base text-gray-500 mb-2">
                    <span>Сумма заказа</span>
                    <span>{cart.totalAmount.toLocaleString('ru-RU')} BYN</span>
                  </div>
                  {deliveryMethod === 'courier' && cart.totalAmount < 200 && (
                    <div className="flex justify-between text-base text-gray-500 mb-2">
                      <span>Доставка</span>
                      <span>5.00 BYN</span>
                    </div>
                  )}
                  {deliveryMethod === 'post' && (
                    <div className="flex justify-between text-base text-gray-500 mb-2">
                      <span>Доставка</span>
                      <span>по тарифам почты</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-medium text-gray-900 mt-4">
                    <span>Итого к оплате</span>
                    <span>
                      {deliveryMethod === 'post' 
                        ? `${cart.totalAmount.toLocaleString('ru-RU')} BYN + доставка` 
                        : `${totalWithDelivery.toLocaleString('ru-RU')} BYN`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}