import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

// Specify protected and public routes
const protectedRoutes = ['/admin', '/client']
const publicRoutes = ['/login']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
...
  return NextResponse.next()
}

export default middleware;

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
