import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Массив защищенных путей
const protectedRoutes = ['/profile', '/orders', '/wishlist'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Проверяем, является ли текущий путь защищенным
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Если путь защищен и нет токена, перенаправляем на страницу входа
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Если есть токен и пользователь пытается зайти на страницу входа/регистрации
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};