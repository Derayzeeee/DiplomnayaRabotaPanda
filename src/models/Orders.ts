import mongoose, { Document, Schema } from 'mongoose';
import type { CartItem } from '@/types/cart';

export interface IOrder extends Document {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: String,
    required: true,
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    image: { type: String, required: true },
    size: { type: String, required: true },
    color: {
      name: { type: String, required: true },
      code: { type: String, required: true }
    },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;