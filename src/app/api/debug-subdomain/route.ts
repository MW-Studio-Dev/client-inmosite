// app/api/debug-subdomain/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  const headersList = await headers();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Obtener información del middleware (si pasó por ahí)
  const middlewareHeaders = {
    'x-subdomain': headersList.get('x-subdomain'),
    'x-company-slug': headersList.get('x-company-slug'),
    'x-company-name': headersList.get('x-company-name'),
    'x-company-id': headersList.get('x-company-id'),
    'x-website-exists': headersList.get('x-website-exists'),
  };

  // Información de variables de entorno
  const environment = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
    NEXT_PUBLIC_API_MEDIA: process.env.NEXT_PUBLIC_API_MEDIA || 'NOT SET',
    DOMAIN_CHECK_SECRET_KEY: process.env.DOMAIN_CHECK_SECRET_KEY ? 'SET (hidden)' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  // Información de la request
  const requestInfo = {
    url: request.url,
    host: host,
    hostname: hostname,
    pathname: request.nextUrl.pathname,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
  };

  // Detectar subdomain
  let subdomain = null;

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    if (hostname.includes('.localhost')) {
      subdomain = hostname.split('.')[0];
    }
  } else {
    // Production environment
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'inmosite.com';
    const rootDomainFormatted = rootDomain.split(':')[0];

    // Handle preview deployment URLs
    if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
      const parts = hostname.split('---');
      subdomain = parts.length > 0 ? parts[0] : null;
    } else {
      const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

      subdomain = isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Debug information for subdomain detection',
    data: {
      detectedSubdomain: subdomain,
      middlewareHeaders,
      requestInfo,
      environment,
    },
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
}
