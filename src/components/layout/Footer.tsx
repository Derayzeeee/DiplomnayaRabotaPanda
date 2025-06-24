'use client';

import Link from 'next/link';
import SizeChart from '../common/SizeChart';
import SocialLinksDialog from '../common/SocialLinksDialog';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" >
        <div className="py-16 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl justify-items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">О магазине</h3>
              <ul className="mt-4 space-y-3 text-center">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Контакты
                  </Link>
                </li>
                <li>
                  <SocialLinksDialog />
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Покупателям</h3>
              <ul className="mt-4 space-y-3 text-center">
                <li>
                  <Link href="/delivery" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Доставка
                  </Link>
                </li>
                <li>
                  <Link href="/return" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Возврат
                  </Link>
                </li>
                <li>
                  <SizeChart />
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Мой аккаунт</h3>
              <ul className="mt-4 space-y-3 text-center">
                <li>
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Профиль
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Корзина
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Избранное
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 py-8">
          <p className="text-sm text-gray-600 text-center">
            © 2025 PandaStore. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}