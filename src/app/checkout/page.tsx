'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useForm } from 'react-hook-form';

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

  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors }
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: 'г. Брест, Советская ул., 97',
      city: 'Брест',
      postalCode: '224030'
    }
  });

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
      setValue('address', 'г. Брест, Советская ул., 97');
      setValue('city', 'Брест');
      setValue('postalCode', '224030');
    } else {
      setValue('address', '');
      setValue('city', '');
      setValue('postalCode', '');
    }
  };

  const onSubmit = async (data: ShippingAddress) => {
    if (!cart || cart.items.length === 0) {
      setError('Корзина пуста');
      return;
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
          shippingAddress: data,
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  ФИО
                </label>
                <input
                  {...register('fullName', {
                    required: 'Поле ФИО обязательно для заполнения',
                    minLength: {
                      value: 5,
                      message: 'ФИО должно содержать минимум 5 символов'
                    },
                    pattern: {
                      value: /^[А-ЯЁа-яё\s-]+$/,
                      message: 'ФИО может содержать только кириллицу, пробелы и дефисы'
                    }
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-black focus:ring-black
                    ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Телефон
                </label>
                <input
                  {...register('phoneNumber', {
                    required: 'Номер телефона обязателен для заполнения',
                    pattern: {
                      value: /^(\+375|80)(29|25|44|33)(\d{7})$/,
                      message: 'Введите корректный номер телефона в формате +375XX1234567 или 80XX1234567'
                    }
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-black focus:ring-black
                    ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              {deliveryMethod !== 'pickup' && (
                <>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Адрес
                    </label>
                    <input
                      {...register('address', {
                        required: 'Адрес обязателен для заполнения',
                        minLength: {
                          value: 5,
                          message: 'Адрес должен содержать минимум 5 символов'
                        }
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-black focus:ring-black
                        ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Город
                    </label>
                    <input
                      {...register('city', {
                        required: 'Город обязателен для заполнения',
                        pattern: {
                          value: /^[А-ЯЁа-яё\s-]+$/,
                          message: 'Название города может содержать только кириллицу, пробелы и дефисы'
                        }
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-black focus:ring-black
                        ${errors.city ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Почтовый индекс
                    </label>
                    <input
                      {...register('postalCode', {
                        required: 'Почтовый индекс обязателен для заполнения',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Почтовый индекс должен содержать 6 цифр'
                        }
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-black focus:ring-black
                        ${errors.postalCode ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
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
                      <span>5 BYN</span>
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