import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const verified = jwt.verify(token.value, JWT_SECRET);
    
    return NextResponse.json({ 
      isAuthenticated: !!verified,
      user: verified 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false,
      error: 'Invalid token' 
    });
  }
}