import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';
import axios from 'axios';

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

// ✅ CORREGIDO: Instancia de axios con headers de seguridad
const publicAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 3000, // Aumentado un poco el timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Domain-Check-Key': process.env.DOMAIN_CHECK_SECRET_KEY || 'B@guira2025!+',
  },
});

// Lista de subdominios reservados del sistema
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'app', 'dashboard', 'docs', 'blog', 
  'mail', 'ftp', 'cdn', 'static', 'assets', 'img', 'images',
  'support', 'help', 'status', 'staging', 'dev', 'test',
  'preview', 'demo', 'sandbox', 'beta', 'alpha'
];

// Configuración de rutas por subdominio
const SUBDOMAIN_ROUTES_CONFIG = {
  // Rutas específicas del sistema (no para websites públicos)
  systemRoutes: ['/dashboard', '/settings', '/profile', '/admin'],
  
  // Rutas bloqueadas para websites públicos
  blockedPaths: ['/admin', '/system', '/global-settings', '/api/admin'],
  
  // Subdominios con comportamientos especiales
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

  // ✅ MEJORADO: Logging para debugging
  console.log(`🔍 Extracting subdomain from host: ${host}, hostname: ${hostname}`);

  // Local development environment
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Solo procesar si tiene formato de subdominio
    if (hostname.includes('.localhost')) {
      const subdomain = hostname.split('.')[0];
      console.log(`🏠 Local subdomain detected: ${subdomain}`);
      return subdomain;
    }
    
    // No hay subdominio en localhost sin formato de subdominio
    console.log(`🏠 No subdomain in localhost`);
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
    console.log(`🌐 Production subdomain detected: ${extractedSubdomain}`);
  }

  return extractedSubdomain;
}

function isValidSubdomain(subdomain: string): boolean {
  // Validar formato del subdominio
  const subdomainRegex = /^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 2;
}

function isCacheValid(cacheEntry: any): boolean {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
}

