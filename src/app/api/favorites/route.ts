import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/models/Favorite';
import Product from '@/models/Product';
import { getUserFromToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await Favorite.find({ userId: user.email })
      .populate('productId')
      .lean();

    // Фильтруем записи с null productId и преобразуем остальные
    const products = favorites
      .filter(fav => fav.productId && fav.productId._id) // добавляем проверку
      .map(fav => ({
        ...fav.productId,
        _id: fav.productId._id.toString(),
        isFavorite: true
      }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Проверяем существование продукта перед добавлением в избранное
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Проверяем существующее избранное
    const existingFavorite = await Favorite.findOne({
      userId: user.email,
      productId
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: true, message: 'Already in favorites' },
        { status: 200 }
      );
    }

    // Создаем новую запись в избранном
    const favorite = await Favorite.create({
      userId: user.email,
      productId
    });

    await favorite.populate('productId'); // Добавляем populate при создании

    return NextResponse.json(
      { 
        success: true, 
        favorite: {
          ...favorite.toObject(),
          productId: {
            ...favorite.productId.toObject(),
            _id: favorite.productId._id.toString()
          }
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to add to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const result = await Favorite.findOneAndDelete({
      userId: user.email,
      productId
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Removed from favorites' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to remove from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}