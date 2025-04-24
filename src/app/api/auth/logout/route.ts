import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Успешный выход' });
  response.cookies.delete('token');
  
  return response;
}