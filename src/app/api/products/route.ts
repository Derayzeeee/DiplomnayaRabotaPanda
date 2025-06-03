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
    const colors = searchParams.get('colors')?.split(',').filter(Boolean); // Фильтруем пустые значения
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean);
    const isAdminRequest = searchParams.get('isAdmin') === 'true';
    const searchQuery = searchParams.get('query');
    
    let query: any = {};
    
    if (isAdminRequest) {
      const adminCheck = await checkAdminAccess(request);
      if (adminCheck) return adminCheck;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ];

      const user = await getUserFromToken(request);
      console.log(`[2025-06-03 07:31:59] Search query by Derayzeeee: "${searchQuery}"`);
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Исправляем фильтрацию по цвету
    if (colors?.length) {
      // Используем код цвета для фильтрации
      query['color.code'] = { $in: colors };
      console.log(`[2025-06-03 07:31:59] Filtering by colors:`, colors);
    }
    
    if (sizes?.length) {
      query.sizes = { $in: sizes };
    }

    // Добавляем логирование запроса для отладки
    console.log(`[2025-06-03 07:31:59] Query:`, JSON.stringify(query, null, 2));

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Логируем результаты
    console.log(`[2025-06-03 07:31:59] Found ${products.length} products`);

    if (searchQuery) {
      return NextResponse.json({
        products,
        meta: {
          total: totalCount,
          query: searchQuery,
          timestamp: '2025-06-03 07:31:59'
        }
      });
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('[2025-06-03 07:31:59] Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(request);
    if (adminCheck) return adminCheck;

    await dbConnect();
    
    const body = await request.json();
    const { _id, ...productData } = body;
    
    // Добавляем автоматическое вычисление inStock
    const stockQuantity = Number(productData.stockQuantity);
    const product = await Product.create({
      ...productData,
      stockQuantity,
      inStock: stockQuantity > 0,
      createdAt: new Date('2025-06-03 06:23:00'),
      updatedAt: new Date('2025-06-03 06:23:00')
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
    console.log('Updating product with data:', body);

    const stockQuantity = Number(body.stockQuantity);
    const updateData = {
      ...body,
      stockQuantity,
      inStock: stockQuantity > 0,
      lowStockThreshold: Number(body.lowStockThreshold),
      updatedAt: new Date('2025-06-03 06:23:00')
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
    
    console.log('Updated product:', updatedProduct);
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
    
    return NextResponse.json({ 
      message: 'Product deleted successfully',
      deletedAt: '2025-06-03 06:23:00'
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}