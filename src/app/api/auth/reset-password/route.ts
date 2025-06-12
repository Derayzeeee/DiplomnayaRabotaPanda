import { NextRequest, NextResponse } from 'next/server';
import  dbConnect  from '@/lib/db/mongoose';
import  User  from '@/models/User';
import { ResetToken } from '@/models/ResetToken';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь с таким email не найден' },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');

    await ResetToken.create({
      email,
      token
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ 
      message: 'Инструкции по восстановлению отправлены на email' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
}