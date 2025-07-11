import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routes } from './lib/routes'
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  accountType?: string;
  [key: string]: unknown;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Debug logging
  console.log('Middleware - Pathname:', pathname)
  console.log('Middleware - Token exists:', !!token)

  // Define auth routes that should redirect to home if user is already logged in
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/staff-login']
  
  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  console.log('Middleware - Is auth route:', isAuthRoute)

  // If user has token and is on auth route, redirect to home
  if (token && isAuthRoute) {
    console.log('Middleware - Redirecting to dashboard (has token, on auth route)')
    return NextResponse.redirect(new URL(routes.dashboard, request.url))
  }

  // If user doesn't have token and is not on auth route, redirect to login
  if (!token && !isAuthRoute) {
    console.log('Middleware - Redirecting to login (no token, not on auth route)')
    return NextResponse.redirect(new URL(routes.login, request.url))
  }

  // Staff restriction: Only allow /orders for staff
  if (token && pathname.startsWith('/')) {
    try {
      const decoded = jwtDecode(token) as DecodedToken;
      if (decoded && decoded.accountType === 'staff') {
        if (pathname !== '/orders' && pathname !== '/' && !isAuthRoute) {
          // Only allow /orders and root for staff
          return NextResponse.redirect(new URL('/orders', request.url));
        }
      }
    } catch (e) {
      // If token can't be decoded, allow request
      console.log('Could not decode token:', e);
    }
  }

  console.log('Middleware - Allowing request to continue')
  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
