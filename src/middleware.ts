import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';

// Cache en memoria para verificaciones rápidas de subdominios
const subdomainCache = new Map<string, {
  exists: boolean;
  isPublished: boolean;
  timestamp: number;
  companyData?: {
    name: string;
    id: string;
  };
}>();

// Duración del cache en memoria (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000;

// Lista de subdominios reservados del sistema
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'app', 'dashboard', 'docs', 'blog',
  'mail', 'ftp', 'cdn', 'static', 'assets', 'img', 'images',
  'support', 'help', 'status', 'staging', 'dev', 'test',
  'preview', 'demo', 'sandbox', 'beta', 'alpha'
];

// Configuración de rutas por subdominio
const SUBDOMAIN_ROUTES_CONFIG = {
  systemRoutes: ['/dashboard', '/settings', '/profile', '/admin'],
  blockedPaths: ['/admin', '/system', '/global-settings', '/api/admin'],
  specialSubdomains: {
    'api': {
      allowedPaths: ['/v1', '/v2', '/docs', '/health'],
      rewriteToApiRoutes: true
    },
    'admin': {
      redirectTo: '/admin'
    },
    'app': {
      redirectTo: '/dashboard'
    }
  } as Record<string, {
    allowedPaths?: string[];
    rewriteToApiRoutes?: boolean;
    redirectTo?: string
  }>
};

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  console.log(`🔍 Host: ${host}, Hostname: ${hostname}`);

  // Local development environment
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    if (hostname.includes('.localhost')) {
      const subdomain = hostname.split('.')[0];
      console.log(`🏠 Local subdomain: ${subdomain}`);
      return subdomain;
    }
    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  const extractedSubdomain = isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;

  if (extractedSubdomain) {
    console.log(`🌐 Production subdomain: ${extractedSubdomain}`);
  }

  return extractedSubdomain;
}

function isValidSubdomain(subdomain: string): boolean {
  const subdomainRegex = /^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 2;
}

function isCacheValid(cacheEntry: any): boolean {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
}

// ✅ SOLUCIÓN: Modo permisivo - permite subdominios válidos incluso si la API falla
async function verifySubdomainExists(subdomain: string): Promise<{
  exists: boolean;
  isPublished: boolean;
  companyData?: { name: string; id: string };
}> {
  // Verificar cache primero
  const cached = subdomainCache.get(subdomain);
  if (cached && isCacheValid(cached)) {
    console.log(`🎯 Cache hit: ${subdomain}`);
    return {
      exists: cached.exists,
      isPublished: cached.isPublished,
      companyData: cached.companyData
    };
  }

  try {
    console.log(`🔍 Verificando: ${subdomain}`);

    // Configurar timeout para fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/companies/public/domains/validate/?domain=${subdomain}`;

    // Usar fetch en lugar de axios para compatibilidad con Edge Runtime
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Domain-Check-Key': process.env.DOMAIN_CHECK_SECRET_KEY || 'B@guira2025!+',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log(`✅ API Response:`, response.status);

    let apiData = null;
    try {
      apiData = await response.json();
    } catch (e) {
      console.warn('Error parsing JSON response', e);
    }

    if (response.ok && apiData?.success && apiData?.data?.valid) {
      const data = apiData.data;

      const result = {
        exists: true,
        isPublished: data.is_verified !== false,
        companyData: {
          name: data.company_name || subdomain,
          id: data.company_id || ''
        }
      };

      subdomainCache.set(subdomain, {
        ...result,
        timestamp: Date.now()
      });

      console.log(`✅ Subdomain verificado: ${subdomain}`);
      return result;
    }

    // Si la respuesta es 404 o explícitamente inválida
    if (response.status === 404 || apiData?.data?.valid === false) {
      console.log(`❌ Subdomain no válido: ${subdomain}`);

      const result = {
        exists: false,
        isPublished: false
      };

      subdomainCache.set(subdomain, {
        ...result,
        timestamp: Date.now()
      });

      return result;
    }

    // Si llegamos aquí con un error 500 o similar, lanzamos error para caer en el catch (modo permisivo)
    throw new Error(`API Error: ${response.status}`);

  } catch (error: any) {
    console.error(`⚠️ Error verificando ${subdomain}:`, error.message || error);

    // Para errores de red, timeout, o errores 500, PERMITIR acceso
    console.warn(`⚠️ Permitiendo ${subdomain} debido a error de API (modo permisivo)`);

    const result = {
      exists: true, // ✅ PERMITIR
      isPublished: true, // ✅ PERMITIR
      companyData: {
        name: subdomain,
        id: ''
      }
    };

    // Cache corto para reintentar pronto
    subdomainCache.set(subdomain, {
      ...result,
      timestamp: Date.now()
    });

    return result;
  }
}

