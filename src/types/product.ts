export interface Product {
  name: string;
  description: string;
  price: number;
  oldPrice?: number | undefined;
  category: string;
  sizes: string[];
  colors: Array<{
    name: string;
    code: string;
  }>;
  images: string[];
  isNewProduct?: boolean;
  isSale?: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithId extends Product {
  _id: string;
}