import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { currentPassword, newPassword } = await request.json();

    // Получаем JWT токен из куки
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Декодируем JWT токен для получения email пользователя
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf-8'));
    const userEmail = payload.email;

    // Находим пользователя и явно запрашиваем поле password
    const user = await User.findOne({ email: userEmail }).select('+password');
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Пользователь не найден или отсутствует пароль' },
        { status: 404 }
      );
    }

    // Проверяем текущий пароль
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Текущий пароль введен неверно' }, // Более понятное сообщение об ошибке
        { status: 400 }
      );
    }

    // Проверяем, что новый пароль отличается от текущего
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'Новый пароль должен отличаться от текущего' },
        { status: 400 }
      );
    }

    // Хешируем и сохраняем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: userEmail },
      { password: hashedPassword }
    );

    return NextResponse.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при изменении пароля' },
      { status: 500 }
    );
  }
}