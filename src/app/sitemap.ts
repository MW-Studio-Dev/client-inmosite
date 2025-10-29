import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Nota: Para incluir propiedades dinámicas, puedes descomentar y adaptar el siguiente código:
  /*
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Obtener todas las propiedades publicadas
    const response = await fetch(`${apiUrl}/api/v1/properties/public`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
    });
    
    if (response.ok) {
      const data = await response.json();
      const properties = data.properties || [];
      
      const propertyRoutes = properties.map((prop: any) => ({
        url: `${siteUrl}/s/${prop.subdomain}/properties/${prop.id}`,
        lastModified: prop.updated_at ? new Date(prop.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
      
      return [...baseRoutes, ...propertyRoutes];
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }
  */

  return baseRoutes;
}

