import { PropertyDetail } from '@/types/property';

export interface PropertyDetailPageProps {
  subdomain: string;
  propertyId: string;
}

export interface InternalPropertyDetail {
  id: string;
  title: string;
  type: string;
  status: 'sale' | 'rent';
  price: {
    usd: number;
    ars: number;
    period?: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary?: boolean;
  }>;
  description: string;
  features: Array<{
    id: string;
    name: string;
    value: string | number;
    type: string;
    icon?: string;
  }>;
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    agent: {
      name: string;
      phone: string;
      email: string;
      image: string;
    };
    office: {
      name: string;
      phone: string;
      email: string;
    };
  };
  amenities: string[];
  nearbyPlaces: Array<{
    name: string;
    distance: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
  virtualTour?: string;
  floorPlan?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  message: string;
}

export interface RelatedProperty {
  id: number;
  title: string;
  price: {
    usd: number;
    ars: number;
  };
  status: 'sale' | 'rent';
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
}

// Transform API data to internal format
export const transformApiPropertyToInternal = (apiProperty: PropertyDetail): InternalPropertyDetail => {
  return {
    id: String(apiProperty.id),
    title: apiProperty.title,
    type: apiProperty.property_type,
    status: apiProperty.operation_type === 'venta' ? 'sale' : 'rent',
    price: {
      usd: parseFloat(apiProperty.price_usd),
      ars: parseFloat(apiProperty.price_ars),
    },
    images: apiProperty.images?.map((url, index) => ({
      id: index.toString(),
      url: url,
      alt: `${apiProperty.title} - Imagen ${index + 1}`,
      isPrimary: index === 0
    })) || (apiProperty.featured_image_url ? [{
      id: '0',
      url: apiProperty.featured_image_url,
      alt: apiProperty.title,
      isPrimary: true
    }] : []),
    description: apiProperty.description,
    features: [
      { id: '1', name: 'Habitaciones', value: apiProperty.bedrooms, type: 'number' },
      { id: '2', name: 'Baños', value: apiProperty.bathrooms, type: 'number' },
      { id: '3', name: 'Área Total', value: `${apiProperty.surface_total} m²`, type: 'area' },
      { id: '4', name: 'Año de Construcción', value: apiProperty.age_years || 'N/A', type: 'number' },
      { id: '5', name: 'Estacionamientos', value: apiProperty.garage_spaces, type: 'number' },
      { id: '6', name: 'Pisos', value: apiProperty.floor || 'N/A', type: 'number' }
    ].filter(f => f.value !== null && f.value !== undefined),
    location: {
      address: apiProperty.address,
      neighborhood: apiProperty.neighborhood,
      city: apiProperty.city,
      state: apiProperty.province,
      country: 'Argentina',
      coordinates: {
        lat: -34.6037,
        lng: -58.3816
      }
    },
    contact: {
      agent: {
        name: 'Agente Especializado',
        phone: '+54 11 1234-5678',
        email: 'agente@inmobiliaria.com',
        image: '/default-agent.jpg'
      },
      office: {
        name: 'Oficina Principal',
        phone: '+54 11 1234-5678',
        email: 'info@inmobiliaria.com'
      }
    },
    amenities: apiProperty.features || [],
    nearbyPlaces: [
      { name: 'Transporte Público', distance: '500m', type: 'transport' },
      { name: 'Centros Comerciales', distance: '1km', type: 'shopping' },
      { name: 'Colegios', distance: '800m', type: 'school' },
      { name: 'Hospitales', distance: '2km', type: 'hospital' },
      { name: 'Parques', distance: '600m', type: 'park' }
    ],
    createdAt: apiProperty.created_at,
    updatedAt: apiProperty.updated_at,
    virtualTour: undefined,
    floorPlan: undefined
  };
};