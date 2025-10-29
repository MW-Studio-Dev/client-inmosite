// app/s/[subdomain]/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import DynamicWebsiteClient from '@/components/websites/templates/DynamicWebsiteClient';
import { fetchPublicWebsiteConfig } from '@/lib/website-api';

interface WebsitePageProps {
  params: {
    subdomain: string;
  };
}

export default async function WebsitePage({ params }: WebsitePageProps) {
  const headersList = await headers();
  const awaitedParams = await params;

  // Obtener información del middleware
  const companySlug = headersList.get('x-company-slug') || awaitedParams.subdomain;
  const companyName = headersList.get('x-company-name') || companySlug;
  const subdomain = headersList.get('x-subdomain') || awaitedParams.subdomain;

  // Verificar que tenemos un slug válido
  if (!companySlug) {
    redirect('/');
  }

  console.log(`🏢 Renderizando website para empresa: ${companySlug}`);

  return (
    <DynamicWebsiteClient
      subdomain={companySlug}
      companyName={companyName}
    />
  );
}

// Metadata dinámica para SEO
export async function generateMetadata({ params }: WebsitePageProps): Promise<Metadata> {
  const headersList = await headers();
  const awaitedParams = await params;
  const companySlug = headersList.get('x-company-slug') || awaitedParams.subdomain;
  const companyName = headersList.get('x-company-name') || companySlug;

  // Intentar obtener la configuración del website desde la API
  const websiteConfig = await fetchPublicWebsiteConfig(companySlug);

  // Si tenemos datos de SEO desde la API, usarlos
  if (websiteConfig?.success && websiteConfig.data?.seo) {
    const seo = websiteConfig.data.seo;
    const company = websiteConfig.data.company;
    const hero = websiteConfig.data.hero;

    const title = seo.metaTitle || `${company?.name || companyName} - Inmobiliaria`;
    const description = seo.metaDescription ||
      `Encuentra las mejores propiedades con ${company?.name || companyName}. Casas, apartamentos y locales comerciales.`;

    const metadata: Metadata = {
      title,
      description,
    };

    // Agregar keywords si existen
    if (seo.metaKeywords) {
      metadata.keywords = seo.metaKeywords;
    }

    // Agregar favicon si existe
    if (seo.favicon) {
      metadata.icons = {
        icon: seo.favicon,
        shortcut: seo.favicon,
        apple: seo.favicon,
      };
    }

    // Agregar Open Graph metadata
    metadata.openGraph = {
      title,
      description,
      type: 'website',
      locale: 'es_AR',
      siteName: company?.name || companyName,
    };

    // Agregar imagen de hero a Open Graph si existe
    if (hero?.backgroundImage) {
      metadata.openGraph.images = [
        {
          url: hero.backgroundImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ];
    }

    // Agregar Twitter Card metadata
    metadata.twitter = {
      card: 'summary_large_image',
      title,
      description,
    };

    if (hero?.backgroundImage) {
      metadata.twitter.images = [hero.backgroundImage];
    }

    return metadata;
  }

  // Fallback: metadata por defecto si no hay datos de la API
  return {
    title: `${companyName} - Inmobiliaria`,
    description: `Encuentra las mejores propiedades con ${companyName}. Casas, apartamentos y locales comerciales.`,
    keywords: `inmobiliaria, propiedades, ${companyName}, casas, apartamentos`,
  };
}