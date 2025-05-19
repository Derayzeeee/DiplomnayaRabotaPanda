'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Что-то пошло не так');
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Восстановление пароля
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Или{' '}
            <Link
              href="/login"
              className="font-medium text-black hover:text-gray-800"
            >
              вернуться к входу
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              placeholder="Email адрес"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>

          {status === 'error' && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {status === 'success' && (
            <div className="text-green-600 text-sm">
              Инструкции по восстановлению пароля отправлены на ваш email
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
            >
              {status === 'loading' ? 'Отправка...' : 'Отправить инструкции'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}