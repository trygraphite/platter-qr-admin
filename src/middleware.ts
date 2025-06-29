import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routes } from './lib/routes'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL(routes.logout, request.url))
  }
}

export const config = {
  matcher: [],
}
