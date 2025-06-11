'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface AdminSearchBarProps {
  isLoading?: boolean;
}

export default function AdminSearchBar({ isLoading = false }: AdminSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get('query') ?? ''
  );

  const debouncedSearch = useCallback((query: string) => {
  const handler = setTimeout(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 500);

  return () => clearTimeout(handler);
}, [pathname, searchParams, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Поиск товаров по названию..."
        className="w-full px-4 py-2 pr-10 border border-gray-600 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-black-500 
                 focus:border-transparent placeholder-gray-400"
        aria-label="Поиск товаров"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
        ) : (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}