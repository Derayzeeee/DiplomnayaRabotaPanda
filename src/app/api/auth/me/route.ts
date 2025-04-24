import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import { getTokenData } from '@/lib/auth';

interface JWTPayload {
  userId: string;  // Убедитесь, что это точно совпадает с тем, что вы сохраняете в токене
  email: string;
  role: string;
}

export async function GET() {
  try {
    const tokenData = await getTokenData() as JWTPayload;
    
    if (!tokenData || !tokenData.userId) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const user = await User.findById(tokenData.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}