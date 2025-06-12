import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Order from '@/models/Orders';
import Product from '@/models/Product';
import { getUserFromToken } from '@/lib/auth';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userData = getUserFromToken(request);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { items, totalAmount, shippingAddress } = await request.json();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { error: `Товар ${item.name} не найден` },
          { status: 404 }
        );
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Недостаточное количество товара "${item.name}" на складе. Доступно: ${product.stockQuantity}` },
          { status: 400 }
        );
      }
    }

    const order = await Order.create({
      userId: userData.userId,
      items,
      totalAmount,
      shippingAddress,
    });

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
        product.inStock = product.stockQuantity > 0;
        await product.save();
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userData = getUserFromToken(request);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const orders = await Order.find({ userId: userData.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}