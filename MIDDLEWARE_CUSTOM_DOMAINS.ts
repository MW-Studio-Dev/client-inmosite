/**
 * MIDDLEWARE CON SOPORTE PARA DOMINIOS CUSTOM
 *
 * Este archivo muestra cómo modificar tu middleware actual para soportar:
 * 1. Subdominios (inmobiliaria.tuapp.com) ✅ Ya funciona
 * 2. Dominios custom (www.inmobiliaria.com) ✅ Nuevo
 */

import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';
import axios from 'axios';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const DOMAIN_CHECK_SECRET = process.env.DOMAIN_CHECK_SECRET_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Subdominios reservados del sistema
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'app', 'dashboard', 'docs', 'blog',
  'mail', 'ftp', 'cdn', 'static', 'assets', 'img', 'images',
  'support', 'help', 'status', 'staging', 'dev', 'test',
  'preview', 'demo', 'sandbox', 'beta', 'alpha'
];

// ============================================================================
// TIPOS
// ============================================================================

type DomainType = 'subdomain' | 'custom' | 'root';

interface DomainInfo {
  type: DomainType;
  value: string; // El valor del subdominio o dominio custom
  fullDomain: string; // El dominio completo
}

interface CompanyData {
  exists: boolean;
  isPublished: boolean;
  companyData?: {
    name: string;
    id: string;
    slug: string;
  };
  timestamp: number;
}

// ============================================================================
// CACHE
// ============================================================================

const domainCache = new Map<string, CompanyData>();

function getCacheKey(domain: string, type: DomainType): string {
  return `${type}:${domain.toLowerCase()}`;
}

function isCacheValid(cacheEntry: CompanyData): boolean {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
}

function getCachedDomain(domain: string, type: DomainType): CompanyData | null {
  const key = getCacheKey(domain, type);
  const cached = domainCache.get(key);

  if (cached && isCacheValid(cached)) {
    console.log(`🎯 Cache hit for ${type}: ${domain}`);
    return cached;
  }

  // Limpiar cache expirado
  if (cached) {
    domainCache.delete(key);
  }

  return null;
}

function setCachedDomain(domain: string, type: DomainType, data: Omit<CompanyData, 'timestamp'>): void {
  const key = getCacheKey(domain, type);
  domainCache.set(key, {
    ...data,
    timestamp: Date.now()
  });
}

// ============================================================================
// DETECCIÓN DE DOMINIO
// ============================================================================

/**
 * Extrae información del dominio desde el request
 *
 * Casos que maneja:
 * 1. localhost → root domain (no subdomain)
 * 2. tuapp.com → root domain
 * 3. www.tuapp.com → www subdomain (si no está en RESERVED)
 * 4. inmobiliaria1.tuapp.com → subdomain
 * 5. www.inmobiliaria.com → custom domain
 * 6. inmobiliaria.com → custom domain
 */
