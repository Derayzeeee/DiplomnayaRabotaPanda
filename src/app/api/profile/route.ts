import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const verified = jwt.verify(token.value, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    return NextResponse.json({
      user: {
        userId: verified.userId,
        email: verified.email,
        role: verified.role
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 401 }
    );
  }
}