function handleSpecialSubdomains(
  subdomain: string,
  pathname: string,
  request: NextRequest
): NextResponse | null {
  const specialConfig = SUBDOMAIN_ROUTES_CONFIG.specialSubdomains[subdomain];

  if (!specialConfig) return null;

  if (subdomain === 'api') {
    const allowedPaths = specialConfig.allowedPaths || [];
    const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

    if (!isAllowedPath) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: 'API endpoint not found'
        },
        { status: 404 }
      );
    }

    if (specialConfig.rewriteToApiRoutes) {
      return NextResponse.rewrite(new URL(`/api${pathname}`, request.url));
    }
  }

  if (specialConfig.redirectTo) {
    const mainDomainUrl = request.url.replace(`${subdomain}.`, '');
    return NextResponse.redirect(new URL(specialConfig.redirectTo, mainDomainUrl));
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Filtrar URLs que no deberían ser procesadas
  const shouldSkipProcessing = [
    '/.well-known/',
    '/_next/',
    '/favicon',
    '/robots',
    '/sitemap',
    '/api/_internal',
    '/api/auth',
    '/__nextjs',
    '/sw.js',
    '/manifest.json'
  ].some(path => pathname.startsWith(path));

  if (shouldSkipProcessing) {
    return NextResponse.next();
  }

  const subdomain = extractSubdomain(request);

  if (subdomain) {
    console.log(`🔄 Procesando: ${subdomain}, path: ${pathname}`);
  }

  // Si no hay subdominio, permitir acceso normal
  if (!subdomain) {
    console.log(`🏠 Dominio principal: ${pathname}`);
    return NextResponse.next();
  }

  // Validar formato del subdominio
  if (!isValidSubdomain(subdomain)) {
    console.log(`❌ Formato inválido: ${subdomain}`);
    return NextResponse.redirect(new URL('/404', request.url));
  }

  // Verificar si es un subdominio reservado
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    console.log(`🔒 Subdominio reservado: ${subdomain}`);
    const specialResponse = handleSpecialSubdomains(subdomain, pathname, request);
    if (specialResponse) {
      return specialResponse;
    }

    const mainDomainUrl = request.url.replace(`${subdomain}.`, '');
    return NextResponse.redirect(new URL('/', mainDomainUrl));
  }

  // Recursos estáticos - paso directo
  if (pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/api/_internal')) {
    return NextResponse.next();
  }

  // Bloquear rutas del sistema
  const isSystemRoute = SUBDOMAIN_ROUTES_CONFIG.systemRoutes.some(
    route => pathname.startsWith(route)
  );

  if (isSystemRoute) {
    console.log(`🚫 Ruta de sistema bloqueada: ${pathname}`);
    return NextResponse.rewrite(new URL('/website-not-found', request.url));
  }

  // Verificar subdominio
  try {
    const subdomainInfo = await verifySubdomainExists(subdomain);

    if (!subdomainInfo.exists || !subdomainInfo.isPublished) {
      console.log(`❌ Subdomain ${subdomain} no existe o no está publicado`);
      return NextResponse.rewrite(new URL('/website-not-found', request.url));
    }

    console.log(`✅ Subdomain ${subdomain} verificado`);

    // Rewrite a la ruta del website con headers personalizados
    const response = NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, request.url));

    response.headers.set('x-subdomain', subdomain);
    response.headers.set('x-website-exists', 'true');
    response.headers.set('x-company-slug', subdomain);
    response.headers.set('x-company-name', subdomainInfo.companyData?.name || subdomain);
    response.headers.set('x-company-id', subdomainInfo.companyData?.id || '');

    return response;
  } catch (error) {
    console.error(`❌ Error crítico en middleware para ${subdomain}:`, error);
    return NextResponse.rewrite(new URL('/website-not-found', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/(?:(?!websites/public).*)|_next|health|favicon|robots|sitemap|manifest|sw\\.js|\\.well-known|__nextjs|[\\w-]+\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)).*)'
  ]
};