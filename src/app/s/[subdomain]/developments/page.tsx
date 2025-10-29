import type { Metadata } from 'next';
import DevelopmentsPage from "@/components/websites/templates/template_1/sections/developments/DevelopmentsPage";
import { fetchPublicWebsiteConfig } from '@/lib/website-api';

interface DevelopmentsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function generateMetadata({ params }: DevelopmentsPageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const websiteConfig = await fetchPublicWebsiteConfig(subdomain);

  if (websiteConfig?.success && websiteConfig.data) {
    const company = websiteConfig.data.company;
    const seo = websiteConfig.data.seo;

    const title = `Emprendimientos - ${company?.name || subdomain}`;
    const description = `Descubre nuestros emprendimientos inmobiliarios en ${company?.name || subdomain}. Proyectos exclusivos y de calidad.`;

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
    title: `Emprendimientos - ${subdomain}`,
    description: 'Descubre nuestros emprendimientos inmobiliarios.',
  };
}

export default async function DevelopmentPage({params}:DevelopmentsPageProps) {
  const { subdomain } = await params;
  return <>
  <DevelopmentsPage subdomain={subdomain}/>
  </>;
}