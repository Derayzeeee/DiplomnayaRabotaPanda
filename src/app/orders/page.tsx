'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Types } from 'mongoose';
import OrderStatus from '@/components/orders/OrderStatus';

interface OrderResponse {
  _id: string | Types.ObjectId;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    size: string;
    color: {
      name: string;
      code: string;
    };
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Не удалось загрузить заказы');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'completed':
        return 'Выполнен';
      case 'cancelled':
        return 'Отменён';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              У вас пока нет заказов
            </h1>
            <p className="text-gray-500 mb-8">
              Перейдите в каталог, чтобы сделать первый заказ
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
    {isLoading ? (
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    ) : error ? (
      <div className="container mx-auto px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    ) : orders.length === 0 ? (
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            У вас пока нет заказов
          </h1>
          <p className="text-gray-500 mb-8">
            Перейдите в каталог, чтобы сделать первый заказ
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    ) : (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Мои заказы
          </h1>
          <div className="text-sm text-gray-500">
            Всего заказов: {orders.length}
          </div>
        </div>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id.toString()}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Заказ от {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      № {order._id.toString()}
                    </p>
                  </div>
                  <OrderStatus
                    initialStatus={order.status}
                    orderId={order._id.toString()}
                    demo={true}
                  />
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color.code}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 80px) 100vw, 80px"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-gray-600 transition-colors block truncate"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="inline-block mr-3">
                            Размер: {item.size}
                          </span>
                          <span className="inline-flex items-center">
                            Цвет: {item.color.name}
                            <span 
                              className="ml-1 w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: item.color.code }}
                            />
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Количество: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} BYN
                        </p>
                        {item.oldPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {(item.oldPrice * item.quantity).toLocaleString('ru-RU')} BYN
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-6 pt-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                      <p className="font-medium text-gray-900 mb-2">Адрес доставки:</p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.phoneNumber}</p>
                        <p>
                          {order.shippingAddress.address},<br />
                          {order.shippingAddress.city},<br />
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:w-64">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Товары ({order.items.length})</span>
                          <span>{order.totalAmount.toLocaleString('ru-RU')} BYN</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <span>Итого c учетом доставки</span>
                            <span>{order.totalAmount.toLocaleString('ru-RU')} BYN</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}