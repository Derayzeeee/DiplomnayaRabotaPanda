import mongoose, { Model } from 'mongoose';
import type { ProductDocument } from '@/types/product';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: false,
  },
  images: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: true,
  },
  sizes: [{
    type: String,
    required: true,
  }],
  colors: [{
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    }
  }],
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    required: false
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

const Product = (mongoose.models.Product || mongoose.model<ProductDocument>('Product', productSchema)) as Model<ProductDocument>;

export default Product;