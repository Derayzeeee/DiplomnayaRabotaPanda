import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Заменяем прямое использование cookies() на RequestCookies
export async function getTokenData(): Promise<JWTPayload | null> {
  try {
    // Создаем новый экземпляр RequestCookies
    const requestCookies = new Request('http://localhost').headers;
    const cookieStore = new Headers(requestCookies).get('cookie');
    
    if (!cookieStore) {
      return null;
    }

    // Парсим куки вручную
    const cookies = cookieStore.split(';').reduce((acc: { [key: string]: string }, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    const token = cookies['token'];

    if (!token) {
      return null;
    }

    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Error getting token data:', error);
    return null;
  }
}

export function getUserFromToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

export function logout(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('token');
  return response;
}

// Вспомогательная функция для проверки аутентификации
export async function isAuthenticated(): Promise<boolean> {
  const userData = await getTokenData();
  return userData !== null;
}

// Вспомогательная функция для получения cookies из request
export function getCookiesFromRequest(request: Request): { [key: string]: string } {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((acc: { [key: string]: string }, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
}