// ✅ CORREGIDO: Función de verificación de subdominio mejorada
async function verifySubdomainExists(subdomain: string): Promise<{
  exists: boolean;
  isPublished: boolean;
  companyData?: { name: string; id: string };
}> {
  // Verificar cache primero
  const cached = subdomainCache.get(subdomain);
  if (cached && isCacheValid(cached)) {
    console.log(`🎯 Cache hit for subdomain: ${subdomain}`);
    return {
      exists: cached.exists,
      isPublished: cached.isPublished,
      companyData: cached.companyData
    };
  }

  try {
    console.log(`🔍 Verifying subdomain: ${subdomain} via ${publicAxios.defaults.baseURL}`);
    
    // ✅ MEJORADO: Test de conectividad primero
    const endpoint = `/companies/public/domains/validate/?domain=${subdomain}`;
    // console.log(`📡 Making request to: ${publicAxios.defaults.baseURL}${endpoint}`);
    
    // ✅ CORREGIDO: Llamada a la API con el parámetro correcto
    const response = await publicAxios.get(endpoint);
    
    console.log(`✅ API Response for ${subdomain}:`, {
      status: response.status,
      success: response.data?.success,
      valid: response.data?.data?.valid,
      headers: response.headers['content-type']
    });

    // ✅ CORREGIDO: Manejo correcto de la estructura de respuesta
    if (response.status === 200 && response.data?.success && response.data?.data?.valid) {
      const apiData = response.data.data;
      
      const result = {
        exists: true,
        isPublished: apiData.is_verified !== false, // Considerar verificado como publicado
        companyData: {
          name: apiData.company_name || subdomain,
          id: apiData.company_id || ''
        }
      };

      // Guardar en cache
      subdomainCache.set(subdomain, {
        ...result,
        timestamp: Date.now()
      });

      console.log(`✅ Subdomain ${subdomain} verified and cached:`, result);
      return result;
    } else {
      // ✅ CORREGIDO: Subdominio no válido según la API
      console.log(`❌ Subdomain ${subdomain} not valid or not found`, response.data);
      
      const result = {
        exists: false,
        isPublished: false
      };

      // Cache negativo por menos tiempo (1 minuto)
      subdomainCache.set(subdomain, {
        ...result,
        timestamp: Date.now()
      });

      return result;
    }
  } catch (error: any) {
    console.error(`❌ Error verifying subdomain ${subdomain}:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    // ✅ MEJORADO: Manejo más detallado de errores
    if (error.response?.status === 401) {
      console.error('🚨 UNAUTHORIZED: Check your DOMAIN_CHECK_SECRET_KEY');
      // Para errores de autorización, no cachear y retornar como no existente
      return {
        exists: false,
        isPublished: false
      };
    }

    if (error.response?.status === 404 || error.response?.data?.data?.valid === false) {
      // Subdominio definitivamente no existe
      const result = {
        exists: false,
        isPublished: false
      };

      // Cache negativo por menos tiempo (30 segundos para errores)
      subdomainCache.set(subdomain, {
        ...result,
        timestamp: Date.now()
      });

      return result;
    }

    // ✅ MEJORADO: Para errores de red, ser más conservador
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message === 'Network Error') {
      console.warn(`⚠️  Network error for ${subdomain}: ${error.message}`);
      console.warn(`⚠️  Check if Django server is running on ${publicAxios.defaults.baseURL}`);
      
      // ❌ CAMBIADO: No permitir acceso en errores de red para mayor seguridad
      return {
        exists: false,
        isPublished: false
      };
    }
    
    // Para otros errores, asumir que no existe
    console.warn(`⚠️  Unknown error for ${subdomain}, treating as non-existent`);
    return {
      exists: false,
      isPublished: false
    };
  }
}

function handleSpecialSubdomains(
  subdomain: string, 
  pathname: string, 
  request: NextRequest
): NextResponse | null {
  const specialConfig = SUBDOMAIN_ROUTES_CONFIG.specialSubdomains[subdomain];
  
  if (!specialConfig) return null;

  // Subdominio API
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

  // Subdominios que redirigen al dominio principal
  if (specialConfig.redirectTo) {
    const mainDomainUrl = request.url.replace(`${subdomain}.`, '');
    return NextResponse.redirect(new URL(specialConfig.redirectTo, mainDomainUrl));
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ AGREGADO: Filtrar URLs que no deberían ser procesadas
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

  // ✅ MEJORADO: Logging más selectivo
  if (subdomain) {
    console.log(`🔄 Middleware processing subdomain: ${subdomain}, path: ${pathname}`);
  }

  // Si no hay subdominio, permitir acceso normal (dominio principal)
  if (!subdomain) {
    return NextResponse.next();
  }

  // Validar formato del subdominio
  if (!isValidSubdomain(subdomain)) {
    console.log(`❌ Invalid subdomain format: ${subdomain}`);
    return NextResponse.redirect(new URL('/404', request.url));
  }

  // Verificar si es un subdominio reservado del sistema
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    console.log(`🔒 Reserved subdomain detected: ${subdomain}`);
    const specialResponse = handleSpecialSubdomains(subdomain, pathname, request);
    if (specialResponse) {
      return specialResponse;
    }
    
    // Si no es especial pero está reservado, redirigir al principal
    const mainDomainUrl = request.url.replace(`${subdomain}.`, '');
    return NextResponse.redirect(new URL('/', mainDomainUrl));
  }

  // Para recursos estáticos y APIs internas, permitir paso directo
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') || 
      pathname.startsWith('/robots') ||
      pathname.startsWith('/sitemap') ||
      pathname.startsWith('/api/_internal')) {
    console.log(`📁 Static resource or internal API, allowing direct access`);
    return NextResponse.next();
  }

  // Bloquear rutas del sistema en websites públicos
  const isSystemRoute = SUBDOMAIN_ROUTES_CONFIG.systemRoutes.some(
    route => pathname.startsWith(route)
  );
  
  if (isSystemRoute) {
    console.log(`🚫 System route blocked on public website: ${pathname}`);
    return NextResponse.rewrite(new URL('/website-not-found', request.url));
  }

  // ✅ CORREGIDO: Verificar si el subdominio existe y está publicado
  try {
    const subdomainInfo = await verifySubdomainExists(subdomain);

    if (!subdomainInfo.exists || !subdomainInfo.isPublished) {
      console.log(`❌ Subdomain ${subdomain} does not exist or is not published`);
      return NextResponse.rewrite(new URL('/website-not-found', request.url));
    }

    console.log(`✅ Subdomain ${subdomain} verified, proceeding to website`);

    // Agregar headers con información del subdominio para uso en la aplicación
    const response = NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, request.url));

    
    // Headers personalizados para la aplicación
    response.headers.set('x-subdomain', subdomain);
    response.headers.set('x-website-exists', 'true');
    response.headers.set('x-company-slug', subdomain); // ← Agregar este header que necesitas
    response.headers.set('x-company-name', subdomainInfo.companyData?.name || subdomain);
    response.headers.set('x-company-id', subdomainInfo.companyData?.id || '');
  

    return response;
  } catch (error) {
    console.error(`❌ Critical error in middleware for ${subdomain}:`, error);
    // En caso de error crítico, mostrar página de error
    return NextResponse.rewrite(new URL('/website-not-found', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. API routes (except public website API)
     * 2. Next.js internals (_next)
     * 3. Static files (favicon, robots, etc.)
     * 4. Chrome DevTools and browser internals
     * 5. Health check endpoints
     */
    '/((?!api/(?:(?!websites/public).*)|_next|health|favicon|robots|sitemap|manifest|sw\\.js|\\.well-known|__nextjs|[\\w-]+\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)).*)'
  ]
};

// ✅ AGREGADO: Función para probar conectividad de API
export async function testAPIConnectivity(): Promise<boolean> {
  try {
    console.log(`🔍 Testing API connectivity to: ${publicAxios.defaults.baseURL}`);
    
    // Intentar un endpoint simple primero
    const response = await publicAxios.get('/companies/public/domains/validate/?domain=test-connectivity', {
      timeout: 2000
    });
    
    console.log(`✅ API connectivity test passed:`, {
      status: response.status,
      baseURL: publicAxios.defaults.baseURL
    });
    
    return true;
  } catch (error: any) {
    console.error(`❌ API connectivity test failed:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      baseURL: publicAxios.defaults.baseURL
    });
    
    return false;
  }
}

