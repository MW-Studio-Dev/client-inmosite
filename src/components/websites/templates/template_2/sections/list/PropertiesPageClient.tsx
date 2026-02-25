'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPinIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XCircleIcon,
  HomeIcon
} from "@heroicons/react/24/outline";
import Navbar from '../layout/Header';
import TopHeader from '../layout/TopHeader';
import Footer from '../layout/Footer';
import { useProperties } from '@/hooks/useProperties';
import { TemplateConfig } from '@/components/websites/templates/template_1/types';

// Interfaces 
interface PropertyFilters {
  type: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

// Placeholder image for properties without images
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

// Funciones de utilidad para colores adaptativos
const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

const getAdaptiveTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

interface PropertiesPageClientProps {
  subdomain: string;
  initialConfig: any; // La config que viene del servidor
}

const PropertiesPageClient: React.FC<PropertiesPageClientProps> = ({subdomain, initialConfig}) => {
  // Transformar initialConfig a TemplateConfig si es necesario
  const config = initialConfig as TemplateConfig;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [failedImages] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
    totalItems: 0
  });

  // API state management
  const {properties, loading, error} = useProperties({subdomain})

  // Reset component state when subdomain changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [subdomain]);
  // Colores adaptativos usando el config
  const adaptiveColors = config ? {
    primaryText: getAdaptiveTextColor(config.colors.primary),
    accentText: getAdaptiveTextColor(config.colors.accent),
    backgroundText: getAdaptiveTextColor(config.colors.background),
    surfaceText: getAdaptiveTextColor(config.colors.surface)
  } : {
    primaryText: '#000000',
    accentText: '#000000',
    backgroundText: '#000000',
    surfaceText: '#000000'
  };

  // Función para renderizar el logo (similar al Navbar y Footer)
  const renderLogo = (size: 'desktop' | 'mobile' = 'desktop') => {
    if (!config) return null;
    const logo = config.company.logo;
    
    // Si es string, es un emoji
    if (typeof logo === 'string') {
      return (
        <span className={size === 'desktop' ? "text-2xl" : "text-xl"}>
          {logo}
        </span>
      );
    }
    
    // Si es objeto, es configuración de imagen
    if (typeof logo === 'object' && logo.type === 'image') {
      // Validar que logo.src no esté vacío - NO renderizar Image si está vacío
      if (!logo.src || logo.src.trim() === '' || logo.src === '/') {
        // Retornar fallback sin logging en producción
        return <span className="text-2xl">🏢</span>;
      }

      const defaultWidth = size === 'desktop' ? 40 : 32;
      const defaultHeight = size === 'desktop' ? 40 : 32;
      const logoUrl = `${process.env.NEXT_PUBLIC_API_MEDIA}${logo.src}`;

      return (
        <div className={`relative ${size === 'desktop' ? 'h-10 w-auto' : 'h-8 w-auto'}`}>
          <Image
            src={logoUrl}
            alt={logo.alt || config.company.name}
            width={logo.width || defaultWidth}
            height={logo.height || defaultHeight}
            className="object-contain"
            priority
          />
        </div>
      );
    }
    
    // Fallback
    return <span className="text-2xl">🏢</span>;
  };


  // Área principal con resultados
  const MainContent: React.FC = () => {
    if (!config) return null;

    return (
    <main className="flex-1 min-h-screen bg-white">
      {/* Header de resultados - Minimalista */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1
            style={{ color: config.colors.text }}
            className="text-5xl lg:text-6xl font-bold mb-4"
          >
            Properties
          </h1>
          <p style={{ color: config.colors.textLight }} className="text-lg">
            {loading ? 'Loading...' : `${pagination.totalItems} properties available`}
          </p>
        </div>

      {/* Loading State */}
      {/* {loading && (
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: config.colors.primary }}></div>
              <p style={{ color: config.colors.textLight }} className="mt-4">Cargando propiedades...</p>
            </div>
          </div>
        </div>
      )} */}

      {/* Error State
      {error && !loading && (
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 style={{ color: config.colors.text }} className="text-xl font-bold mb-2">
                Error al cargar propiedades
              </h2>
              <p style={{ color: config.colors.textLight }} className="mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText
                }}
                className="px-6 py-2 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

   
      {!loading && !error && properties.length === 0 && (
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🏠</div>
              <h2 style={{ color: config.colors.text }} className="text-xl font-bold mb-2">
                No se encontraron propiedades
              </h2>
              <p style={{ color: config.colors.textLight }} className="mb-4">
                Intenta ajustar los filtros para ver más resultados
              </p>
            </div>
          </div>
        </div>
      )} 
      */}

      {/* Grid de propiedades */}
      {!loading && !error && properties.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              // Validar que la imagen exista y sea una URL válida
              const imageUrl = property.featured_image_url;
              const hasFailedBefore = imageUrl ? failedImages.has(imageUrl) : false;
              const hasValidImage = imageUrl &&
                                    imageUrl.trim() !== '' &&
                                    imageUrl !== '/' &&
                                    !imageUrl.includes('undefined') &&
                                    !hasFailedBefore;

              return (
                <a
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group block"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                    {hasValidImage && imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <HomeIcon className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 style={{ color: config.colors.text }} className="text-lg font-semibold line-clamp-1">
                        {property.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-1 flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                      {property.location_display}
                    </p>

                    <p style={{ color: config.colors.text }} className="text-xl font-bold">
                      {property.price_display}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" style={{ color: config.colors.text }} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                        style={{
                          backgroundColor: pagination.currentPage === pageNum ? config.colors.text : 'transparent',
                          color: pagination.currentPage === pageNum ? 'white' : config.colors.text
                        }}
                        className="w-10 h-10 rounded-full text-sm font-medium transition-colors hover:bg-gray-100"
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" style={{ color: config.colors.text }} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </main>
    );
  };

  // WhatsApp Button usando config
  const WhatsAppButton: React.FC = () => {
    if (!config) return null;

    return (
      <a
        href={`https://wa.me/${config.company.whatsapp}?text=${encodeURIComponent(config.sections.contact.info.methods.whatsapp.message || '¡Hola! Me interesa conocer más sobre sus propiedades.')}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ backgroundColor: config.colors.success }}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-50 transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
      </svg>
    </a>
    );
  };

  // Mobile Menu usando config con logo actualizado
  const MobileMenu: React.FC = () => {
    if (!config) return null;

    return (
    <>
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
      )}
      <div 
        className={`
          lg:hidden fixed top-0 right-0 h-full w-80 z-50
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ backgroundColor: config.colors.background }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              {renderLogo('mobile')}
              <h2 style={{ color: config.colors.text }} className="text-lg font-bold">
                {config.company.name}
              </h2>
            </div>
            <button onClick={() => setIsMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" style={{ color: config.colors.text }} />
            </button>
          </div>
          
          <div className="space-y-6">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <span style={{ color: config.colors.textLight }} className="block py-2 text-lg">
                Inicio
              </span>
            </Link>
            <span 
              style={{ 
                color: config.colors.primary,
                fontWeight: config.typography.fontWeight.semibold
              }} 
              className="block py-2 text-lg"
            >
              Propiedades
            </span>
            <Link href="/#nosotros" onClick={() => setIsMenuOpen(false)}>
              <span style={{ color: config.colors.textLight }} className="block py-2 text-lg">
                Nosotros
              </span>
            </Link>
            <Link href="/#contacto" onClick={() => setIsMenuOpen(false)}>
              <span style={{ color: config.colors.textLight }} className="block py-2 text-lg">
                Contacto
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
    );
  };

  // Solo mostrar loading si NO tenemos config
  // Esto evita el error de removeChild cuando navegamos entre páginas
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopHeader config={config} />
      <Navbar config={config} adaptiveColors={adaptiveColors} subdomain={subdomain}/>
      <MobileMenu />
      <MainContent />
      <Footer config={config} adaptiveColors={adaptiveColors} />
      <WhatsAppButton />
    </div>
  );
};

export default PropertiesPageClient;
