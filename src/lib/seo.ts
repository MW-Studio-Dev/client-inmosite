/**
 * Utilidades para SEO y Structured Data
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
  sameAs?: string[];
}

export interface PropertySchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image?: string | string[];
  url?: string;
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  numberOfRooms?: string | number;
  floorSize?: {
    '@type': string;
    value: string | number;
    unitCode: string;
  };
  price?: {
    '@type': string;
    price: string | number;
    priceCurrency: string;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  potentialAction?: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

/**
 * Genera el schema JSON-LD para una organización
 */
export function generateOrganizationSchema({
  name = 'InmoSite',
  url,
  logo,
  description,
  phone,
  socialLinks = [],
}: {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  phone?: string;
  socialLinks?: string[];
}): OrganizationSchema {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: url || siteUrl,
    logo: logo || `${siteUrl}/logo.png`,
    ...(description && { description }),
    ...(phone && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: phone,
        contactType: 'customer service',
      },
    }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  };
}

/**
 * Genera el schema JSON-LD para una propiedad inmobiliaria
 */
export function generatePropertySchema({
  name,
  description,
  image,
  url,
  address,
  rooms,
  area,
  price,
  currency = 'ARS',
}: {
  name: string;
  description: string;
  image?: string | string[];
  url?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  rooms?: string | number;
  area?: string | number;
  price?: string | number;
  currency?: string;
}): PropertySchema {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    ...(image && { image: Array.isArray(image) ? image : [image] }),
    ...(url && { url }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(address.street && { streetAddress: address.street }),
        ...(address.city && { addressLocality: address.city }),
        ...(address.state && { addressRegion: address.state }),
        ...(address.postalCode && { postalCode: address.postalCode }),
        ...(address.country && { addressCountry: address.country }),
      },
    }),
    ...(rooms && { numberOfRooms: rooms }),
    ...(area && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: area,
        unitCode: 'MTK',
      },
    }),
    ...(price && {
      price: {
        '@type': 'Offer',
        price: price,
        priceCurrency: currency,
      },
    }),
  };
}

/**
 * Genera el schema JSON-LD para breadcrumbs
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Genera el schema JSON-LD para el sitio web
 */
export function generateWebSiteSchema({
  searchUrl,
}: {
  searchUrl?: string;
} = {}): WebSiteSchema {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'InmoSite',
    url: siteUrl,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${searchUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