// ✅ AGREGADO: Función para verificar variables de entorno
export function checkEnvironmentVariables() {
  const envStatus = {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT SET (using default)',
    SECRET_KEY: process.env.DOMAIN_CHECK_SECRET_KEY ? 'SET' : 'NOT SET (using default)',
    baseURL: publicAxios.defaults.baseURL,
    headers: publicAxios.defaults.headers
  };
  
  console.log('🔧 Environment check:', envStatus);
  return envStatus;
}

// Función auxiliar para limpiar cache periódicamente (opcional)
export function clearExpiredCache() {
  const now = Date.now();
  let cleared = 0;
  for (const [key, value] of subdomainCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      subdomainCache.delete(key);
      cleared++;
    }
  }
  if (cleared > 0) {
    console.log(`🧹 Cleared ${cleared} expired cache entries`);
  }
}

// Función para invalidar cache de un subdominio específico (útil para webhooks)
export function invalidateSubdomainCache(subdomain: string) {
  const deleted = subdomainCache.delete(subdomain);
  if (deleted) {
    console.log(`🗑️  Invalidated cache for subdomain: ${subdomain}`);
  }
  return deleted;
}

// ✅ AGREGADO: Función para debugging del cache
export function getCacheStats() {
  return {
    size: subdomainCache.size,
    entries: Array.from(subdomainCache.entries()).map(([key, value]) => ({
      subdomain: key,
      exists: value.exists,
      isPublished: value.isPublished,
      age: Date.now() - value.timestamp,
      expired: !isCacheValid(value)
    }))
  };
}