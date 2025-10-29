import { Metadata } from 'next';
import PropertyDetailPage from '@/components/websites/templates/template_1/sections/detail/PropertyDetailPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';

interface PropertyPageProps {
  params: Promise<{
    subdomain: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { subdomain, id } = await params;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/properties/public/${subdomain}/properties/${id}`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });
    
    if (response.ok) {
      const data = await response.json();
      const property = data;
      const propertyUrl = `${siteUrl}/s/${subdomain}/properties/${id}`;

      return {
        title: property.meta_title || `${property.title} - ${subdomain}`,
        description: property.meta_description || property.description || 'Propiedad inmobiliaria disponible',
        keywords: property.keywords || ['propiedad', 'inmobiliaria', property.type, property.location],
        openGraph: {
          title: property.title,
          description: property.description || property.meta_description || 'Propiedad inmobiliaria disponible',
          url: propertyUrl,
          images: property.featured_image_url ? [
            {
              url: property.featured_image_url,
              width: 1200,
              height: 630,
              alt: property.title,
            }
          ] : [],
          type: 'website',
          siteName: subdomain,
        },
        twitter: {
          card: 'summary_large_image',
          title: property.title,
          description: property.description || property.meta_description || 'Propiedad inmobiliaria disponible',
          images: property.featured_image_url ? [property.featured_image_url] : [],
        },
        alternates: {
          canonical: propertyUrl,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching property metadata:', error);
  }

  return {
    title: 'Propiedad | Inmobiliaria',
    description: 'Detalles de la propiedad',
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { subdomain, id } = await params;

  return (
      <>
        <PropertyDetailPage subdomain={subdomain} propertyId={id} />
      </>
  )
}