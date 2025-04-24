'use client';

import { useState } from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelect?: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  const [selected, setSelected] = useState(selectedSize);

  const handleSelect = (size: string) => {
    setSelected(size);
    onSelect?.(size);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900">Размер</h3>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSelect(size)}
            className={`
              py-2 text-sm font-medium rounded-md
              ${selected === size
                ? 'bg-black text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}