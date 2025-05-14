'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Types } from 'mongoose';

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
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Мои заказы
        </h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id.toString()}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Заказ от {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                    <p className="text-sm text-gray-500">
                      № {order._id.toString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
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
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium hover:text-gray-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          Размер: {item.size}, Цвет: {item.color.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Количество: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-6 pt-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Адрес доставки:</p>
                      <p className="text-sm text-gray-500">{order.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-500">{order.shippingAddress.phoneNumber}</p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Итого</p>
                      <p className="text-xl font-medium">
                        {order.totalAmount.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}