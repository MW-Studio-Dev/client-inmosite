import type { Metadata } from 'next';
import PropertiesPageClient from "@/components/websites/templates/template_1/sections/list/PropertiesPageClient";
import { fetchPublicWebsiteConfig } from '@/lib/website-api';

interface PropertyPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const websiteConfig = await fetchPublicWebsiteConfig(subdomain);

  if (websiteConfig?.success && websiteConfig.data) {
    const company = websiteConfig.data.company;
    const seo = websiteConfig.data.seo;

    const title = `Propiedades - ${company?.name || subdomain}`;
    const description = `Explora todas nuestras propiedades disponibles en ${company?.name || subdomain}. Encuentra la propiedad ideal para ti.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      icons: seo?.favicon ? {
        icon: seo.favicon,
        shortcut: seo.favicon,
        apple: seo.favicon,
      } : undefined,
    };
  }

  return {
    title: `Propiedades - ${subdomain}`,
    description: 'Explora todas nuestras propiedades disponibles.',
  };
}

export default async function ListPage({params}: PropertyPageProps) {
  const { subdomain } = await params;

  // Cargar configuración en el servidor
  const websiteConfig = await fetchPublicWebsiteConfig(subdomain);

  if (!websiteConfig?.success || !websiteConfig.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar configuración</h1>
          <p>No se pudo cargar la configuración del sitio</p>
        </div>
      </div>
    );
  }

  return <PropertiesPageClient subdomain={subdomain} initialConfig={websiteConfig.data} />;
}