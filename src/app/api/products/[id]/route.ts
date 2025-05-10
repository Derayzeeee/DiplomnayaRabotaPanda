import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import type { MongoProduct } from '@/types/product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const rawProduct = await Product.findById(id).lean();
    if (!rawProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = rawProduct as unknown as MongoProduct;

    // Получаем связанные продукты той же категории
    const rawRelatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .lean();

    const relatedProducts = rawRelatedProducts as unknown as MongoProduct[];

    // Форматируем основной продукт
    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };

    // Форматируем связанные продукты
    const formattedRelatedProducts = relatedProducts.map(prod => ({
      ...prod,
      _id: prod._id.toString(),
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString()
    }));

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelatedProducts
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await dbConnect();
    const data = await request.json();

    // Преобразование и валидация данных
    const updateData = {
      ...data,
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined
    };

    // Логика для обработки скидок
    if (updateData.isSale && !updateData.oldPrice) {
      updateData.oldPrice = updateData.price;
    }

    if (!updateData.isSale) {
      updateData.oldPrice = undefined;
    }

    const rawProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!rawProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = rawProduct as unknown as MongoProduct;

    // Форматируем обновленный продукт
    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const rawProduct = await Product.findByIdAndDelete(id).lean();

    if (!rawProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}