function extractDomainInfo(request: NextRequest): DomainInfo {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  console.log(`🔍 Analyzing host: ${host}, hostname: ${hostname}`);

  // -------------------------------------------------------------------------
  // CASO 1: Localhost (desarrollo)
  // -------------------------------------------------------------------------
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // localhost:3000 → root
    if (!hostname.includes('.')) {
      return {
        type: 'root',
        value: '',
        fullDomain: hostname
      };
    }

    // inmobiliaria1.localhost → subdomain
    const parts = hostname.split('.');
    if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
      const subdomain = parts[0];
      return {
        type: 'subdomain',
        value: subdomain,
        fullDomain: hostname
      };
    }

    return {
      type: 'root',
      value: '',
      fullDomain: hostname
    };
  }

  // -------------------------------------------------------------------------
  // CASO 2: Dominio de producción
  // -------------------------------------------------------------------------
  const rootDomainFormatted = rootDomain.split(':')[0].toLowerCase();

  // Vercel preview URLs (tenant---branch.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return {
      type: 'subdomain',
      value: parts[0],
      fullDomain: hostname
    };
  }

  // -------------------------------------------------------------------------
  // CASO 3: Detectar si es nuestro dominio raíz o un subdominio nuestro
  // -------------------------------------------------------------------------
  if (hostname === rootDomainFormatted || hostname === `www.${rootDomainFormatted}`) {
    // tuapp.com o www.tuapp.com → root domain
    return {
      type: 'root',
      value: '',
      fullDomain: hostname
    };
  }

  if (hostname.endsWith(`.${rootDomainFormatted}`)) {
    // inmobiliaria1.tuapp.com → subdomain
    const subdomain = hostname.replace(`.${rootDomainFormatted}`, '');
    return {
      type: 'subdomain',
      value: subdomain,
      fullDomain: hostname
    };
  }

  // -------------------------------------------------------------------------
  // CASO 4: Dominio custom (no es nuestro dominio)
  // -------------------------------------------------------------------------
  // Cualquier otro dominio es considerado custom domain
  console.log(`🌍 Custom domain detected: ${hostname}`);
  return {
    type: 'custom',
    value: hostname, // Para custom domains, guardamos el dominio completo
    fullDomain: hostname
  };
}

// ============================================================================
// VALIDACIÓN DE DOMINIOS
// ============================================================================

function isValidSubdomain(subdomain: string): boolean {
  const subdomainRegex = /^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 2;
}

function isValidCustomDomain(domain: string): boolean {
  // Validar formato de dominio custom
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

  // Dominios bloqueados (seguridad)
  const blockedDomains = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'example.com',
    'test.com'
  ];

  // TLDs bloqueados (gobierno, militar, etc.)
  const blockedTLDs = ['.gov', '.mil', '.local'];

  if (!domainRegex.test(domain)) {
    return false;
  }

  if (blockedDomains.includes(domain)) {
    return false;
  }

  if (blockedTLDs.some(tld => domain.endsWith(tld))) {
    return false;
  }

  return true;
}

// ============================================================================
// API CLIENT
// ============================================================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    'X-Domain-Check-Key': DOMAIN_CHECK_SECRET,
  },
});

/**
 * Verifica si un dominio (subdomain o custom) existe y está activo
 */
