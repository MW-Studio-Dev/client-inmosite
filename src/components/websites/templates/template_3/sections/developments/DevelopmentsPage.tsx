'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiMapPin,
  FiX,
  FiSearch,
  FiSliders,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiXCircle,
  FiHome,
  FiStar,
  FiPhone
} from 'react-icons/fi';
import { Navbar, TopHeader, Footer } from '../layout';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';
import { useProperties } from '@/hooks/useProperties';

// Interfaces
interface DevelopmentFilters {
  status: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  deliveryYear: string;
  amenities: string[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

// Funciones de utilidad para colores adaptativos
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

const DevelopmentsPage = ({ subdomain }: { subdomain: string }) => {
  const { config, loading: configLoading } = useWebsiteConfigContext();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DevelopmentFilters>({
    status: 'todos',
    type: 'todos',
    minPrice: '',
    maxPrice: '',
    location: '',
    deliveryYear: 'todos',
    amenities: []
  });

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 9,
    totalItems: 0
  });

  // API state management - filtrando solo desarrollos/emprendimientos
  const { properties, loading, error } = useProperties({ subdomain,isDevelopment:true });

  // Filtrar solo las propiedades que son emprendimientos (is_development = true)
  const developments = useMemo(() => {
    return properties.filter(property => property.is_development === true);
  }, [properties]);

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

  // Función para renderizar el logo
  const renderLogo = (size: 'desktop' | 'mobile' = 'desktop') => {
    if (!config) return null;
    const logo = config.company.logo;

    if (typeof logo === 'string') {
      return (
        <span className={size === 'desktop' ? "text-2xl" : "text-xl"}>
          {logo}
        </span>
      );
    }

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

    return <span className="text-2xl">🏢</span>;
  };

