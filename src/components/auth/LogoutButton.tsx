'use client';

import { useAuth } from '@/context/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Выйти
    </button>
  );
}