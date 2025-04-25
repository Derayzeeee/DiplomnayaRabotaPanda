'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  email: string;
  userId: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { updateAuthStatus } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // Проверяем авторизацию
        const response = await fetch('/api/profile', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка при выходе');
      }

      await updateAuthStatus(); // Обновляем статус авторизации
      router.push('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
            <p className="text-gray-600">Управляйте своим профилем и настройками</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">ID пользователя</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.userId}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Роль</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 space-y-4">
            {/* Секция заказов */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Мои заказы</h2>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                onClick={() => router.push('/profile/orders')}
              >
                Просмотреть заказы
              </button>
            </div>

            {/* Секция управления профилем */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Управление профилем</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  onClick={() => router.push('/profile/edit')}
                >
                  Редактировать профиль
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  onClick={() => router.push('/profile/change-password')}
                >
                  Изменить пароль
                </button>

                {user.role === 'admin' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => router.push('/admin')}
                  >
                    Панель администратора
                  </button>
                )}

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  onClick={handleLogout}
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}