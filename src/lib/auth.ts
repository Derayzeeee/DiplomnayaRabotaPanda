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

// Функция для получения данных из токена
export async function getTokenData(requiredRole?: 'admin' | 'user'): Promise<JWTPayload | null> {
  try {
    const requestCookies = new Request('http://localhost').headers;
    const cookieStore = new Headers(requestCookies).get('cookie');
    
    if (!cookieStore) {
      return null;
    }

    const cookies = cookieStore.split(';').reduce((acc: { [key: string]: string }, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    const token = cookies['token'];

    if (!token) {
      return null;
    }

    const userData = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Проверка роли, если она указана
    if (requiredRole && userData.role !== requiredRole) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error getting token data:', error);
    return null;
  }
}

// Функция для получения пользователя из токена
export function getUserFromToken(request: NextRequest, requiredRole?: 'admin' | 'user'): JWTPayload | null {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const userData = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Проверка роли, если она указана
    if (requiredRole && userData.role !== requiredRole) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// Функция для выхода из системы
export function logout(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('token');
  return response;
}

// Функция для проверки аутентификации
export async function isAuthenticated(): Promise<boolean> {
  const userData = await getTokenData();
  return userData !== null;
}

// Функция для проверки прав администратора
export async function isAdmin(): Promise<boolean> {
  const userData = await getTokenData();
  return userData?.role === 'admin';
}

// Функция для проверки прав администратора из запроса
export function isAdminFromRequest(request: NextRequest): boolean {
  const userData = getUserFromToken(request);
  return userData?.role === 'admin';
}

// Middleware для проверки прав администратора
export async function checkAdminAccess(request: NextRequest): Promise<NextResponse | null> {
  const userData = getUserFromToken(request);
  
  if (!userData || userData.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return null;
}

// Функция для создания JWT токена
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Токен действителен 7 дней
  });
}

// Функция для установки токена в куки
export function setTokenCookie(token: string): NextResponse {
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 дней в секундах
  });
  return response;
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

// Функция для валидации роли пользователя
export function validateUserRole(role: string): role is 'admin' | 'user' {
  return role === 'admin' || role === 'user';
}

// Функция для обновления токена
export function refreshToken(currentToken: string): string | null {
  try {
    const decoded = jwt.verify(currentToken, JWT_SECRET) as JWTPayload;
    
    // Проверяем, не истекает ли токен в ближайшие 24 часа
    const expirationDate = (decoded.exp || 0) * 1000;
    const twentyFourHoursFromNow = Date.now() + 24 * 60 * 60 * 1000;
    
    if (expirationDate - Date.now() < twentyFourHoursFromNow) {
      // Создаем новый токен с тем же payload
      const newToken = createToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      });
      
      return newToken;
    }
    
    return null; // Токен еще действителен
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Функция для проверки срока действия токена
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return (decoded.exp || 0) < currentTime;
  } catch (error) {
    return true; // В случае ошибки считаем токен просроченным
  }
}