async function verifyDomain(
  domain: string,
  type: DomainType
): Promise<CompanyData> {
  // Revisar cache primero
  const cached = getCachedDomain(domain, type);
  if (cached) {
    return cached;
  }

  try {
    console.log(`🔍 Verifying ${type}: ${domain}`);

    // Endpoint diferente según el tipo
    const endpoint = `/companies/public/domains/validate/`;
    const params = {
      domain: domain,
      type: type === 'custom' ? 'custom' : 'subdomain'
    };

    const response = await apiClient.get(endpoint, { params });

    console.log(`✅ API Response for ${domain}:`, {
      status: response.status,
      success: response.data?.success,
      valid: response.data?.data?.valid
    });

    // Estructura de respuesta esperada:
    // {
    //   "success": true,
    //   "data": {
    //     "valid": true,
    //     "is_verified": true,
    //     "domain_type": "custom" | "subdomain",
    //     "company_id": "123",
    //     "company_name": "Inmobiliaria Premium",
    //     "company_slug": "inmobiliaria-premium"
    //   }
    // }

    if (response.status === 200 && response.data?.success && response.data?.data?.valid) {
      const apiData = response.data.data;

      const result: CompanyData = {
        exists: true,
        isPublished: apiData.is_verified !== false,
        companyData: {
          name: apiData.company_name || domain,
          id: apiData.company_id || '',
          slug: apiData.company_slug || domain
        },
        timestamp: Date.now()
      };

      // Guardar en cache
      setCachedDomain(domain, type, result);

      console.log(`✅ Domain ${domain} verified and cached`);
      return result;
    }

    // Dominio no válido
    console.log(`❌ Domain ${domain} not valid or not found`);
    const result: CompanyData = {
      exists: false,
      isPublished: false,
      timestamp: Date.now()
    };

    // Cache negativo (por menos tiempo)
    setCachedDomain(domain, type, result);
    return result;

  } catch (error: any) {
    console.error(`❌ Error verifying domain ${domain}:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status
    });

    // Manejo de errores
    if (error.response?.status === 404 || error.response?.data?.data?.valid === false) {
      const result: CompanyData = {
        exists: false,
        isPublished: false,
        timestamp: Date.now()
      };

      setCachedDomain(domain, type, result);
      return result;
    }

    // Errores de red o servidor - no cachear
    return {
      exists: false,
      isPublished: false,
      timestamp: Date.now()
    };
  }
}

// ============================================================================
// MIDDLEWARE HANDLER
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------------------
  // 1. FILTRAR RUTAS QUE NO NECESITAN PROCESAMIENTO
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // 2. EXTRAER INFORMACIÓN DEL DOMINIO
  // -------------------------------------------------------------------------
  const domainInfo = extractDomainInfo(request);

  console.log(`🔄 Domain info:`, {
    type: domainInfo.type,
    value: domainInfo.value,
    fullDomain: domainInfo.fullDomain,
    path: pathname
  });

  // -------------------------------------------------------------------------
  // 3. DOMINIO RAÍZ (Landing page principal)
  // -------------------------------------------------------------------------
  if (domainInfo.type === 'root') {
    console.log(`🏠 Root domain request, allowing normal access`);
    return NextResponse.next();
  }

  // -------------------------------------------------------------------------
  // 4. VALIDAR Y PROCESAR SUBDOMINIOS
  // -------------------------------------------------------------------------
  if (domainInfo.type === 'subdomain') {
    const subdomain = domainInfo.value;

    // Validar formato
    if (!isValidSubdomain(subdomain)) {
      console.log(`❌ Invalid subdomain format: ${subdomain}`);
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Manejar subdominios reservados
    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      console.log(`🔒 Reserved subdomain: ${subdomain}`);
      // Podrías redirigir a rutas específicas aquí
      // ej: admin.tuapp.com → /admin
      return NextResponse.next();
    }

    // Bloquear rutas del sistema en websites públicos
    const systemRoutes = ['/dashboard', '/settings', '/profile', '/admin'];
    const isSystemRoute = systemRoutes.some(route => pathname.startsWith(route));

    if (isSystemRoute) {
      console.log(`🚫 System route blocked on subdomain: ${pathname}`);
      return NextResponse.rewrite(new URL('/website-not-found', request.url));
    }

    // Verificar si el subdominio existe
    const subdomainInfo = await verifyDomain(subdomain, 'subdomain');

    if (!subdomainInfo.exists || !subdomainInfo.isPublished) {
      console.log(`❌ Subdomain ${subdomain} does not exist or is not published`);
      return NextResponse.rewrite(new URL('/website-not-found', request.url));
    }

    console.log(`✅ Subdomain ${subdomain} verified`);

    // Rewrite a la ruta del website
    const response = NextResponse.rewrite(
      new URL(`/s/${subdomain}${pathname}`, request.url)
    );

    // Headers para la aplicación
    response.headers.set('x-domain-type', 'subdomain');
    response.headers.set('x-subdomain', subdomain);
    response.headers.set('x-company-slug', subdomainInfo.companyData?.slug || subdomain);
    response.headers.set('x-company-name', subdomainInfo.companyData?.name || subdomain);
    response.headers.set('x-company-id', subdomainInfo.companyData?.id || '');
    response.headers.set('x-website-exists', 'true');

    return response;
  }

  // -------------------------------------------------------------------------
  // 5. VALIDAR Y PROCESAR DOMINIOS CUSTOM
  // -------------------------------------------------------------------------
  if (domainInfo.type === 'custom') {
    const customDomain = domainInfo.fullDomain;

    // Validar formato
    if (!isValidCustomDomain(customDomain)) {
      console.log(`❌ Invalid custom domain format: ${customDomain}`);
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Bloquear rutas del sistema
    const systemRoutes = ['/dashboard', '/settings', '/profile', '/admin'];
    const isSystemRoute = systemRoutes.some(route => pathname.startsWith(route));

    if (isSystemRoute) {
      console.log(`🚫 System route blocked on custom domain: ${pathname}`);
      return NextResponse.rewrite(new URL('/website-not-found', request.url));
    }

    // Verificar si el dominio custom existe y está verificado
    const domainInfo = await verifyDomain(customDomain, 'custom');

    if (!domainInfo.exists || !domainInfo.isPublished) {
      console.log(`❌ Custom domain ${customDomain} not verified or not found`);

      // Podrías mostrar una página específica de "Dominio en verificación"
      return NextResponse.rewrite(new URL('/domain-verification-pending', request.url));
    }

    console.log(`✅ Custom domain ${customDomain} verified`);

    // Rewrite a la ruta del website usando el slug de la empresa
    const companySlug = domainInfo.companyData?.slug || customDomain;
    const response = NextResponse.rewrite(
      new URL(`/s/${companySlug}${pathname}`, request.url)
    );

    // Headers para la aplicación
    response.headers.set('x-domain-type', 'custom');
    response.headers.set('x-custom-domain', customDomain);
    response.headers.set('x-company-slug', companySlug);
    response.headers.set('x-company-name', domainInfo.companyData?.name || customDomain);
    response.headers.set('x-company-id', domainInfo.companyData?.id || '');
    response.headers.set('x-website-exists', 'true');

    return response;
  }

  // Fallback
  return NextResponse.next();
}

// ============================================================================
// CONFIGURACIÓN DE MATCHER
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. API routes (except public website API)
     * 2. Next.js internals (_next)
     * 3. Static files (favicon, robots, etc.)
     * 4. Browser internals
     */
    '/((?!api/(?:(?!websites/public).*)|_next|health|favicon|robots|sitemap|manifest|sw\\.js|\\.well-known|__nextjs|[\\w-]+\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)).*)'
  ]
};

// ============================================================================
// UTILIDADES PARA DEBUGGING Y TESTING
// ============================================================================

/**
 * Obtener estadísticas del cache
 */
export function getCacheStats() {
  return {
    size: domainCache.size,
    entries: Array.from(domainCache.entries()).map(([key, value]) => ({
      key,
      exists: value.exists,
      isPublished: value.isPublished,
      companyName: value.companyData?.name,
      age: Date.now() - value.timestamp,
      expired: !isCacheValid(value)
    }))
  };
}

/**
 * Limpiar cache expirado
 */
export function clearExpiredCache() {
  let cleared = 0;
  for (const [key, value] of domainCache.entries()) {
    if (!isCacheValid(value)) {
      domainCache.delete(key);
      cleared++;
    }
  }
  console.log(`🧹 Cleared ${cleared} expired cache entries`);
  return cleared;
}

/**
 * Invalidar cache de un dominio específico
 */
export function invalidateDomainCache(domain: string, type: DomainType) {
  const key = getCacheKey(domain, type);
  const deleted = domainCache.delete(key);
  console.log(`🗑️  Invalidated cache for ${type}:${domain}`);
  return deleted;
}

/**
 * Test de conectividad con la API
 */
export async function testAPIConnectivity(): Promise<boolean> {
  try {
    const response = await apiClient.get('/companies/public/domains/validate/', {
      params: { domain: 'test-connectivity', type: 'subdomain' },
      timeout: 2000
    });

    console.log(`✅ API connectivity test passed`);
    return true;
  } catch (error: any) {
    console.error(`❌ API connectivity test failed:`, error.message);
    return false;
  }
}
