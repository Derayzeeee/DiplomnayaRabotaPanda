import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    const products = await Product.find({ isSale: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch sale products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sale products' },
      { status: 500 }
    );
  }
}