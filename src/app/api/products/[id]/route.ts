import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import type { MongoProduct } from '@/types/product';

// Общий интерфейс для параметров маршрута
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
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
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    // Проверяем данные цвета
    if (!data.color || !data.color.name || !data.color.code) {
      return NextResponse.json(
        { error: 'Invalid color data' },
        { status: 400 }
      );
    }

    // Убираем _id из данных обновления, если он есть
    const { _id, ...updateData } = data;

    // Обновляем продукт
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        color: {
          name: data.color.name,
          code: data.color.code
        },
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productObject = updatedProduct.toObject();
    productObject.id = productObject._id.toString();

    return NextResponse.json(productObject);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
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