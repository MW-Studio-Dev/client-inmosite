import type { Metadata } from 'next';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';

export const landingPageMetadata: Metadata = {
  title: "InmoSite - Plataforma de Gestión Inmobiliaria",
  description: "Gestiona tu inmobiliaria de forma profesional. Plataforma completa para administrar propiedades, clientes, alquileres y ventas. Crea tu sitio web inmobiliario en minutos.",
  keywords: ["gestión inmobiliaria", "software inmobiliario", "propiedades", "alquileres", "ventas", "inmobiliaria digital", "CRM inmobiliario"],
  openGraph: {
    title: "InmoSite - Plataforma de Gestión Inmobiliaria",
    description: "Gestiona tu inmobiliaria de forma profesional. Plataforma completa para administrar propiedades, clientes y más.",
    url: siteUrl,
    images: [
      {
        url: "/hero-image.webp",
        width: 1200,
        height: 630,
        alt: "InmoSite - Gestión Inmobiliaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InmoSite - Plataforma de Gestión Inmobiliaria",
    description: "Gestiona tu inmobiliaria de forma profesional",
    images: ["/hero-image.webp"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Structured Data para la página principal
export const landingPageStructuredData = [
  generateOrganizationSchema({
    name: "InmoSite",
    url: siteUrl,
    description: "Plataforma completa para la gestión de propiedades inmobiliarias",
  }),
  generateWebSiteSchema({
    searchUrl: `${siteUrl}/search`,
  }),
];

