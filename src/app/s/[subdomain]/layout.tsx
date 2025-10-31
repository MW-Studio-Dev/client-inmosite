// app/s/[subdomain]/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { fetchPublicWebsiteConfig } from '@/lib/website-api';
import { WebsiteConfigWrapper } from '@/components/websites/templates/WebsiteConfigWrapper';

interface SubdomainLayoutProps {
  children: React.ReactNode;
  params: {
    subdomain: string;
  };
}

export async function generateMetadata({ params }: SubdomainLayoutProps): Promise<Metadata> {
  const awaitedParams = await params;
  const websiteConfig = await fetchPublicWebsiteConfig(awaitedParams.subdomain);

  // Si tenemos datos de SEO desde la API, agregar el favicon
  if (websiteConfig?.success && websiteConfig.data?.seo?.favicon) {
    return {
      title: websiteConfig.data.seo.metaTitle || websiteConfig.data.company.name,
      description: websiteConfig.data.seo.metaDescription || '',
      icons: {
        icon: websiteConfig.data.seo.favicon,
        shortcut: websiteConfig.data.seo.favicon,
        apple: websiteConfig.data.seo.favicon,
      },
    };
  }

  // Retornar metadata básica sin favicon personalizado
  return {
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function SubdomainLayout({
  children,
  params
}: SubdomainLayoutProps) {
  const awaitedParams = await params;

  // Este layout es específico para los websites de subdominios
  // Envuelve el contenido con el provider de configuración
  return (
    <WebsiteConfigWrapper subdomain={awaitedParams.subdomain}>
      {children}
    </WebsiteConfigWrapper>
  );
}
