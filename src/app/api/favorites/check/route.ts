import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/models/Favorite';
import { getUserFromToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productIds } = await req.json();
    
    if (!Array.isArray(productIds)) {
      const isFavorite = await Favorite.exists({
        userId: user.email,
        productId: productIds
      });
      return NextResponse.json({ isFavorite: !!isFavorite });
    }

    const favorites = await Favorite.find({
      userId: user.email,
      productId: { $in: productIds }
    });

    const favoriteMap = productIds.reduce((acc, id) => {
      acc[id] = favorites.some(f => f.productId.toString() === id);
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json(favoriteMap);
  } catch (error) {
    console.error('Failed to check favorites:', error);
    return NextResponse.json({ error: 'Failed to check favorites' }, { status: 500 });
  }
}