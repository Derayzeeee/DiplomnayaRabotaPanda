import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { field, value } = await request.json();

    if (!field || !value) {
      return NextResponse.json(
        { error: 'Отсутствуют необходимые параметры' },
        { status: 400 }
      );
    }

    const query = { [field]: value };
    const exists = await User.findOne(query);

    return NextResponse.json({ exists: !!exists });
  } catch (error) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке доступности' },
      { status: 500 }
    );
  }
}