import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import dbConnect from '@/lib/db/mongoose';

export async function GET() {
  try {
    await dbConnect();

    const randomProducts = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          id: '$_id',
          name: 1,
          price: 1,
          images: 1,
          status: 1
        }
      }
    ]);

    const products = randomProducts.map(product => ({
      ...product,
      id: product._id.toString()
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching random products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random products' },
      { status: 500 }
    );
  }
}