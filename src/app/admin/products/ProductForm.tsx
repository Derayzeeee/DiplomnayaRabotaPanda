'use client';

import { useState, useEffect } from 'react';
import type { ProductWithId } from '@/types/product';

interface ProductFormProps {
  initialData?: ProductWithId;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [colors, setColors] = useState<Array<{ name: string; code: string }>>([]);
  const [newColor, setNewColor] = useState({ name: '', code: '' });
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSale, setIsSale] = useState(initialData?.isSale || false);
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [oldPrice, setOldPrice] = useState(initialData?.oldPrice?.toString() || '');

  useEffect(() => {
    if (initialData?.colors) {
      setColors(initialData.colors);
    }
  }, [initialData]);

  const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsSale(isChecked);
    
    if (isChecked) {
      setOldPrice(price);
      setPrice('');
    } else {
      if (oldPrice) {
        setPrice(oldPrice);
      }
      setOldPrice('');
    }
  };

  // Добавляем обработчик изменения цены
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Проверяем, что значение является положительным числом
    if (!value || value.match(/^\d*\.?\d*$/)) {
      setPrice(value);
    }
  };

  const handleAddColor = () => {
    if (newColor.name && newColor.code) {
      setColors([...colors, newColor]);
      setNewColor({ name: '', code: '' });
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Добавляем обработчик удаления изображения
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      setUploadProgress(0);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          throw new Error('Пожалуйста, загружайте только изображения');
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Размер изображения должен быть меньше 5MB');
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки изображения');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setUploadedImages(prevImages => [...prevImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert(error instanceof Error ? error.message : 'Не удалось загрузить изображения');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(price),
      oldPrice: isSale ? Number(oldPrice) : undefined,
      category: formData.get('category'),
      colors: colors,
      sizes: formData.getAll('sizes'),
      images: uploadedImages,
      isNewProduct: formData.get('isNewProduct') === 'true',
      isSale: isSale,
      inStock: true
    };

    try {
      await onSubmit(productData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ошибка при сохранении товара');
    }
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isNewProduct"
              defaultChecked={initialData?.isNewProduct}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Новый товар</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isSale"
              checked={isSale}
              onChange={handleSaleChange}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Распродажа</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          {isSale ? 'Новая цена' : 'Цена'}
        </label>
        <input
          type="number"
          name="price"
          id="price"
          required
          min="0"
          step="0.01"
          value={price}
          onChange={handlePriceChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        />
      </div>

      {isSale && (
        <div>
          <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
            Старая цена
          </label>
          <input
            type="number"
            name="oldPrice"
            id="oldPrice"
            disabled
            value={oldPrice}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          />
        </div>
      )}

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
                className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-200"
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
        <label className="block text-sm font-medium text-gray-700">
          Изображения
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="mt-1 block w-full"
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-black rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-4 gap-2">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Товар ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
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