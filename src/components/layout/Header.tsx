'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const AuthButton = () => {
    if (loading) {
      return (
        <div className="px-4 py-2 bg-gray-200 animate-pulse rounded">
          <span className="invisible">Загрузка</span>
        </div>
      );
    }

    return isAuthenticated ? (
      <Link 
        href="/profile" 
        className="px-4 py-1 bg-black text-white hover:bg-gray-800 transition-colors"
      >
        Профиль
      </Link>
    ) : (
      <Link 
        href="/login" 
        className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
      >
        Войти
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/5 backdrop-blur-md z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            PandaStore
          </Link>
          <div className="hidden md:flex items-center space-x-5">
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-black transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/new" 
              className="text-gray-700 hover:text-black transition-colors"
            >
              Новинки
            </Link>
            <Link 
              href="/sale" 
              className="text-gray-700 hover:text-black transition-colors"
            >
              Распродажа
            </Link>
            <Link 
                href="/favorites" 
                className="text-gray-700 hover:text-black transition-colors"
            >
              Избранное
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-700 hover:text-black transition-colors"
            >
              Корзина
            </Link>
            <AuthButton />
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span className={`block h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="pt-4 pb-3 space-y-3">
            <Link 
              href="/catalog" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/new" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Новинки
            </Link>
            <Link 
              href="/sale" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Распродажа
            </Link>
            <Link 
              href="/favorites" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Избранное
            </Link>
            <Link 
              href="/cart" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Корзина
            </Link>
            <div className="block">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;