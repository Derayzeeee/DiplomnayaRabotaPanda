import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { email, password, name } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Все поля должны быть заполнены' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { name }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email или именем уже существует' },
        { status: 400 }
      );
    }

    const user = await User.create({
      email,
      password,
      name,
      role: 'user',
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Регистрация успешна',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}