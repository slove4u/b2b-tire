import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

// Specify protected and public routes
const protectedRoutes = ['/admin', '/client']
const publicRoutes = ['/login']

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Check if current route is protected or public
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Decrypt session from cookie
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Role-based authorization for /admin
  if (path.startsWith('/admin') && session?.role !== 'ADMIN') {
    // If a non-admin tries to access admin, let them see a "Not Authorized" or redirect home
    return NextResponse.redirect(new URL('/client', req.nextUrl))
  }

  // Redirect to dashboard if the user is already authenticated
  if (isPublicRoute && session?.id) {
    if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
    return NextResponse.redirect(new URL('/client', req.nextUrl))
  }

  // Protect root path as well (redirect based on role)
  if (path === '/' && session?.id) {
     if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
    return NextResponse.redirect(new URL('/client', req.nextUrl))
  }
  
  if (path === '/' && !session?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}

export default proxy;

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
