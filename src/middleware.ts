// middleware.ts - Middleware actualizado
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl
  
  // Extraer el subdominio
  const hostParts = hostname.split('.')
  const subdomain = hostParts[0]
  
  // Solo procesar si hay un subdominio y no es 'www'
  if (hostParts.length > 2 && subdomain !== 'www') {
    
    // Si la ruta es /admin, manejar la autenticación en el cliente
    if (pathname.startsWith('/admin')) {
      
      // Verificar si hay token en las cookies
      const token = request.cookies.get('access_token')?.value
      
      // Si no hay token, redirigir a login con callback
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        loginUrl.searchParams.set('subdomain', subdomain)
        return NextResponse.redirect(loginUrl)
      }
      
      // Si hay token, verificar que sea válido (opcional: hacer request a API)
      // Por ahora, dejamos que el cliente maneje la validación
      
      // Añadir headers para que el cliente sepa el subdominio
      const response = NextResponse.rewrite(
        new URL(`/dashboard${pathname.replace('/admin', '')}`, request.url)
      )
      
      response.headers.set('x-subdomain', subdomain)
      response.headers.set('x-original-path', pathname)
      
      return response
    }
    
    // Para otras rutas del subdominio, servir el sitio público
    if (!pathname.startsWith('/api') && 
        !pathname.startsWith('/_next') && 
        !pathname.startsWith('/static')) {
      
      const rewriteUrl = new URL(`/site/${subdomain}${pathname}`, request.url)
      const response = NextResponse.rewrite(rewriteUrl)
      
      // Añadir header del subdominio para el sitio público también
      response.headers.set('x-subdomain', subdomain)
      
      return response
    }
  }
  
  // Para el dominio principal, manejar rutas especiales
  if (pathname.startsWith('/admin') && hostParts.length <= 2) {
    // Si acceden a /admin desde el dominio principal, redirigir al login
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Para todas las demás rutas, continuar normalmente
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
     * - public folder
     * - manifest.json, robots.txt, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|manifest.json|robots.txt|sitemap.xml).*)',
  ],
}