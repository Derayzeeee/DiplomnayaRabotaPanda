import { Types } from 'mongoose';

export interface Color {
  name: string;
  code: string;
}

export interface MongoProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: Array<{ name: string; code: string }>;
  isNewProduct: boolean;
  isSale: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number; // Версия документа, добавляемая MongoDB
}


export interface Product {
  name: string;
  description: string;
  price: number;
  oldPrice?: number | undefined;
  category: string;
  sizes: string[];
  colors: Color[];
  images: string[];
  isNewProduct?: boolean;
  isSale?: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithId extends Product {
  _id: string;
  isFavorite?: boolean;
}