  // Lógica de filtros y paginación con datos de la API
  const filteredDevelopments = useMemo(() => {
    return developments.filter(development => {
      // Filtro por ubicación
      if (filters.location && !development.location_display.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Filtro por rango de precios
      if (filters.minPrice && Number(development.price_usd) < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && Number(development.price_usd) > parseFloat(filters.maxPrice)) return false;

      return true;
    });
  }, [developments, filters]);

  const paginatedDevelopments = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredDevelopments.slice(startIndex, endIndex);
  }, [filteredDevelopments, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredDevelopments.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems: filteredDevelopments.length,
      currentPage: 1
    }));
  }, [filteredDevelopments, pagination.itemsPerPage]);

  const FilterSidebar: React.FC = () => {
    if (!config) return null;

    return (
      <>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-10
          w-80 lg:w-72 xl:w-80
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
          style={{ backgroundColor: config.colors.surface }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h2
                style={{ color: config.colors.text }}
                className="text-xl font-bold flex items-center"
              >
                <FiFilter className="h-5 w-5 mr-2" style={{ color: config.colors.primary }} />
                Filtrar Emprendimientos
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1"
              >
                <FiX className="h-6 w-6" style={{ color: config.colors.text }} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Búsqueda por ubicación */}
              <div>
                <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                  Buscar por ubicación
                </label>
                <div className="relative">
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: config.colors.textLight }}
                  />
                  <input
                    type="text"
                    placeholder="Centro, Norte, Sur..."
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    style={{
                      backgroundColor: config.colors.background,
                      color: config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rango de precios */}
              <div>
                <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                  Rango de Precios
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Desde"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    style={{
                      backgroundColor: config.colors.background,
                      color: config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Hasta"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    style={{
                      backgroundColor: config.colors.background,
                      color: config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Botón limpiar filtros */}
              <div className="pt-4 border-t" style={{ borderColor: config.colors.textLight + '20' }}>
                <button
                  onClick={() => {
                    setFilters({
                      status: 'todos',
                      type: 'todos',
                      minPrice: '',
                      maxPrice: '',
                      location: '',
                      deliveryYear: 'todos',
                      amenities: []
                    });
                    setIsSidebarOpen(false);
                  }}
                  style={{
                    backgroundColor: config.colors.secondary,
                    color: getAdaptiveTextColor(config.colors.secondary)
                  }}
                  className="w-full py-3 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                >
                  <FiXCircle className="h-4 w-4" />
                  <span>Limpiar Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  };

  // Área principal con resultados
  const MainContent: React.FC = () => {
    if (!config) return null;

    return (
      <main className="flex-1 min-h-screen" style={{ backgroundColor: config.colors.background }}>
        {/* Header de resultados */}
        <div style={{ backgroundColor: config.colors.surface }} className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1
                style={{ color: config.colors.text }}
                className="text-2xl lg:text-3xl font-bold mb-2"
              >
                Emprendimientos
              </h1>
              <p style={{ color: config.colors.textLight }} className="text-sm">
                {loading ? 'Cargando...' : `${pagination.totalItems} emprendimientos encontrados • Mostrando ${paginatedDevelopments.length} resultados`}
              </p>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                backgroundColor: config.colors.primary,
                color: adaptiveColors.primaryText
              }}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            >
              <FiSliders className="h-4 w-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!loading && !error && paginatedDevelopments.length === 0 && (
          <div className="p-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🏗️</div>
                <h2 style={{ color: config.colors.text }} className="text-xl font-bold mb-2">
                  No se encontraron emprendimientos
                </h2>
                <p style={{ color: config.colors.textLight }} className="mb-4">
                  Intenta ajustar los filtros para ver más resultados
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid de emprendimientos */}
        {!loading && !error && paginatedDevelopments.length > 0 && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedDevelopments.map((development) => {
                // Validar que la imagen exista y sea una URL válida
                const imageUrl = development.featured_image_url;
                const hasFailedBefore = imageUrl ? failedImages.has(imageUrl) : false;
                const hasValidImage = imageUrl &&
                                      imageUrl.trim() !== '' &&
                                      imageUrl !== '/' &&
                                      !imageUrl.includes('undefined') &&
                                      !hasFailedBefore;

                const handleImageError = () => {
                  if (imageUrl) {
                    setFailedImages(prev => new Set(prev).add(imageUrl));
                  }
                };

                return (
                  <div
                    key={development.id}
                    style={{ backgroundColor: config.colors.surface }}
                    className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-64">
                      {hasValidImage && imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={development.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          // onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <FiHome className="h-16 w-16 mx-auto mb-2" style={{ color: config.colors.textLight }} />
                            <p className="text-sm" style={{ color: config.colors.textLight }}>
                              Sin imagen
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Badge destacado */}
                    {development.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span
                          style={{ backgroundColor: config.colors.warning }}
                          className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center"
                        >
                          <FiStar className="h-3 w-3 mr-1" />
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Título */}
                    <div className="mb-4">
                      <h3
                        style={{ color: config.colors.text }}
                        className="text-xl font-bold mb-1"
                      >
                        {development.title}
                      </h3>
                     
                    </div>

                    {/* Ubicación */}
                    <div className="flex items-center mb-4" style={{ color: config.colors.textLight }}>
                      <FiMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{development.location_display}</span>
                    </div>

                    {/* Precio */}
                    <div className="mb-4">
                      <span
                        style={{ color: config.colors.primary }}
                        className="text-lg font-bold"
                      >
                        {development.price_display}
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                      <a
                        href={`/developments/${development.id}`}
                        style={{
                          backgroundColor: config.colors.primary,
                          color: adaptiveColors.primaryText
                        }}
                        className="flex-1 py-3 rounded-lg transition-colors duration-200 font-semibold text-sm text-center"
                      >
                        Ver Detalles
                      </a>
                      <a
                        href={`https://wa.me/${config.company.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el emprendimiento ${development.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: config.colors.success,
                          color: 'white'
                        }}
                        className="px-4 py-3 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <FiPhone className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div style={{ color: config.colors.textLight }}>
                  Página {pagination.currentPage} de {pagination.totalPages}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    style={{
                      backgroundColor: pagination.currentPage === 1 ? config.colors.surface : config.colors.background,
                      color: pagination.currentPage === 1 ? config.colors.textLight : config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="p-2 border rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                        style={{
                          backgroundColor: pagination.currentPage === pageNum ? config.colors.primary : config.colors.background,
                          color: pagination.currentPage === pageNum ? adaptiveColors.primaryText : config.colors.text,
                          borderColor: pagination.currentPage === pageNum ? config.colors.primary : config.colors.textLight + '30'
                        }}
                        className="px-3 py-2 border rounded-lg transition-colors font-medium"
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    style={{
                      backgroundColor: pagination.currentPage === pagination.totalPages ? config.colors.surface : config.colors.background,
                      color: pagination.currentPage === pagination.totalPages ? config.colors.textLight : config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="p-2 border rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    );
  };

  // WhatsApp Button
  const WhatsAppButton: React.FC = () => {
    if (!config) return null;

    return (
      <a
        href={`https://wa.me/${config.company.whatsapp}?text=${encodeURIComponent(config.sections.contact.info.methods.whatsapp.message || '¡Hola! Me interesa conocer más sobre sus emprendimientos.')}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ backgroundColor: config.colors.success }}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-50 transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
        </svg>
      </a>
    );
  };

  // Mobile Menu
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
                <FiX className="h-6 w-6" style={{ color: config.colors.text }} />
              </button>
            </div>

            <div className="space-y-6">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <span style={{ color: config.colors.textLight }} className="block py-2 text-lg">
                  Inicio
                </span>
              </Link>
              <Link href="/list" onClick={() => setIsMenuOpen(false)}>
                <span style={{ color: config.colors.textLight }} className="block py-2 text-lg">
                  Propiedades
                </span>
              </Link>
              <span
                style={{
                  color: config.colors.primary,
                  fontWeight: config.typography.fontWeight.semibold
                }}
                className="block py-2 text-lg"
              >
                Emprendimientos
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

  // Solo mostrar loading si NO tenemos config Y estamos cargando
  // Esto evita el error de removeChild cuando navegamos entre páginas
  if (!config && configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // Si no hay config después de cargar, mostrar error
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900">Error al cargar configuración</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la configuración del sitio</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: config?.colors.background }} className="min-h-screen">
     

      <div className="flex">
        <FilterSidebar />
        <MainContent />
      </div>

    </div>
  );
};

export default DevelopmentsPage;
