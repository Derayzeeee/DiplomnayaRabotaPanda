import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Order from '@/models/Orders';
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

    const order = await Order.create({
      userId: userData.userId,
      items,
      totalAmount,
      shippingAddress,
    });

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