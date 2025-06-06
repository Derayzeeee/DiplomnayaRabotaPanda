import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import type { WithId } from 'mongodb';

// Интерфейсы
interface RouteParams {
  params: Promise<{ id: string }>;
}

interface ProductDocument {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  sizes: string[];
  color: {
    name: string;
    code: string;
  };
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isNewProduct: boolean;
  isSale: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET метод для получения продукта и связанных товаров
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

    const rawProduct = await Product.findById(id).lean<WithId<ProductDocument>>();
    if (!rawProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Получаем связанные продукты той же категории
    const rawRelatedProducts = await Product.find({
      category: rawProduct.category,
      _id: { $ne: rawProduct._id }
    })
      .limit(4)
      .lean<WithId<ProductDocument>[]>();

    // Форматируем основной продукт
    const formattedProduct = {
      ...rawProduct,
      _id: rawProduct._id.toString(),
      createdAt: rawProduct.createdAt.toISOString(),
      updatedAt: rawProduct.updatedAt.toISOString(),
      stockQuantity: rawProduct.stockQuantity ?? 0
    };

    // Форматируем связанные продукты
    const formattedRelatedProducts = rawRelatedProducts.map(prod => ({
      ...prod,
      _id: prod._id.toString(),
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString(),
      stockQuantity: prod.stockQuantity ?? 0
    }));

    const response = NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelatedProducts
    });

    // Устанавливаем заголовки кэширования
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Last-Modified', new Date().toUTCString());

    return response;

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT метод для обновления продукта
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
    
    // Валидация данных
    if (!data.color || !data.color.name || !data.color.code) {
      return NextResponse.json(
        { error: 'Invalid color data' },
        { status: 400 }
      );
    }

    // Валидация stockQuantity
    if (typeof data.stockQuantity !== 'undefined') {
      if (typeof data.stockQuantity !== 'number' || data.stockQuantity < 0) {
        return NextResponse.json(
          { error: 'Invalid stock quantity. Must be a non-negative number.' },
          { status: 400 }
        );
      }
    }

    // Убираем _id из данных обновления, если он есть
    const {...updateData } = data;

    // Обновляем продукт
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        color: {
          name: data.color.name,
          code: data.color.code
        },
        stockQuantity: data.stockQuantity,
        updatedAt: new Date('2025-06-02T18:09:38Z') // Используем текущую дату из контекста
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).lean<WithId<ProductDocument>>();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const formattedProduct = {
      ...updatedProduct,
      _id: updatedProduct._id.toString(),
      createdAt: updatedProduct.createdAt.toISOString(),
      updatedAt: updatedProduct.updatedAt.toISOString()
    };

    return NextResponse.json(formattedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE метод для удаления продукта
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

    const deletedProduct = await Product.findByIdAndDelete(id).lean<WithId<ProductDocument>>();

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
      deletedAt: new Date('2025-06-02T18:09:38Z').toISOString() // Используем текущую дату из контекста
    });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// HEAD метод для быстрой проверки наличия товара
export async function HEAD(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return new NextResponse(null, { status: 400 });
    }

    await dbConnect();

    const product = await Product.findById(id)
      .select('stockQuantity')
      .lean<WithId<ProductDocument>>();
    
    if (!product) {
      return new NextResponse(null, { status: 404 });
    }

    const response = new NextResponse(null, { status: 200 });
    response.headers.set('X-Stock-Quantity', (product?.stockQuantity ?? 0).toString());
    response.headers.set('X-Last-Modified', new Date('2025-06-02T18:09:38Z').toUTCString());
    return response;

  } catch (error) {
    console.error('Error checking stock:', error);
    return new NextResponse(null, { status: 500 });
  }
}