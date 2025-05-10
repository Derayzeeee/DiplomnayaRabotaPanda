import mongoose from 'mongoose';
import { CATEGORIES, SIZES, HEIGHTS } from '@/constants/filters';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  images: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'At least one image is required']
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES
  },
  sizes: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'At least one size is required'],
    enum: SIZES
  },
  heights: {
    type: [String],
    enum: HEIGHTS,
    default: undefined
  },
  colors: {
    type: [{
      name: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      }
    }],
    required: true,
    validate: [(val: Array<{ name: string; code: string }>) => val.length > 0, 'At least one color is required']
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware для автоматического обновления oldPrice
productSchema.pre('save', function(next) {
  if (this.isModified('isSale')) {
    if (this.isSale && !this.oldPrice) {
      this.oldPrice = this.price;
    } else if (!this.isSale) {
      this.oldPrice = undefined;
    }
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);