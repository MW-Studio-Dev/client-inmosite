'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  HomeIcon,
  Square3Stack3DIcon,
  BuildingOfficeIcon,
  CubeIcon,
  CalendarDaysIcon,
  TruckIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";
import Footer from '../layout/Footer';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';
import { PropertyDetailPageProps, transformApiPropertyToInternal, ContactFormData } from './types';
import {
  getAdaptiveTextColor,
  formatDisplayPrice,
  getStatusText,
  mockRelatedProperties
} from './utils';

// Import components
import ImageZoomModal from './components/ImageZoomModal';
import ImageGallery from './components/ImageGallery';
import PropertyInfo from './components/PropertyInfo';
import AmenitiesSection from './components/AmenitiesSection';
import MapSection from './components/MapSection';
import ContactSection from './components/ContactSection';
import ContactModal from './components/ContactModal';
import RelatedProperties from './components/RelatedProperties';
import Navbar from '../layout/Header';
import { generatePropertySchema, generateBreadcrumbSchema } from '@/lib/seo';

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ subdomain, propertyId }) => {
  // ALL HOOKS MUST BE DECLARED FIRST, BEFORE ANY CONDITIONAL RETURNS
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [relatedProperties] = useState(mockRelatedProperties);
  const [showUSD, setShowUSD] = useState(true);
  const [showMap, setShowMap] = useState(false);

  // Estado para el modal de contacto
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
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

  // Funciones para el modal de contacto
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

  // Función para obtener el color del status
  const getStatusColor = (status: 'sale' | 'rent') => {
    return status === 'sale' ? templateConfig?.colors.primary : templateConfig?.colors.success;
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
              <ImageGallery
                images={displayImages}
                currentImageIndex={currentImageIndex}
                onImageChange={changeImage}
                onImageSelect={setCurrentImageIndex}
                onZoomOpen={openZoom}
                property={property}
                templateConfig={templateConfig}
                apiProperty={apiProperty}
              />
              <PropertyInfo
                property={property}
                templateConfig={templateConfig}
                formatPrice={formatPrice}
                showUSD={showUSD}
                setShowUSD={setShowUSD}
                getFeatureIcon={getFeatureIcon}
                apiProperty={apiProperty}
              />
              <AmenitiesSection
                amenities={property.amenities}
                templateConfig={templateConfig}
              />
              <MapSection
                property={property}
                templateConfig={templateConfig}
                showMap={showMap}
                setShowMap={setShowMap}
              />
            </div>

            {/* Sidebar sticky */}
            <div className="lg:col-span-1">
              <ContactSection
                property={property}
                templateConfig={templateConfig}
                apiProperty={apiProperty}
                onContactOpen={openContactModal}
                formatPrice={formatPrice}
                showUSD={showUSD}
              />
            </div>
          </div>

          {/* Sección de propiedades relacionadas */}
          <div className="mt-12">
            <RelatedProperties
              relatedProperties={relatedProperties}
              templateConfig={templateConfig}
              getStatusColor={getStatusColor}
            />
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

        {/* Modal de contacto */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          property={property}
          templateConfig={templateConfig}
          apiProperty={apiProperty}
          contactFormData={contactFormData}
          onContactFormChange={handleContactFormChange}
          onContactSubmit={handleContactSubmit}
          isSubmittingContact={isSubmittingContact}
          contactSubmitted={contactSubmitted}
        />
      </div>
    </>
  );
};

export default PropertyDetailPage;