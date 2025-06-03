import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromToken } from '@/lib/auth';
import type { CartItem } from '@/types/cart';

export const dynamic = 'force-dynamic';


async function checkProductStock(productId: string, requestedQuantity: number): Promise<{
  hasStock: boolean;
  availableQuantity: number;
}> {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return {
    hasStock: product.stockQuantity >= requestedQuantity,
    availableQuantity: product.stockQuantity
  };
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userData = getUserFromToken(req);
    if (!userData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let cart = await Cart.findOne({ userId: userData.userId });
    
    if (!cart) {
      cart = new Cart({ userId: userData.userId, items: [] });
      await cart.save();
    }

    const response = NextResponse.json(cart);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userData = getUserFromToken(req);
    if (!userData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItem: CartItem = await req.json();

    // Проверяем наличие товара на складе
    const { hasStock, availableQuantity } = await checkProductStock(
      cartItem.productId,
      cartItem.quantity
    );

    if (!hasStock) {
      return NextResponse.json({
        error: 'Недостаточно товара на складе',
        availableQuantity
      }, { status: 400 });
    }

    if (!cartItem.oldPrice) {
      delete cartItem.oldPrice;
    }

    let cart = await Cart.findOne({ userId: userData.userId });
    if (!cart) {
      cart = new Cart({ userId: userData.userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: CartItem) => 
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color.code === cartItem.color.code
    );

    // Проверяем общее количество с учетом существующих товаров в корзине
    if (existingItemIndex > -1) {
      const newTotalQuantity = cart.items[existingItemIndex].quantity + cartItem.quantity;
      const { hasStock, availableQuantity } = await checkProductStock(
        cartItem.productId,
        newTotalQuantity
      );

      if (!hasStock) {
        return NextResponse.json({
          error: 'Превышено доступное количество товара',
          availableQuantity,
          currentCartQuantity: cart.items[existingItemIndex].quantity
        }, { status: 400 });
      }

      cart.items[existingItemIndex].quantity = newTotalQuantity;
    } else {
      cart.items.push(cartItem);
    }

    await cart.save();

    const response = NextResponse.json(cart);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const userData = getUserFromToken(req);
    if (!userData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, size, color, quantity } = await req.json();

    // Проверяем наличие товара на складе
    const { hasStock, availableQuantity } = await checkProductStock(
      productId,
      quantity
    );

    if (!hasStock) {
      return NextResponse.json({
        error: 'Недостаточно товара на складе',
        availableQuantity
      }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId: userData.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex((item: CartItem) => 
      item.productId === productId &&
      item.size === size &&
      item.color.code === color.code
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const response = NextResponse.json(cart);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Failed to update cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const userData = getUserFromToken(req);
    if (!userData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, size, color } = await req.json();

    const cart = await Cart.findOne({ userId: userData.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter((item: CartItem) => 
      !(item.productId === productId &&
        item.size === size &&
        item.color.code === color.code)
    );

    await cart.save();

    const response = NextResponse.json(cart);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}