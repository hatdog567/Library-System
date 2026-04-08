import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const key = new TextEncoder().encode(secretKey)

const protectedRoutes = ['/dashboard']
const authRoutes = ['/']

export async function middleware(request) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  
  const sessionCookie = request.cookies.get('session')?.value
  console.log('[v0] Middleware - path:', path, 'has session cookie:', !!sessionCookie)

  // Verify session
  let session = null
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, key, {
        algorithms: ['HS256'],
      })
      session = payload
    } catch (error) {
      // Invalid token
      session = null
    }
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    console.log('[v0] Middleware - redirecting to / (no valid session)')
    return NextResponse.redirect(new URL('/', request.url))
  }
  console.log('[v0] Middleware - allowing access, session valid:', !!session)

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
