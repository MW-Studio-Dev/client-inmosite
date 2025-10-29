// app/s/[subdomain]/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { fetchPublicWebsiteConfig } from '@/lib/website-api';

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
      icons: {
        icon: websiteConfig.data.seo.favicon,
        shortcut: websiteConfig.data.seo.favicon,
        apple: websiteConfig.data.seo.favicon,
      },
    };
  }

  return {};
}

export default async function SubdomainLayout({
  children,
  params
}: SubdomainLayoutProps) {
  const awaitedParams = await params;

  // Este layout es específico para los websites de subdominios
  // No incluye el header/footer del sitio principal
  return (
    <html lang="es">
      <head>
        <meta name="subdomain" content={awaitedParams.subdomain} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
