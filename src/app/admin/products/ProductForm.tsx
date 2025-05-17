'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { HexColorPicker } from 'react-colorful';
import type { ProductWithId } from '@/types/product';
import { CATEGORIES, SIZES, HEIGHTS, CATEGORIES_WITH_HEIGHT } from '@/constants/filters';

interface ProductFormProps {
  initialData?: ProductWithId;
  onSubmit: (data: ProductWithId) => Promise<void>;
  loading?: boolean;
}

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [uploadingStatus, setUploadingStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: boolean }>(
    SIZES.reduce((acc, size) => ({
      ...acc,
      [size]: initialData?.sizes?.includes(size) || false
    }), {})
  );
  const [selectedHeights, setSelectedHeights] = useState<{ [key: string]: boolean }>(
    HEIGHTS.reduce((acc, height) => ({
      ...acc,
      [height]: initialData?.heights?.includes(height) || false
    }), {})
  );

  // Новый state для ОДНОГО цвета!
  const [color, setColor] = useState<{ name: string; code: string }>(
    initialData?.color || { name: '', code: '#000000' }
  );
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { register, handleSubmit, setValue, watch, reset } = useForm<ProductWithId>({
    defaultValues: initialData || {
      _id: '',
      name: '',
      description: '',
      price: 0,
      oldPrice: 0,
      category: '',
      sizes: [],
      heights: [],
      color: { name: '', code: '#000000' },
      images: [],
      isNewProduct: false,
      isSale: false,
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      salePrice: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setColor(initialData.color || { name: '', code: '#000000' });
      setImages(initialData.images || []);
      setSelectedSizes(
        SIZES.reduce((acc, size) => ({
          ...acc,
          [size]: initialData.sizes?.includes(size) || false
        }), {})
      );
      setSelectedHeights(
        HEIGHTS.reduce((acc, height) => ({
          ...acc,
          [height]: initialData.heights?.includes(height) || false
        }), {})
      );
    }
  }, [initialData, reset]);

  const selectedCategory = watch('category');
  const showHeightField = CATEGORIES_WITH_HEIGHT.includes(selectedCategory);
  const isSale = watch('isSale');

  useEffect(() => {
    setValue('color', color);
    setValue('images', images);
  }, [color, images, setValue]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingStatus('uploading');
    setUploadProgress(0);

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setUploadProgress((prev) => prev + (100 / files.length));
        return data.url;
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadingStatus('error');
        return null;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);
      setImages((prev) => [...prev, ...validUrls]);
      setUploadingStatus('idle');
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      setUploadingStatus('error');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSizesSubmit = () => {
    const selectedSizesList = Object.entries(selectedSizes)
      .filter(([_, isSelected]) => isSelected)
      .map(([size]) => size);
    setValue('sizes', selectedSizesList);
  };

  const handleHeightsSubmit = () => {
    const selectedHeightsList = Object.entries(selectedHeights)
      .filter(([_, isSelected]) => isSelected)
      .map(([height]) => height);
    setValue('heights', selectedHeightsList);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [size]: !prev[size]
    }));
  };

  const toggleHeight = (height: string) => {
    setSelectedHeights(prev => ({
      ...prev,
      [height]: !prev[height]
    }));
  };

  // Новый submit: color вместо colors
  const onFormSubmit = (data: any) => {
    handleSizesSubmit();
    handleHeightsSubmit();
    setValue('images', images);
    setValue('color', color);

    // При создании нового товара удаляем _id
    if (!initialData) {
      const { _id, ...submitData } = data;
      onSubmit(submitData);
    } else {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Основные данные */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Название
          </label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            {...register('description', { required: true })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Категория
          </label>
          <select
            {...register('category', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            <option value="">Выберите категорию</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Цена
            </label>
            <input
              type="number"
              {...register('price', { 
                required: true, 
                min: 0,
                valueAsNumber: true
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>

          {isSale && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Старая цена
              </label>
              <input
                type="number"
                {...register('oldPrice', { 
                  min: 0,
                  valueAsNumber: true
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>
          )}
        </div>
      </div>

      {/* Размеры */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Размеры</h3>
        <div className="border rounded-md p-4">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {SIZES.map((size) => (
              <label key={size} className="flex items-center justify-between p-2 hover:bg-gray-50">
                <span>{size}</span>
                <input
                  type="checkbox"
                  checked={selectedSizes[size]}
                  onChange={() => toggleSize(size)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSizesSubmit}
            className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Применить размеры
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {watch('sizes')?.map((size) => (
            <span
              key={size}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
            >
              {size}
            </span>
          ))}
        </div>
      </div>

      {/* Рост */}
      {showHeightField && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Рост</h3>
          <div className="border rounded-md p-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {HEIGHTS.map((height) => (
                <label key={height} className="flex items-center justify-between p-2 hover:bg-gray-50">
                  <span>{height} см</span>
                  <input
                    type="checkbox"
                    checked={selectedHeights[height]}
                    onChange={() => toggleHeight(height)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleHeightsSubmit}
              className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Применить рост
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watch('heights')?.map((height) => (
              <span
                key={height}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
              >
                {height} см
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Цвета */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Цвет</h3>
        <div className="flex flex-col gap-2 max-w-xs">
          <input
            type="text"
            value={color.name}
            onChange={e => setColor({ ...color, name: e.target.value })}
            placeholder="Название цвета"
            className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
          {/* Палитра */}
          <HexColorPicker
            color={color.code}
            onChange={code => setColor({ ...color, code })}
            style={{ width: 200, height: 200 }}
          />
          <div className="flex items-center mt-2">
            <span
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: color.code }}
            />
            <span className="ml-2 text-sm">{color.code}</span>
          </div>
        </div>
      </div>

      {/* Изображения */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Изображения</h3>
        <div className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-black file:text-white
              hover:file:bg-gray-800"
          />
          {uploadingStatus === 'uploading' && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-black h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={image}
                alt=""
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Флажки */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isNewProduct')}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span>Новинка</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isSale')}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span>Скидка</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('inStock')}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span>В наличии</span>
          </label>
        </div>
      </div>

      {/* Кнопка отправки */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Сохранение...' : (initialData ? 'Обновить товар' : 'Создать товар')}
        </button>
      </div>
    </form>
  );
}