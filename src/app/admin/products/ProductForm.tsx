'use client';

import { useState, useEffect } from 'react';
import type { ProductWithId } from '@/types/product';

interface ProductFormProps {
  initialData?: ProductWithId;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
}

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [colors, setColors] = useState<Array<{ name: string; code: string }>>([]);
  const [newColor, setNewColor] = useState({ name: '', code: '' });

  useEffect(() => {
    if (initialData?.colors) {
      setColors(initialData.colors);
    }
  }, [initialData]);

  const handleAddColor = () => {
    if (newColor.name && newColor.code) {
      setColors([...colors, newColor]);
      setNewColor({ name: '', code: '' });
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('colors', JSON.stringify(colors));
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Название товара
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={initialData?.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          required
          defaultValue={initialData?.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Цена
        </label>
        <input
          type="number"
          name="price"
          id="price"
          required
          min="0"
          step="0.01"
          defaultValue={initialData?.price}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Категория
        </label>
        <select
          name="category"
          id="category"
          required
          defaultValue={initialData?.category}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        >
          <option value="">Выберите категорию</option>
          <option value="shoes">Обувь</option>
          <option value="clothes">Одежда</option>
          <option value="accessories">Аксессуары</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цвета</label>
        <div className="mt-2 space-y-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>{color.name}</span>
              <div 
                className="w-6 h-6 border border-gray-300 rounded"
                style={{ backgroundColor: color.code }}
              />
              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="text-red-600 hover:text-red-800"
              >
                Удалить
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Название цвета"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
            <input
              type="color"
              value={newColor.code}
              onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
              className="w-10 h-10"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Добавить цвет
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Размеры</label>
        <div className="mt-2 space-x-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <label key={size} className="inline-flex items-center">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                defaultChecked={initialData?.sizes?.includes(size)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="ml-2">{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Изображения
        </label>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          accept="image/*"
          className="mt-1 block w-full"
        />
        {initialData?.images && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {initialData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
      >
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  );
}