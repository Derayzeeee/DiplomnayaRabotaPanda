import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Product from '@/models/Product';
import { checkAdminAccess, getUserFromToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const colors = searchParams.get('colors')?.split(',');
    const sizes = searchParams.get('sizes')?.split(',');
    const isAdminRequest = searchParams.get('isAdmin') === 'true';
    
    let query: any = {};
    
    // Если это запрос от админ-панели, проверяем права
    if (isAdminRequest) {
      const adminCheck = await checkAdminAccess(request);
      if (adminCheck) return adminCheck;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    if (colors?.length) {
      query['colors.code'] = { $in: colors };
    }
    
    if (sizes?.length) {
      query.sizes = { $in: sizes };
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверка прав администратора
    const adminCheck = await checkAdminAccess(request);
    if (adminCheck) return adminCheck;

    await dbConnect();
    
    const body = await request.json();
    
    // Удаляем _id из тела запроса, если он есть
    const { _id, ...productData } = body;
    
    // Создаем новый продукт
    const product = await Product.create({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Проверка прав администратора
    const adminCheck = await checkAdminAccess(request);
    if (adminCheck) return adminCheck;

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Updating product with data:', body); // Добавим для отладки

    // Убедимся, что stockQuantity и lowStockThreshold преобразованы в числа
    const updateData = {
      ...body,
      stockQuantity: Number(body.stockQuantity),
      lowStockThreshold: Number(body.lowStockThreshold),
      updatedAt: new Date()
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    console.log('Updated product:', updatedProduct); // Добавим для отладки
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Проверка прав администратора
    const adminCheck = await checkAdminAccess(request);
    if (adminCheck) return adminCheck;

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}