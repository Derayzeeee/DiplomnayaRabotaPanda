import { Types } from 'mongoose';

export interface Color {
  name: string;
  code: string;
}

export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  sizes: string[];
  heights: string[];
  color: Color;
  images: string[];
  isNewProduct?: boolean;
  isSale?: boolean;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}


export interface MongoProduct {
  _id: Types.ObjectId;
  isFavorite?: boolean;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  color: { name: string; code: string };
  isNewProduct: boolean;
  isSale: boolean;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Product {
  id: string;
  isFavorite?: boolean;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | undefined;
  category: string;
  sizes: string[];
  heights?: string[];
  color: Color;
  images: string[];
  isNewProduct?: boolean;
  isSale?: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithId extends Product {
  _id: string;
  isFavorite?: boolean;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  sizes: string[];
  heights?: string[];
  color: { name: string; code: string };
  images: string[];
  isNewProduct: boolean;
  isSale: boolean;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock?: boolean;
  createdAt: string;
  updatedAt: string;
  salePrice: string;
}

export interface ProductWithStock extends Product {
  inStock: boolean;
}
