import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Cart from '@/models/Cart';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Cart.findOneAndUpdate(
      { userId: user.email },
      { items: [], totalAmount: 0 },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}