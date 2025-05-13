import mongoose, { Document, Schema } from 'mongoose';
import type { Color } from '@/types/product';

interface ICartItem {
  productId: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  size: string;
  color: Color;
  quantity: number;
}

interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  updatedAt: Date;
  calculateTotal: () => void;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  oldPrice: {
    type: Number
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new Schema<ICart>({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Метод для подсчета общей суммы
cartSchema.methods.calculateTotal = function(this: ICart): void {
  this.totalAmount = this.items.reduce((total: number, item: ICartItem) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Пре-сохранение для обновления общей суммы
cartSchema.pre('save', function(this: ICart, next: () => void) {
  this.calculateTotal();
  this.updatedAt = new Date();
  next();
});

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);

export default Cart;