'use client';

import type { Color } from '@/types/product';

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: Color | null;
  onSelect: (color: Color) => void;
}

export default function ColorSelector({ 
  colors, 
  selectedColor, 
  onSelect 
}: ColorSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900">Цвет</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.code}
            onClick={() => onSelect(color)}
            className={`
              w-8 h-8 rounded-full
              ${selectedColor?.code === color.code 
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
              boxShadow: (color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white')
                ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
                : 'none'
            }}
            title={color.name}
            aria-label={`Выбрать цвет: ${color.name}`}
            type="button"
          >
            {selectedColor?.code === color.code && (
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
                  aria-hidden="true"
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
          Выбран: {selectedColor.name}
        </p>
      )}
    </div>
  );
}