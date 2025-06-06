import type { Metadata } from 'next/types';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

// Определяем типы параметров для generateMetadata и страницы
type PageParams = {
  token: string;
};

type Props = {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
};

// Так как метаданные статические, можно экспортировать их как константу
export const metadata: Metadata = {
  title: 'Сброс пароля',
  description: 'Страница сброса пароля',
};

/**
 * Reset Password Page Component
 * Created by Derayzeeee on 2025-06-06 19:03:07
 */
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Установка нового пароля
          </h2>
        </div>
        <ResetPasswordForm token={resolvedParams.token} />
      </div>
    </div>
  );
}