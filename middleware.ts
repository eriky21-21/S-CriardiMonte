// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Verifica o cookie de autenticação
  const isAuthenticated = req.cookies.get('authenticated')?.value === 'true'
  
  // Se não está autenticado e não está na página inicial
  if (!isAuthenticated && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // Se está autenticado e está na página inicial, redireciona para dashboard
  if (isAuthenticated && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
