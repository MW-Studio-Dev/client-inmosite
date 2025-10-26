import { Metadata } from 'next';
import PropertyDetailPage from '@/components/websites/templates/template_1/sections/detail/PropertyDetailPage';


interface PropertyPageProps {
  params: Promise<{
    subdomain: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { subdomain, id } = await params;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/v1/properties/public/${subdomain}/properties/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      const property = data;

      return {
        title: property.meta_title || property.title,
        description: property.meta_description || property.description,
        openGraph: {
          title: property.title,
          description: property.description,
          images: property.featured_image_url ? [property.featured_image_url] : [],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: property.title,
          description: property.description,
          images: property.featured_image_url ? [property.featured_image_url] : [],
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