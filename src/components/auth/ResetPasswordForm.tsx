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

  // Весь ваш существующий код валидации и обработки формы
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
      
      // Redirect to login page after 2 seconds
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
      {/* Весь ваш существующий JSX код формы */}
    </form>
  );
}