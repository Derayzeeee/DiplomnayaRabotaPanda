import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import { ResetToken } from '@/models/ResetToken';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { token, newPassword } = await request.json();

    const resetToken = await ResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Недействительный или просроченный токен' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: resetToken.email },
      { password: hashedPassword }
    );

    await ResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
}