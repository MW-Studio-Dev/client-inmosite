'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import useWebsiteConfig from '@/hooks/useWebsiteConfig';
import { useProperties } from '@/hooks/useProperties';

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
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

const getAdaptiveTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

const PropertiesPage = ({subdomain}:{subdomain:string}) => {
  const { config, loading: configLoading } = useWebsiteConfig(subdomain);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
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
  const {properties, loading, error} = useProperties({subdomain})
  console.log('mis proppiedades',properties)
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
      const defaultWidth = size === 'desktop' ? 40 : 32;
      const defaultHeight = size === 'desktop' ? 40 : 32;
      
      return (
        <div className={`relative ${size === 'desktop' ? 'h-10 w-auto' : 'h-8 w-auto'}`}>
          <Image
            src={logo.src}
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

  // Inyectar estilos dinámicos usando config

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


  // Sidebar de Filtros usando config
  const FilterSidebar: React.FC = () => {
    if (!config) return null;
    
    return (
    <>
      {/* Overlay transparente para cerrar al hacer clic afuera */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ top: '88px' }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - debajo del navbar, respetando footer */}
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
          {/* Header del sidebar */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 
              style={{ color: config.colors.text }}
              className="text-xl font-bold flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" style={{ color: config.colors.primary }} />
              Filtrar Propiedades
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1"
            >
              <XMarkIcon className="h-6 w-6" style={{ color: config.colors.text }} />
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-6">
            {/* Búsqueda por texto */}
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
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
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
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
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

            {/* Tipo de propiedad usando config */}
            <div>
              <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                Tipo de Propiedad
              </label>
              <select 
                value={filters.propertyType}
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
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

            {/* Rango de precios */}
            <div>
              <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                Rango de Precios
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input 
                    type="number"
                    placeholder="Precio mín"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    style={{ 
                      backgroundColor: config.colors.background,
                      color: config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <input 
                    type="number"
                    placeholder="Precio máx"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    style={{ 
                      backgroundColor: config.colors.background,
                      color: config.colors.text,
                      borderColor: config.colors.textLight + '30'
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Habitaciones */}
            <div>
              <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                Habitaciones
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['todos', '1', '2', '3', '4+'].map(bedroom => (
                  <button
                    key={bedroom}
                    onClick={() => setFilters({...filters, bedrooms: bedroom})}
                    style={{ 
                      backgroundColor: filters.bedrooms === bedroom ? config.colors.primary : config.colors.background,
                      color: filters.bedrooms === bedroom ? adaptiveColors.primaryText : config.colors.text,
                      borderColor: filters.bedrooms === bedroom ? config.colors.primary : config.colors.textLight + '30'
                    }}
                    className="border rounded-lg py-2 px-3 text-sm font-medium transition-colors"
                  >
                    {bedroom === 'todos' ? 'Todas' : bedroom}
                  </button>
                ))}
              </div>
            </div>

            {/* Baños */}
            <div>
              <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                Baños
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['todos', '1', '2', '3', '4+'].map(bathroom => (
                  <button
                    key={bathroom}
                    onClick={() => setFilters({...filters, bathrooms: bathroom})}
                    style={{ 
                      backgroundColor: filters.bathrooms === bathroom ? config.colors.primary : config.colors.background,
                      color: filters.bathrooms === bathroom ? adaptiveColors.primaryText : config.colors.text,
                      borderColor: filters.bathrooms === bathroom ? config.colors.primary : config.colors.textLight + '30'
                    }}
                    className="border rounded-lg py-2 px-3 text-sm font-medium transition-colors"
                  >
                    {bathroom === 'todos' ? 'Todos' : bathroom}
                  </button>
                ))}
              </div>
            </div>

            {/* Área */}
            <div>
              <label style={{ color: config.colors.text }} className="block text-sm font-semibold mb-3">
                Área (m²)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number"
                  placeholder="Área mín"
                  value={filters.minArea}
                  onChange={(e) => setFilters({...filters, minArea: e.target.value})}
                  style={{ 
                    backgroundColor: config.colors.background,
                    color: config.colors.text,
                    borderColor: config.colors.textLight + '30'
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <input 
                  type="number"
                  placeholder="Área máx"
                  value={filters.maxArea}
                  onChange={(e) => setFilters({...filters, maxArea: e.target.value})}
                  style={{ 
                    backgroundColor: config.colors.background,
                    color: config.colors.text,
                    borderColor: config.colors.textLight + '30'
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="pt-4 border-t space-y-3" style={{ borderColor: config.colors.textLight + '20' }}>
              {/* Botón aplicar filtros (solo móvil) */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText
                }}
                className="w-full py-3 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 lg:hidden"
              >
                <span>Aplicar Filtros</span>
              </button>

              {/* Botón limpiar filtros */}
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
              Propiedades
            </h1>
            <p style={{ color: config.colors.textLight }} className="text-sm">
              {loading ? 'Cargando...' : `${pagination.totalItems} propiedades encontradas • Mostrando ${properties.length} resultados`}
            </p>
          </div>

          {/* Botón de filtros para móvil y desktop */}
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
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {properties.map((property) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'disponible':
                    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  case 'vendido':
                    return 'bg-slate-100 text-slate-700 border-slate-300';
                  case 'reservado':
                    return 'bg-amber-50 text-amber-700 border-amber-200';
                  default:
                    return 'bg-gray-50 text-gray-700 border-gray-200';
                }
              };

              const getOperationTypeBadge = (type: string) => {
                return type === 'venta'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';
              };

              return (
                <div
                  key={property.id}
                  style={{ backgroundColor: config.colors.surface }}
                  className="group rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Imagen */}
                  <div className="relative h-44 bg-gray-100 rounded-t-lg overflow-hidden">
                    <Image
                      src={property.featured_image_url || PLACEHOLDER_IMAGE}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-medium border ${getOperationTypeBadge(property.operation_type)}`}>
                        {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-medium border ${getStatusColor(property.status)}`}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </div>
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
                      <p className="text-sm text-gray-600 flex items-center gap-1.5">
                        <HomeIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                      </p>
                    </div>

                    {/* Botón de acción */}
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
                  <ChevronLeftIcon className="h-4 w-4" />
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
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
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

  // Loading state mientras carga la configuración
  console.log('List.tsx - configLoading:', configLoading, 'config:', config);
  
  if (configLoading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
          <p className="text-gray-500 text-sm mt-2">
            Loading: {configLoading ? 'true' : 'false'} | Config: {config ? 'loaded' : 'null'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: config?.colors.background }} className="min-h-screen">
      {config && <TopHeader config={config} />}
      {config && <Navbar config={config} adaptiveColors={adaptiveColors}/>}
      <MobileMenu />

      <div className="flex">
        <FilterSidebar />
        <MainContent />
      </div>
      {/* <div className="mt-12" /> */}
      {config && <Footer config={config} adaptiveColors={adaptiveColors} />}
      <WhatsAppButton />
    </div>
  );
};

export default PropertiesPage;