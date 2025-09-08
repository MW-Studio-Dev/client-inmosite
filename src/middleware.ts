// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl
  
  // Extraer el subdominio
  const hostParts = hostname.split('.')
  const subdomain = hostParts[0]
  
  // Solo procesar si hay un subdominio y no es 'www'
  if (hostParts.length > 2 && subdomain !== 'www') {
    
    // Si la ruta es /admin, manejar la autenticación
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
      
      // CORRECCIÓN: Rewrite a la ruta correcta del dashboard
      // Extraer la ruta después de /admin
      const dashboardPath = pathname.replace('/admin', '') || '/'
      
      const response = NextResponse.rewrite(
        new URL(`/dashboard${dashboardPath}`, request.url)
      )
      
      response.headers.set('x-subdomain', subdomain)
      response.headers.set('x-original-path', pathname)
      
      return response
    }
    
    // CORRECCIÓN: Para otras rutas del subdominio, servir desde /website
    if (!pathname.startsWith('/api') && 
        !pathname.startsWith('/_next') && 
        !pathname.startsWith('/static')) {
      
      // Rewrite a la página del website con el subdominio en headers
      const response = NextResponse.rewrite(
        new URL(`/website${pathname}`, request.url)
      )
      
      // Añadir header del subdominio para que el componente lo use
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
    '/((?!api|_next/static|_next/image|favicon.ico|public|manifest.json|robots.txt|sitemap.xml).*)',
  ],
}