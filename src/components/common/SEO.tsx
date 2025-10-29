'use client';

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  structuredData?: object;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

/**
 * Componente SEO para client-side rendering
 * Nota: En Next.js App Router, los metadatos se manejan mejor con generateMetadata
 * Este componente es útil para casos especiales donde necesitas SEO dinámico en client-side
 */
export default function SEO({
  title = 'InmoSite - Gestión Inmobiliaria',
  description = 'Plataforma completa para la gestión de propiedades inmobiliarias. Administra tus propiedades, clientes y sitios web desde un solo lugar.',
  keywords = 'inmobiliaria, gestión inmobiliaria, propiedades, casas, departamentos, alquileres, ventas',
  image = '/hero-image.webp',
  url,
  type = 'website',
  siteName = 'InmoSite',
  locale = 'es_AR',
  structuredData,
  noindex = false,
  nofollow = false,
  canonical,
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';
  const fullUrl = url || siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = canonical || fullUrl;

  const robots = [
    noindex && 'noindex',
    nofollow && 'nofollow',
    !noindex && !nofollow && 'index, follow',
  ]
    .filter(Boolean)
    .join(', ');

  useEffect(() => {
    // Actualizar título
    if (title) {
      document.title = title;
    }

    // Actualizar o crear meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Actualizar description
    updateMetaTag('description', description);
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    updateMetaTag('robots', robots);

    // Open Graph
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', imageUrl, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', locale, true);

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', fullUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  }, [title, description, keywords, image, url, type, siteName, locale, robots, fullUrl, imageUrl, canonicalUrl]);

  // Structured Data
  useEffect(() => {
    if (structuredData) {
      const existingScript = document.getElementById('structured-data-seo');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'structured-data-seo';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.getElementById('structured-data-seo');
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      };
    }
  }, [structuredData]);

  return null;
}

