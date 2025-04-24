'use client';

import Link from 'next/link';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/5 backdrop-blur-md z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            ClothingStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
              href="/login" 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Войти
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="pt-4 pb-3 space-y-3">
            <Link 
              href="/catalog" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/new-arrivals" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Новинки
            </Link>
            <Link 
              href="/sales" 
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Распродажа
            </Link>
            <Link 
              href="/login" 
              className="block px-4 py-2 bg-black text-white text-center rounded-md hover:bg-gray-800 transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;