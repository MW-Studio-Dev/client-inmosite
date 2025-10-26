// app/s/[subdomain]/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DynamicWebsiteClient from '@/components/websites/templates/DynamicWebsiteClient';

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
export async function generateMetadata({ params }: WebsitePageProps) {
  const headersList = await headers();
  const awaitedParams = await params;
  const companyName = headersList.get('x-company-name') || awaitedParams.subdomain;

  return {
    title: `${companyName} - Inmobiliaria`,
    description: `Encuentra las mejores propiedades con ${companyName}. Casas, apartamentos y locales comerciales.`,
    keywords: `inmobiliaria, propiedades, ${companyName}, casas, apartamentos`,
  };
}