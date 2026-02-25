// import { PropertyDetail as PropertyDetailType } from '@/types/property';
// import {
//   HomeIcon,
//   BuildingOfficeIcon,
//   CubeIcon,
//   CalendarDaysIcon,
//   TruckIcon,
//   BuildingStorefrontIcon,
//   Square3Stack3DIcon
// } from "@heroicons/react/24/outline";

// export const formatDisplayPrice = (priceUsd: string, priceArs: string, currency: 'USD' | 'ARS') => {
//   if (currency === 'USD') {
//     const amount = parseFloat(priceUsd);
//     return `US$ ${amount.toLocaleString()}`;
//   } else {
//     const amount = parseFloat(priceArs);
//     return `$ ${amount.toLocaleString()}`;
//   }
// };

// export const getStatusText = (status: 'sale' | 'rent') => {
//   return status === 'sale' ? 'En Venta' : 'En Alquiler';
// };

// export const getFeatureIcon = (featureName: string) => {
//   const name = featureName.toLowerCase();
//   if (name.includes('habitación') || name.includes('dormitorio')) {
//     return <HomeIcon className="h-6 w-6" />;
//   }
//   if (name.includes('baño')) {
//     return <BuildingOfficeIcon className="h-6 w-6" />;
//   }
//   if (name.includes('área') || name.includes('superficie')) {
//     return <CubeIcon className="h-6 w-6" />;
//   }
//   if (name.includes('año') || name.includes('construcción')) {
//     return (<CalendarDaysIcon />);
//   }
//   if (name.includes('estacionamiento') || name.includes('garage')) {
//     return <TruckIcon className="h-6 w-6" />;
//   }
//   if (name.includes('piso')) {
//     return <BuildingStorefrontIcon className="h-6 w-6" />;
//   }
//   return <Square3Stack3DIcon className="h-6 w-6" />;
// };

// export const transformApiPropertyToInternal = (apiProperty: PropertyDetailType) => {
//   return {
//     id: String(apiProperty.id),
//     title: apiProperty.title,
//     type: apiProperty.property_type,
//     status: apiProperty.operation_type === 'venta' ? 'sale' as const : 'rent' as const,
//     price: {
//       usd: parseFloat(apiProperty.price_usd),
//       ars: parseFloat(apiProperty.price_ars),
//     },
//     images: apiProperty.images?.map((url, index) => ({
//       id: index.toString(),
//       url: url,
//       alt: `${apiProperty.title} - Imagen ${index + 1}`,
//       isPrimary: index === 0
//     })) || (apiProperty.featured_image_url ? [{
//       id: '0',
//       url: apiProperty.featured_image_url,
//       alt: apiProperty.title,
//       isPrimary: true
//     }] : []),
//     description: apiProperty.description,
//     features: [
//       { id: '1', name: 'Habitaciones', value: apiProperty.bedrooms, type: 'number' },
//       { id: '2', name: 'Baños', value: apiProperty.bathrooms, type: 'number' },
//       { id: '3', name: 'Área Total', value: `${apiProperty.surface_total} m²`, type: 'area' },
//       { id: '4', name: 'Año de Construcción', value: apiProperty.age_years || 'N/A', type: 'number' },
//       { id: '5', name: 'Estacionamientos', value: apiProperty.garage_spaces, type: 'number' },
//       { id: '6', name: 'Pisos', value: apiProperty.floor || 'N/A', type: 'number' }
//     ].filter(f => f.value !== null && f.value !== undefined),
//     location: {
//       address: apiProperty.address,
//       neighborhood: apiProperty.neighborhood,
//       city: apiProperty.city,
//       state: apiProperty.province,
//       country: 'Argentina',
//       coordinates: {
//         lat: -34.6037,
//         lng: -58.3816
//       }
//     },
//     contact: {
//       agent: {
//         name: 'Agente Especializado',
//         phone: '+54 11 1234-5678',
//         email: 'agente@inmobiliaria.com',
//         image: '/default-agent.jpg'
//       },
//       office: {
//         name: 'Oficina Principal',
//         phone: '+54 11 1234-5678',
//         email: 'info@inmobiliaria.com'
//       }
//     },
//     amenities: apiProperty.features || [],
//     nearbyPlaces: [
//       { name: 'Transporte Público', distance: '500m', type: 'transport' },
//       { name: 'Centros Comerciales', distance: '1km', type: 'shopping' },
//       { name: 'Colegios', distance: '800m', type: 'school' },
//       { name: 'Hospitales', distance: '2km', type: 'hospital' },
//       { name: 'Parques', distance: '600m', type: 'park' }
//     ],
//     createdAt: apiProperty.created_at,
//     updatedAt: apiProperty.updated_at,
//     virtualTour: undefined,
//     floorPlan: undefined
//   };
// };