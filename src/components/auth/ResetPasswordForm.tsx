'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface ResetPasswordFormProps {
  token: string;
}

interface ApiResponse {
  error?: string;
  message?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  const validatePassword = (): string | null => {
    if (newPassword !== confirmPassword) {
      return 'Пароли не совпадают';
    }

    if (newPassword.length < 8) {
      return 'Пароль должен содержать минимум 8 символов';
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return 'Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка при сбросе пароля');
      }

      setStatus('success');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    }
  };

  const isFormDisabled = status === 'loading' || status === 'success';

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="new-password" className="sr-only">
            Новый пароль
          </label>
          <input
            id="new-password"
            name="new-password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isFormDisabled}
            minLength={8}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="sr-only">
            Подтвердите пароль
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isFormDisabled}
            minLength={8}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
      </div>

      {error && (
        <div 
          className="text-red-600 text-sm text-center" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {status === 'success' && (
        <div 
          className="text-green-600 text-sm text-center"
          role="alert"
          aria-live="polite"
        >
          Пароль успешно изменен! Сейчас вы будете перенаправлены на страницу входа...
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isFormDisabled}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? 'Сохранение...' : 'Сохранить новый пароль'}
        </button>
      </div>

      <div className="text-sm text-center">
        <Link
          href="/login"
          className="font-medium text-black hover:text-gray-800"
        >
          Вернуться к входу
        </Link>
      </div>
    </form>
  );
}