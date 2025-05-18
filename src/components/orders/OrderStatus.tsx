'use client';

import { useState, useEffect } from 'react';

const ORDER_STATUSES = [
  { status: 'pending', label: 'Ожидает обработки', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'processing', label: 'В обработке', color: 'bg-blue-100 text-blue-800' },
  { status: 'completed', label: 'Выполнен', color: 'bg-green-100 text-green-800' },
  { status: 'cancelled', label: 'Отменён', color: 'bg-red-100 text-red-800' }
] as const;

type OrderStatus = typeof ORDER_STATUSES[number]['status'];

interface OrderStatusProps {
  initialStatus: OrderStatus;
  orderId: string;
  demo?: boolean;
}

export default function OrderStatus({ initialStatus, orderId, demo = false }: OrderStatusProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isDemo, setIsDemo] = useState(demo);

  useEffect(() => {
    if (!isDemo) return;

    const statusIndex = ORDER_STATUSES.findIndex(s => s.status === currentStatus);
    
    // Если текущий статус "completed" или "cancelled", останавливаем демо
    if (currentStatus === 'completed' || currentStatus === 'cancelled') {
      setIsDemo(false);
      return;
    }

    const interval = setInterval(() => {
      const nextIndex = (statusIndex + 1) % (ORDER_STATUSES.length - 1); // Исключаем "cancelled"
      const nextStatus = ORDER_STATUSES[nextIndex].status;
      setCurrentStatus(nextStatus);

      // Здесь можно добавить вызов API для обновления статуса в базе данных
      console.log(`Заказ ${orderId}: статус изменен на ${ORDER_STATUSES[nextIndex].label}`);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStatus, orderId, isDemo]);

  const statusInfo = ORDER_STATUSES.find(s => s.status === currentStatus) || ORDER_STATUSES[0];

  return (
    <div className="flex items-center space-x-2">
      <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
      {isDemo && (
        <span className="text-xs text-gray-500">
          (Демо-режим: статус меняется автоматически)
        </span>
      )}
    </div>
  );
}