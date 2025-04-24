import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';

export async function GET() {
  try {
    const mongoose = await dbConnect();
    return NextResponse.json({ status: 'Connected to MongoDB' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
}