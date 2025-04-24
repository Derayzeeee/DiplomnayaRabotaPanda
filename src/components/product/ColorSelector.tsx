'use client';

import { useState } from 'react';

interface Color {
  name: string;
  code: string;
}

interface ColorSelectorProps {
  colors: Color[];
}

export default function ColorSelector({ colors }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900">Цвет</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.code}
            onClick={() => setSelectedColor(color.code)}
            className={`
              w-8 h-8 rounded-full
              ${selectedColor === color.code 
                ? 'ring-2 ring-gray-900' 
                : 'ring-1 ring-gray-200'
              }
              ${color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white'
                ? 'border border-gray-200' 
                : ''
              }
              relative
              transition-all
              hover:scale-110
              focus:outline-none
              focus:ring-2
              focus:ring-gray-900
            `}
            style={{ 
              backgroundColor: color.code,
              // Добавляем внутреннюю тень для белого цвета
              boxShadow: (color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white')
                ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
                : 'none'
            }}
            title={color.name}
            aria-label={`Выбрать цвет: ${color.name}`}
          >
            {selectedColor === color.code && (
              <span 
                className={`
                  absolute inset-0 rounded-full
                  flex items-center justify-center
                  ${(color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white')
                    ? 'text-gray-900'
                    : 'text-white'
                  }
                `}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="mt-2 text-sm text-gray-500">
          Выбран: {colors.find(c => c.code === selectedColor)?.name}
        </p>
      )}
    </div>
  );
}