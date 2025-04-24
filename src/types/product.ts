import { Document } from 'mongoose';

export interface Product {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: Array<{
    name: string;
    code: string;
  }>;
  isNewProduct: boolean;
  isSale: boolean;
  salePrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDocument extends Document, Omit<Product, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithId extends Product {
  _id: string;
}

export default Product;