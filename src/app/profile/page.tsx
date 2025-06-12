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

      await updateAuthStatus();
      router.push('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-32 w-32 border-2 border-black"></div> 
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-3xl mx-auto">
        <div className="border-0 border-black p-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black mb-3">Личный кабинет</h1>
            <p className="text-gray-600">Управляйте своим профилем и настройками</p>
          </div>

          <div className="border-t-2 border-black pt-8"> 
            <dl>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-600">Email</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 space-y-6">
            <div className="border-t-2 border-black pt-6">
              <h2 className="text-xl font-bold text-black mb-6">Мои заказы</h2>
              <button
                type="button"
                className="w-full py-3 px-4 border-2 border-black text-white bg-black 
                         hover:bg-gray-900 transition-colors text-sm font-medium"
                onClick={() => router.push('/orders')}
              >
                Просмотреть заказы
              </button>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h2 className="text-xl font-bold text-black mb-6">Управление профилем</h2>
              <div className="space-y-4">
                
                <button
                  type="button"
                  className="w-full py-3 px-4 border-2 border-black text-white bg-black 
                           hover:bg-gray-900 transition-colors text-sm font-medium"
                  onClick={() => router.push('/profile/change-password')}
                >
                  Изменить пароль
                </button>

                {user.role === 'admin' && (
                  <button
                    type="button"
                    className="w-full py-3 px-4 border-2 border-black text-black bg-white 
                             hover:bg-gray-100 transition-colors text-sm font-medium"
                    onClick={() => router.push('/admin')}
                  >
                    Панель администратора
                  </button>
                )}

                <button
                  type="button"
                  className="w-full py-3 px-4 border-2 border-black text-black bg-white 
                           hover:bg-gray-100 transition-colors text-sm font-medium"
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