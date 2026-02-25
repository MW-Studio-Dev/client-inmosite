'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
import { useProperties } from '@/hooks/useProperties';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';

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
}

const PropertiesPageClient: React.FC<PropertiesPageClientProps> = ({ subdomain }) => {
  const { config } = useWebsiteConfigContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<PropertyFilters>({
    type: 'todos',
    propertyType: 'todos',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: 'todos',
    bathrooms: 'todos',
    minArea: '',
    maxArea: ''
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
    totalItems: 0
  });

  // API state management
  const { properties, loading, error } = useProperties({ subdomain });

  // Si no hay config, retornar null (el SharedLayout maneja el loading)
  if (!config) return null;

  const adaptiveColors = {
    primaryText: getAdaptiveTextColor(config.colors.primary),
    accentText: getAdaptiveTextColor(config.colors.accent),
    backgroundText: getAdaptiveTextColor(config.colors.background),
    surfaceText: getAdaptiveTextColor(config.colors.surface)
  };

  // Obtener tipos de propiedades habilitados desde config
  const getEnabledPropertyTypes = () => {
    if (!config) return [];
    return Object.entries(config.sections.propertyTypes)
      .filter(([_, config]) => config.enabled)
      .map(([key, config]) => ({
        value: key,
        label: config.title
      }));
  };

  return (
    <div className="flex">
      {/* Sidebar de Filtros */}
      <>
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ top: '88px' }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky left-0 z-40 lg:z-10
            w-80 lg:w-72 xl:w-80
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto shadow-2xl lg:shadow-none
            self-start
          `}
          style={{
            backgroundColor: config.colors.surface,
            top: '88px',
            height: 'calc(100vh - 88px)',
            maxHeight: 'calc(100vh - 88px)'
          }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h2 style={{ color: config.colors.text }} className="text-xl font-bold flex items-center">
                <FunnelIcon className="h-5 w-5 mr-2" style={{ color: config.colors.primary }} />
                Filtrar Propiedades
              </h2>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1">
                <XMarkIcon className="h-6 w-6" style={{ color: config.colors.text }} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Búsqueda por ubicación */}
              <div>
                <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                  Buscar por ubicación
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: config.colors.textLight }}
                  />
                  <input
                    type="text"
                    placeholder="Villa Esperanza, Jardines del Sol..."
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

              {/* Tipo de operación */}
              <div>
                <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                  Tipo de Operación
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'todos', label: 'Todas las operaciones' },
                    { value: 'comprar', label: 'Comprar' },
                    { value: 'alquilar', label: 'Alquilar' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={filters.type === option.value}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        style={{ accentColor: config.colors.primary }}
                        className="mr-3"
                      />
                      <span style={{ color: config.colors.text }} className="text-sm">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de propiedad */}
              <div>
                <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                  Tipo de Propiedad
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  style={{
                    backgroundColor: config.colors.background,
                    color: config.colors.text,
                    borderColor: config.colors.textLight + '30'
                  }}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent"
                >
                  <option value="todos">Todos los tipos</option>
                  {getEnabledPropertyTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar filtros */}
              <div className="pt-4 border-t" style={{ borderColor: config.colors.textLight + '20' }}>
                <button
                  onClick={() => {
                    setFilters({
                      type: 'todos',
                      propertyType: 'todos',
                      minPrice: '',
                      maxPrice: '',
                      location: '',
                      bedrooms: 'todos',
                      bathrooms: 'todos',
                      minArea: '',
                      maxArea: ''
                    });
                  }}
                  style={{
                    backgroundColor: config.colors.background,
                    color: config.colors.text,
                    borderColor: config.colors.textLight + '30'
                  }}
                  className="w-full py-3 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 border"
                >
                  <XCircleIcon className="h-4 w-4" />
                  <span>Limpiar Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </>

      {/* Contenido Principal */}
      <main className="flex-1 min-h-screen" style={{ backgroundColor: config.colors.background }}>
        {/* Header de resultados */}
        <div style={{ backgroundColor: config.colors.surface }} className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 style={{ color: config.colors.text }} className="text-2xl lg:text-3xl font-bold mb-2">
                Propiedades
              </h1>
              <p style={{ color: config.colors.textLight }} className="text-sm">
                {loading ? 'Cargando...' : `${pagination.totalItems} propiedades encontradas • Mostrando ${properties.length} resultados`}
              </p>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                backgroundColor: config.colors.primary,
                color: adaptiveColors.primaryText
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="font-semibold">Filtros</span>
            </button>
          </div>
        </div>

        {/* Grid de propiedades */}
        {!loading && !error && properties.length > 0 && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {properties.map((property) => {
                const imageUrl = property.featured_image_url;
                const hasFailedBefore = imageUrl ? failedImages.has(imageUrl) : false;
                const hasValidImage = imageUrl &&
                  imageUrl.trim() !== '' &&
                  imageUrl !== '/' &&
                  !imageUrl.includes('undefined') &&
                  !hasFailedBefore;

                return (
                  <div
                    key={property.id}
                    style={{ backgroundColor: config.colors.surface }}
                    className="group rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Imagen */}
                    <div className="relative h-44 bg-gray-100 rounded-t-lg overflow-hidden">
                      {hasValidImage && imageUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_MEDIA}${imageUrl}`}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <HomeIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-500">Sin imagen</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-2">
                        {property.title}
                      </h3>
                      <p className="text-xl font-bold text-gray-900 mb-3">
                        {property.price_display}
                      </p>
                      <div className="space-y-1.5 mb-4">
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <MapPinIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{property.location_display}</span>
                        </p>
                      </div>
                      <a
                        href={`/properties/${property.id}`}
                        style={{
                          backgroundColor: config.colors.primary,
                          color: adaptiveColors.primaryText
                        }}
                        className="block text-center w-full py-2 px-3 rounded-md text-sm font-medium transition-colors hover:opacity-90"
                      >
                        Ver Detalles
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertiesPageClient;
