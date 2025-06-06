import { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

// Правильная типизация для страницы с динамическими параметрами
type PageProps = {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Сброс пароля',
  description: 'Страница сброса пароля',
};

/**
 * Reset Password Page Component
 * Created by Derayzeeee on 2025-06-06 18:10:44
 */
export default function ResetPasswordPage({ params }: PageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Установка нового пароля
          </h2>
        </div>
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  );
}