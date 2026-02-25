// Utilidades para el PropertyDetailPage

export const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export const getAdaptiveTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

export const formatDisplayPrice = (priceUsd: string, priceArs: string, currency: 'USD' | 'ARS') => {
  if (currency === 'USD') {
    const amount = parseFloat(priceUsd);
    return `US$ ${amount.toLocaleString()}`;
  } else {
    const amount = parseFloat(priceArs);
    return `$ ${amount.toLocaleString()}`;
  }
};

export const getStatusText = (status: 'sale' | 'rent') => {
  return status === 'sale' ? 'En Venta' : 'En Alquiler';
};

export const getGoogleMapsEmbedUrl = (lat: number, lng: number, address: string) => {
  return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

export const mockRelatedProperties = [
  {
    id: 2,
    title: "Apartamento Moderno en el Centro",
    price: { usd: 280000, ars: 252000000 },
    status: "sale" as const,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: "180 m²"
  },
  {
    id: 3,
    title: "Casa de Campo con Piscina",
    price: { usd: 450000, ars: 405000000 },
    status: "rent" as const,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bedrooms: 5,
    bathrooms: 4,
    area: "320 m²"
  },
  {
    id: 4,
    title: "Loft Moderno Industrial",
    price: { usd: 320000, ars: 288000000 },
    status: "sale" as const,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bedrooms: 2,
    bathrooms: 2,
    area: "150 m²"
  }
];