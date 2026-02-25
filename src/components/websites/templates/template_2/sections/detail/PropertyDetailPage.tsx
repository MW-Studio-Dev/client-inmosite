'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPinIcon,
  XMarkIcon,
  HomeIcon,
  Square3Stack3DIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  CubeIcon,
  CalendarDaysIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  CurrencyDollarIcon,
  MapIcon,
  TagIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import Footer from '../layout/Footer';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';
import { PropertyDetail as PropertyDetailType } from '@/types/property';
import Navbar from '../layout/Header';
import { generatePropertySchema, generateBreadcrumbSchema } from '@/lib/seo';

interface PropertyDetailPageProps {
  subdomain: string;
  propertyId: string;
}

// Transform API data to internal format
const transformApiPropertyToInternal = (apiProperty: PropertyDetailType): InternalPropertyDetail => {
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
    amenities: (apiProperty.features || []).map((f: any) => {
      if (typeof f === 'string') return f;
      if (typeof f === 'object' && f !== null) return f.feature || f.name || f.value || '';
      return '';
    }).filter((f: string) => f.length > 0),
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

// Internal interface for the component
interface InternalPropertyDetail {
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

// Utilidades
const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

const getAdaptiveTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

// Función para formatear precios desde strings de la API
const formatDisplayPrice = (priceUsd: string, priceArs: string, currency: 'USD' | 'ARS') => {
  if (currency === 'USD') {
    const amount = parseFloat(priceUsd);
    return `US$ ${amount.toLocaleString()}`;
  } else {
    const amount = parseFloat(priceArs);
    return `$ ${amount.toLocaleString()}`;
  }
};

// Función para obtener iconos según el tipo de característica
const getFeatureIcon = (featureName: string) => {
  const name = featureName.toLowerCase();
  if (name.includes('habitación') || name.includes('dormitorio')) {
    return <HomeIcon className="h-6 w-6" />;
  }
  if (name.includes('baño')) {
    return <BuildingOfficeIcon className="h-6 w-6" />;
  }
  if (name.includes('área') || name.includes('superficie')) {
    return <CubeIcon className="h-6 w-6" />;
  }
  if (name.includes('año') || name.includes('construcción')) {
    return <CalendarDaysIcon className="h-6 w-6" />;
  }
  if (name.includes('estacionamiento') || name.includes('garage')) {
    return <TruckIcon className="h-6 w-6" />;
  }
  if (name.includes('piso')) {
    return <BuildingStorefrontIcon className="h-6 w-6" />;
  }
  return <Square3Stack3DIcon className="h-6 w-6" />;
};

// Mock data para propiedades relacionadas
const mockRelatedProperties = [
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

// Componente de Zoom de Imágenes (MANTENIDO IGUAL)
const ImageZoomModal: React.FC<{
  isOpen: boolean;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary?: boolean;
  }>;
  currentIndex: number;
  onClose: () => void;
  onChangeImage: (index: number) => void;
}> = ({ isOpen, images, currentIndex, onClose, onChangeImage }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between items-center z-10">
        <div className="text-white text-lg font-semibold">
          {currentIndex + 1} / {images.length} - {images[currentIndex].alt}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50"
          >
            <MagnifyingGlassMinusIcon className="h-6 w-6" />
          </button>
          <span className="text-white min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50"
          >
            <MagnifyingGlassPlusIcon className="h-6 w-6" />
          </button>
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onChangeImage(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full z-10"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          <button
            onClick={() => onChangeImage(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full z-10"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Image container */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            maxWidth: '90vw',
            maxHeight: '80vh'
          }}
        >
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            width={1200}
            height={800}
            className="object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onChangeImage(index)}
              className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ subdomain, propertyId }) => {
  // ALL HOOKS MUST BE DECLARED FIRST, BEFORE ANY CONDITIONAL RETURNS
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [relatedProperties] = useState(mockRelatedProperties);
  const [showUSD, setShowUSD] = useState(true);
  const [showMap, setShowMap] = useState(false);
  
  // NUEVO: Estado para el modal de contacto
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // API calls - hooks must always be called
  const { config: templateConfig, loading: configLoading } = useWebsiteConfigContext();
  const { property: apiProperty, loading: propertyLoading, error: propertyError } = usePropertyDetail(subdomain, propertyId);

  // Transform API property to internal format
  const property = apiProperty ? transformApiPropertyToInternal(apiProperty) : null;

  // Default image if no images available
  const displayImages = property?.images && property.images.length > 0 ? property.images : [{
    id: '0',
    url: '/placeholder-property.jpg',
    alt: property?.title || 'Propiedad',
    isPrimary: true
  }];

  // Structured Data para SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';
  const propertyUrl = property ? `${siteUrl}/s/${subdomain}/properties/${propertyId}` : '';
  
  const structuredData = useMemo(() => {
    if (!property || !apiProperty) return null;

    const propertyImages = displayImages.map(img => {
      const imgUrl = img.url.startsWith('http') ? img.url : `${siteUrl}${img.url}`;
      return imgUrl;
    });

    const schemas = [
      generatePropertySchema({
        name: property.title,
        description: property.description || '',
        image: propertyImages,
        url: propertyUrl,
        address: {
          street: apiProperty.address,
          city: apiProperty.city,
          state: apiProperty.province,
        },
        rooms: apiProperty.bedrooms,
        area: apiProperty.surface_total ? parseFloat(apiProperty.surface_total) : undefined,
        price: apiProperty.operation_type === 'venta' 
          ? (apiProperty.price_usd || apiProperty.price_ars) 
          : undefined,
        currency: apiProperty.price_usd ? 'USD' : 'ARS',
      }),
      generateBreadcrumbSchema([
        { name: 'Inicio', url: `${siteUrl}/s/${subdomain}` },
        { name: 'Propiedades', url: `${siteUrl}/s/${subdomain}/properties` },
        { name: property.title, url: propertyUrl },
      ]),
    ];

    return schemas;
  }, [property, apiProperty, subdomain, propertyId, siteUrl, propertyUrl, displayImages]);

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [propertyId]);

  // Ensure currentImageIndex is within bounds
  useEffect(() => {
    if (currentImageIndex >= displayImages.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, displayImages.length]);

  // Función para cambiar imagen
  const changeImage = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev =>
        prev === 0 ? displayImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev =>
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }
  }, [displayImages.length]);

  const openZoom = () => {
    setIsZoomModalOpen(true);
  };

  // NUEVAS: Funciones para el modal de contacto
  const openContactModal = () => {
    setIsContactModalOpen(true);
    setContactSubmitted(false);
    setContactFormData({ name: '', phone: '', message: '' });
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactSubmitted(false);
    setContactFormData({ name: '', phone: '', message: '' });
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    
    // Simulación de envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmittingContact(false);
    setContactSubmitted(true);
    
    // Resetear el formulario después de 3 segundos
    setTimeout(() => {
      closeContactModal();
    }, 3000);
  };

  // Función para formatear precios usando los datos reales de la API
  const formatPrice = (currency: 'USD' | 'ARS') => {
    if (!apiProperty) return '';
    return formatDisplayPrice(apiProperty.price_usd, apiProperty.price_ars, currency);
  };

  // Función para obtener el texto del status
  const getStatusText = (status: 'sale' | 'rent') => {
    return status === 'sale' ? 'En Venta' : 'En Alquiler';
  };

  // Función para obtener el color del status
  const getStatusColor = (status: 'sale' | 'rent') => {
    return status === 'sale' ? templateConfig?.colors.primary : templateConfig?.colors.success;
  };

  // NOW HANDLE CONDITIONAL RETURNS AFTER ALL HOOKS
  // Early return for invalid props
  if (!subdomain || !propertyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Parámetros de propiedad inválidos</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Loading and error states
  if (configLoading || propertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (propertyError || !property || !templateConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {propertyError || 'Propiedad no encontrada'}
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const adaptiveColors = {
    primaryText: getAdaptiveTextColor(templateConfig.colors.primary),
    accentText: getAdaptiveTextColor(templateConfig.colors.accent),
    backgroundText: getAdaptiveTextColor(templateConfig.colors.background),
    surfaceText: getAdaptiveTextColor(templateConfig.colors.surface)
  };

  // Componente para el switch de moneda (MANTENIDO IGUAL)
  const CurrencyToggle: React.FC = () => (
    <div className="flex items-center space-x-3 mb-4">
      <span style={{ color: templateConfig.colors.textLight }} className="text-sm font-medium">
        Mostrar precio en:
      </span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setShowUSD(true)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            showUSD 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          USD
        </button>
        <button
          onClick={() => setShowUSD(false)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            !showUSD 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ARS
        </button>
      </div>
    </div>
  );

  // Componente del mapa con Google Maps embebido (MANTENIDO IGUAL)
  const MapSection: React.FC = () => {
    const getGoogleMapsEmbedUrl = (lat: number, lng: number, address: string) => {
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    };

    return (
      <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 
            style={{ color: templateConfig.colors.text }}
            className="text-xl font-bold"
          >
            Ubicación
          </h3>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{ 
              color: templateConfig.colors.primary,
              borderColor: templateConfig.colors.primary
            }}
            className="flex items-center space-x-2 px-3 py-2 border rounded-lg hover:bg-opacity-10 transition-colors text-sm"
          >
            <MapIcon className="h-4 w-4" />
            <span>{showMap ? 'Ocultar Mapa' : 'Ver en Mapa'}</span>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: templateConfig.colors.primary }} />
            <div>
              <p style={{ color: templateConfig.colors.text }} className="font-semibold">
                {property.location.address}
              </p>
              <p style={{ color: templateConfig.colors.textLight }} className="text-sm">
                {property.location.neighborhood}, {property.location.city}
              </p>
              <p style={{ color: templateConfig.colors.textLight }} className="text-sm">
                {property.location.state}, {property.location.country}
              </p>
            </div>
          </div>
        </div>

        {showMap && (
          <div className="mt-6">
            <div className="relative h-64 lg:h-80 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={getGoogleMapsEmbedUrl(
                  property.location.coordinates.lat, 
                  property.location.coordinates.lng,
                  property.location.address
                )}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${property.location.address}`}
                className="rounded-lg"
              />
              
              <div className="absolute top-3 right-3 flex space-x-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.location.coordinates.lat},${property.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-lg transition-all"
                  title="Abrir en Google Maps"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
                
                <button
                  onClick={() => {
                    const address = `${property.location.address}, ${property.location.neighborhood}, ${property.location.city}`;
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                    window.open(url, '_blank');
                  }}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-lg transition-all"
                  title="Cómo llegar"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
              <div className="mt-4">
                <h4 style={{ color: templateConfig.colors.text }} className="font-semibold mb-3">
                  Lugares de Interés Cercanos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.nearbyPlaces.slice(0, 6).map((place, index) => {
                    const getPlaceIcon = (type: string) => {
                      switch (type) {
                        case 'school': return '🏫';
                        case 'shopping': return '🛒';
                        case 'hospital': return '🏥';
                        case 'park': return '🌳';
                        case 'transport': return '🚇';
                        default: return '📍';
                      }
                    };

                    return (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getPlaceIcon(place.type)}</span>
                          <span style={{ color: templateConfig.colors.text }} className="text-sm">
                            {place.name}
                          </span>
                        </div>
                        <span style={{ color: templateConfig.colors.textLight }} className="text-xs font-semibold">
                          {place.distance}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps/search/servicios+near+${property.location.coordinates.lat},${property.location.coordinates.lng}`;
                      window.open(url, '_blank');
                    }}
                    style={{ color: templateConfig.colors.primary }}
                    className="text-sm hover:underline"
                  >
                    Ver más lugares cercanos en Google Maps
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Galería de imágenes mejorada (MANTENIDA IGUAL)
  const ImageGallery: React.FC = () => (
    <div className="space-y-4">
      <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden group cursor-pointer" onClick={openZoom}>
        {displayImages[currentImageIndex]?.url ? (
          <Image
            src={displayImages[currentImageIndex].url}
            alt={displayImages[currentImageIndex].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <HomeIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Imagen no disponible</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-800" />
          </div>
        </div>
        
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); changeImage('prev'); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); changeImage('next'); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute top-4 left-4 flex space-x-2">
          <span 
            style={{ 
              backgroundColor: property.status === 'sale' ? templateConfig.colors.primary : templateConfig.colors.success,
              color: 'white'
            }}
            className="px-3 py-1 rounded-full text-sm font-semibold"
          >
            {property.status === 'sale' ? 'En Venta' : 'En Alquiler'}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            style={{ backgroundColor: templateConfig.colors.surface }}
            className="p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ShareIcon className="h-5 w-5" style={{ color: templateConfig.colors.text }} />
          </button>
          <button 
            style={{ backgroundColor: templateConfig.colors.surface }}
            className="p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <HeartIcon className="h-5 w-5" style={{ color: templateConfig.colors.text }} />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {displayImages.length}
        </div>

        {apiProperty && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            {apiProperty.views_count} vistas
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <HomeIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Información principal con iconos mejorados (MANTENIDA IGUAL)
  const PropertyInfo: React.FC = () => (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
        <div className="flex-1">
          <h1 
            style={{ color: templateConfig.colors.text }}
            className="text-2xl lg:text-3xl font-bold mb-3"
          >
            {property.title}
          </h1>
          <div className="flex items-center mb-4" style={{ color: templateConfig.colors.textLight }}>
            <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-lg">
              {property.location.address}, {property.location.neighborhood}
            </span>
          </div>
        </div>
        
        <div className="flex-shrink-0 mt-4 lg:mt-0">
          <CurrencyToggle />
          <div
            style={{ color: templateConfig.colors.primary }}
            className="text-3xl lg:text-4xl font-bold"
          >
            {formatPrice(showUSD ? 'USD' : 'ARS')}
            {property.status === 'rent' && (
              <span className="text-lg text-gray-500">/mes</span>
            )}
          </div>
          <div
            style={{ color: templateConfig.colors.textLight }}
            className="text-sm mt-1"
          >
            {formatPrice(showUSD ? 'ARS' : 'USD')}
          </div>
          {apiProperty && (
            <div className="text-sm text-gray-500 mt-2">
              <p>Código: {apiProperty.internal_code}</p>
              <p className="font-medium text-gray-700">{apiProperty.main_features}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {property.features.slice(0, 6).map((feature) => (
          <div key={feature.id} className="text-center">
            <div 
              style={{ color: templateConfig.colors.primary }}
              className="flex justify-center mb-2"
            >
              {getFeatureIcon(feature.name)}
            </div>
            <div 
              style={{ color: templateConfig.colors.text }}
              className="font-semibold text-lg"
            >
              {feature.value}
            </div>
            <div 
              style={{ color: templateConfig.colors.textLight }}
              className="text-sm"
            >
              {feature.name}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6" style={{ borderColor: templateConfig.colors.textLight + '20' }}>
        <h3 
          style={{ color: templateConfig.colors.text }}
          className="text-xl font-bold mb-4"
        >
          Descripción
        </h3>
        <p 
          style={{ color: templateConfig.colors.textLight }}
          className="text-lg leading-relaxed"
        >
          {property.description}
        </p>
      </div>
    </div>
  );

  // Amenidades (MANTENIDA IGUAL)
  const AmenitiesSection: React.FC = () => (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <h3 
        style={{ color: templateConfig.colors.text }}
        className="text-xl font-bold mb-6"
      >
        Características y Amenidades
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {property.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              style={{ backgroundColor: templateConfig.colors.primary + '20' }}
              className="w-2 h-2 rounded-full flex-shrink-0"
            />
            <span 
              style={{ color: templateConfig.colors.text }}
              className="text-base"
            >
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // NUEVO: Componente Modal de Contacto
  const ContactModal: React.FC = () => {
    if (!isContactModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={closeContactModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <h2 className="text-2xl font-bold mb-4" style={{ color: templateConfig.colors.text }}>
            Contactar por esta propiedad
          </h2>
          
          {property && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${templateConfig.colors.primary}10` }}>
              <h3 className="font-semibold" style={{ color: templateConfig.colors.primary }}>
                {property.title}
              </h3>
              <p className="text-sm text-gray-600">
                {property.location.address}, {property.location.neighborhood}
              </p>
              <p className="text-sm text-gray-600">
                Código: {apiProperty?.internal_code || property.id}
              </p>
            </div>
          )}
          
          {contactSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Mensaje enviado!</h3>
              <p className="text-gray-600">Nos pondremos en contacto contigo pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleContactFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={contactFormData.phone}
                  onChange={handleContactFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+54 11 1234-5678"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  value={contactFormData.message}
                  onChange={handleContactFormChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hola, estoy interesado en esta propiedad..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmittingContact}
                style={{ backgroundColor: templateConfig.colors.primary }}
                className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmittingContact ? 'Enviando...' : 'Enviar consulta'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // MODIFICADA: Información de contacto con sticky mejorado y nuevo botón
  const ContactSection: React.FC = () => (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8 sticky top-8">
      <h3 
        style={{ color: templateConfig.colors.text }}
        className="text-xl font-bold mb-6"
      >
        Información de Contacto
      </h3>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={property.contact.agent.image || '/default-avatar.png'}
            alt={property.contact.agent.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 
            style={{ color: templateConfig.colors.text }}
            className="text-lg font-semibold"
          >
            {property.contact.agent.name}
          </h4>
          <p 
            style={{ color: templateConfig.colors.textLight }}
            className="text-sm"
          >
            Agente Especializado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* NUEVO: Botón Contactar que abre el modal */}
        <button
          onClick={openContactModal}
          style={{
            backgroundColor: templateConfig.colors.primary,
            color: 'white'
          }}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors duration-200 font-semibold hover:opacity-90"
        >
          <EnvelopeIcon className="h-5 w-5" />
          <span>Contactar</span>
        </button>
        
        <a
          href={`https://wa.me/${templateConfig.company.whatsapp}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}\nCódigo: ${apiProperty?.internal_code || ''}\nPrecio: ${formatPrice(showUSD ? 'USD' : 'ARS')}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: templateConfig.colors.success,
            color: 'white'
          }}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors duration-200 font-semibold hover:opacity-90"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: templateConfig.colors.textLight + '20' }}>
        <div className="text-center">
          <p style={{ color: templateConfig.colors.textLight }} className="text-sm mb-2">
            ID de Propiedad: {apiProperty?.internal_code || property.id}
          </p>
          <p style={{ color: templateConfig.colors.textLight }} className="text-sm">
            Última actualización: {new Date(property.updatedAt).toLocaleDateString('es-AR')}
          </p>
          {apiProperty && (
            <p style={{ color: templateConfig.colors.textLight }} className="text-sm">
              Estado: {apiProperty.status.charAt(0).toUpperCase() + apiProperty.status.slice(1)}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Sección de propiedades relacionadas (MANTENIDA IGUAL)
  const RelatedPropertiesSection: React.FC = () => (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <h3 
        style={{ color: templateConfig.colors.text }}
        className="text-2xl font-bold mb-6 text-center"
      >
        Otras propiedades que podrían gustarte
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProperties.map((relatedProperty) => (
          <div 
            key={relatedProperty.id}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: templateConfig.colors.background }}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={relatedProperty.image}
                alt={relatedProperty.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              <div className="absolute top-3 left-3">
                <span 
                  style={{ 
                    backgroundColor: getStatusColor(relatedProperty.status),
                    color: 'white'
                  }}
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {getStatusText(relatedProperty.status)}
                </span>
              </div>
              
              <div className="absolute top-3 right-3">
                <button className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all">
                  <HeartIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h4 
                style={{ color: templateConfig.colors.text }}
                className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
              >
                {relatedProperty.title}
              </h4>
              
              <div 
                style={{ color: templateConfig.colors.primary }}
                className="text-xl font-bold mb-1"
              >
                US$ {relatedProperty.price.usd.toLocaleString()}
              </div>
              
              <div
                style={{ color: templateConfig.colors.textLight }}
                className="text-sm mb-3"
              >
                $ {relatedProperty.price.ars.toLocaleString()}
              </div>
              
              <div className="flex justify-between text-sm" style={{ color: templateConfig.colors.textLight }}>
                <span className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-1" />
                  {relatedProperty.bedrooms} hab
                </span>
                <span className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {relatedProperty.bathrooms} baños
                </span>
                <span className="flex items-center">
                  <CubeIcon className="h-4 w-4 mr-1" />
                  {relatedProperty.area}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/properties">
          <button
            style={{ 
              backgroundColor: 'transparent',
              color: templateConfig.colors.primary,
              borderColor: templateConfig.colors.primary
            }}
            className="px-8 py-3 border-2 rounded-lg font-semibold hover:bg-opacity-10 transition-colors duration-200"
          >
            Ver Todas las Propiedades
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ backgroundColor: templateConfig.colors.background }} className="min-h-screen">
        {/* Breadcrumb y navegación */}
        <div style={{ backgroundColor: templateConfig.colors.surface }} className="py-4 px-6 border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/properties">
                <button 
                  style={{ 
                    color: templateConfig.colors.primary,
                    borderColor: templateConfig.colors.primary
                  }}
                  className="flex items-center space-x-2 border rounded-lg px-3 py-2 hover:bg-opacity-10 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Volver a Propiedades</span>
                </button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/" style={{ color: templateConfig.colors.textLight }}>Inicio</Link>
              <span style={{ color: templateConfig.colors.textLight }}>/</span>
              <Link href="/properties" style={{ color: templateConfig.colors.textLight }}>Propiedades</Link>
              <span style={{ color: templateConfig.colors.textLight }}>/</span>
              <span style={{ color: templateConfig.colors.text }}>Detalle</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery />
              <PropertyInfo />
              <AmenitiesSection />
              <MapSection />
            </div>
            
            {/* Sidebar sticky */}
            <div className="lg:col-span-1">
              <ContactSection />
            </div>
          </div>
          
          {/* Sección de propiedades relacionadas */}
          <div className="mt-12">
            <RelatedPropertiesSection />
          </div>
        </main>

        {/* Modal de zoom */}
        <ImageZoomModal
          isOpen={isZoomModalOpen}
          images={displayImages}
          currentIndex={currentImageIndex}
          onClose={() => setIsZoomModalOpen(false)}
          onChangeImage={setCurrentImageIndex}
        />

        {/* NUEVO: Modal de contacto */}
        <ContactModal />
      </div>
    </>
  );
};

export default PropertyDetailPage;
