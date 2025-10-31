import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { fetchPublicWebsiteConfig } from '@/lib/website-api';
import PropertiesPageErrorBoundary from '@/components/websites/templates/template_1/sections/list/PropertiesPageWrapper';

// Dynamic import with loading state
const PropertiesPage = dynamic(
  () => import("@/components/websites/templates/template_1/sections/list/PropertiesPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

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
  console.log(subdomain)
  return (
    <PropertiesPageErrorBoundary>
      <PropertiesPage key={`properties-${subdomain}`} subdomain={subdomain}/>
    </PropertiesPageErrorBoundary>
  );
}