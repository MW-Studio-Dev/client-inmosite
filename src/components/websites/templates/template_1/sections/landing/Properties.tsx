'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';
import { useProperties } from '@/hooks/useProperties';
import Link from 'next/link';
import { PropertiesSkeleton } from '../../components/skeletons';

interface FeaturedPropertiesProps {
  config: TemplateConfig;
  subdomain: string;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ 
  config, 
  subdomain, 
  adaptiveColors 
}) => {
  const { properties, loading, error, refetch } = useProperties({subdomain:subdomain,isFeatured:true});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Función para obtener imagen por defecto si no hay featured_image_url
  const getPropertyImage = (property: any) => {
    if (property.featured_image_url) {
      return property.featured_image_url;
    }
    return "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  // Función para formatear la superficie
  const formatSurface = (surface: string) => {
    const numericSurface = parseFloat(surface);
    return isNaN(numericSurface) ? surface : `${numericSurface}m²`;
  };

  // Función para truncar texto de manera inteligente
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    
    const truncated = title.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return title.substring(0, lastSpaceIndex) + '...';
    }
    
    return title.substring(0, maxLength) + '...';
  };

  // Determinar cuántos slides mostrar según el tamaño de pantalla
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSlidesToShow(1);
      } else if (width < 1024) {
        setSlidesToShow(2);
      } else if (width < 1280) {
        setSlidesToShow(3);
      } else if (width < 1536) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(5);
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Calcular el número total de "páginas" o grupos
  const totalPages = Math.ceil(properties.length / slidesToShow);
  const maxDots = 3; // Máximo 3 puntos

  // Navegación del carousel
  const goToNext = () => {
    if (properties.length > slidesToShow) {
      setCurrentIndex(prev => {
        const nextIndex = prev + slidesToShow;
        return nextIndex >= properties.length ? 0 : nextIndex;
      });
    }
  };

  const goToPrev = () => {
    if (properties.length > slidesToShow) {
      setCurrentIndex(prev => {
        const prevIndex = prev - slidesToShow;
        return prevIndex < 0 ? Math.max(0, properties.length - slidesToShow) : prevIndex;
      });
    }
  };

  // Auto-scroll opcional
  useEffect(() => {
    if (properties.length > slidesToShow) {
      const interval = setInterval(goToNext, 5000);
      return () => clearInterval(interval);
    }
  }, [properties.length, slidesToShow, currentIndex]);

  // Ir a página específica
  const goToPage = (pageIndex: number) => {
    const newIndex = pageIndex * slidesToShow;
    setCurrentIndex(Math.min(newIndex, properties.length - slidesToShow));
  };

  // Calcular la página actual
  const currentPage = Math.floor(currentIndex / slidesToShow);

  if (loading) {
    return (
      <div style={{ backgroundColor: config.colors.surface }}>
        <PropertiesSkeleton
          count={6}
          backgroundColor={config.colors.textLight + '30'}
          surfaceColor={config.colors.background}
        />
      </div>
    );
  }

  if (error) {
    return (
      <section 
        id="propiedades" 
        className="py-20"
        style={{ backgroundColor: config.colors.surface }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 
              className="text-3xl md:text-4xl mb-4"
              style={{ 
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.bold
              }}
            >
              Nuestras Propiedades
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
              <p className="text-red-700 mb-4">
                No se pudieron cargar las propiedades: {error}
              </p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section 
        id="propiedades" 
        className="py-20"
        style={{ backgroundColor: config.colors.surface }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 
              className="text-3xl md:text-4xl mb-4"
              style={{ 
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.bold
              }}
            >
              Nuestras Propiedades
            </h2>
            <div className="text-center py-12">
              <p 
                className="text-lg"
                style={{ color: config.colors.textLight }}
              >
                No hay propiedades disponibles en este momento.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="propiedades"
      className="py-12 sm:py-16 md:py-20"
      style={{ backgroundColor: config.colors.surface }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 px-2"
            style={{
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold
            }}
          >
            Nuestras Propiedades
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4"
            style={{ color: config.colors.textLight }}
          >
            Explora nuestra amplia selección de propiedades en las mejores ubicaciones.
          </p>
        </div>

        {/* Carousel Container con padding para sombras */}
        <div className="relative py-4">
          {/* Navigation Buttons - Hidden on mobile */}
          {properties.length > slidesToShow && (
            <>
              <button
                onClick={goToPrev}
                className="hidden md:block absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: config.colors.background,
                  color: config.colors.text
                }}
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>

              <button
                onClick={goToNext}
                className="hidden md:block absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: config.colors.background,
                  color: config.colors.text
                }}
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Carousel Track - Responsive padding */}
          <div className="overflow-hidden mx-0 md:mx-12 px-0 md:px-8">
            <div
              ref={carouselRef}
              className="flex md:transition-transform md:duration-500 md:ease-in-out overflow-x-auto md:overflow-hidden snap-x snap-mandatory scrollbar-hide"
              style={{
                transform: slidesToShow > 1 ? `translateX(-${currentIndex * (100 / slidesToShow)}%)` : 'none',
                scrollSnapType: slidesToShow === 1 ? 'x mandatory' : 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className="flex-shrink-0 px-2 sm:px-3 snap-center"
                  style={{ width: slidesToShow === 1 ? '85%' : `${100 / slidesToShow}%` }}
                >
                  <div
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
                    style={{ backgroundColor: config.colors.background }}
                  >
                    <div className="relative h-56 sm:h-48 flex-shrink-0">
                      <Image 
                        src={getPropertyImage(property)} 
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                        unoptimized
                        // onError={(e) => {
                        //   const target = e.target as HTMLImageElement;
                        //   target.src = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                        // }}
                      />
                      {/* Badge de precio */}
                      <div className="absolute top-3 right-3">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                          style={{ 
                            backgroundColor: config.colors.primary,
                            color: adaptiveColors.primaryText
                          }}
                        >
                          {property.price_display}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      {/* Título */}
                      <div className="mb-3 min-h-[3rem] flex items-start">
                        <h3
                          className="text-base sm:text-lg leading-tight line-clamp-2"
                          style={{
                            color: config.colors.text,
                            fontWeight: config.typography.fontWeight.bold
                          }}
                          title={property.title}
                        >
                          {property.title}
                        </h3>
                      </div>

                      {/* Ubicación */}
                      <div className="flex items-center mb-3 sm:mb-4" style={{ color: config.colors.textLight }}>
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate" title={property.location_display}>
                          {property.location_display}
                        </span>
                      </div>

                      {/* Características */}
                      <div
                        className="grid grid-cols-3 gap-2 text-xs sm:text-sm mb-3 sm:mb-4 text-center"
                        style={{ color: config.colors.textLight }}
                      >
                        <div className="flex flex-col py-2 rounded" style={{ backgroundColor: config.colors.surface }}>
                          <span className="font-semibold text-sm sm:text-base" style={{ color: config.colors.text }}>
                            {property.bedrooms}
                          </span>
                          <span className="text-xs">hab.</span>
                        </div>
                        <div className="flex flex-col py-2 rounded" style={{ backgroundColor: config.colors.surface }}>
                          <span className="font-semibold text-sm sm:text-base" style={{ color: config.colors.text }}>
                            {property.bathrooms}
                          </span>
                          <span className="text-xs">baños</span>
                        </div>
                        <div className="flex flex-col py-2 rounded" style={{ backgroundColor: config.colors.surface }}>
                          <span className="font-semibold text-sm sm:text-base" style={{ color: config.colors.text }}>
                            {formatSurface(property.surface_total)}
                          </span>
                          <span className="text-xs">sup.</span>
                        </div>
                      </div>

                      {/* Tipo */}
                      <div className="mb-3 sm:mb-4 flex-grow">
                        <p
                          className="text-xs uppercase tracking-wider"
                          style={{ color: config.colors.textLight }}
                        >
                          {property.operation_type} • {property.property_type}
                        </p>
                      </div>

                      {/* Botón */}
                      <a
                        className="w-full py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm mt-auto text-center block font-medium"
                        style={{ 
                          backgroundColor: config.colors.primary,
                          color: adaptiveColors.primaryText,
                          fontWeight: config.typography.fontWeight.semibold
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = config.colors.primaryDark;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = config.colors.primary;
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        href={`/properties/${property.id}`}
                      >
                        Ver Detalles
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Máximo 3 puntos */}
          {properties.length > slidesToShow && totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {totalPages <= maxDots ? (
                // Si hay 3 o menos páginas, mostrar todos los puntos
                Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentPage ? 'scale-125' : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{ 
                      backgroundColor: config.colors.primary 
                    }}
                    aria-label={`Ir a página ${index + 1}`}
                  />
                ))
              ) : (
                // Si hay más de 3 páginas, mostrar solo 3 puntos dinámicos
                <>
                  <button
                    onClick={() => goToPage(0)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      currentPage === 0 ? 'scale-125' : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{ 
                      backgroundColor: config.colors.primary 
                    }}
                    aria-label="Ir al inicio"
                  />
                  <button
                    onClick={() => goToPage(Math.floor(totalPages / 2))}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      currentPage > 0 && currentPage < totalPages - 1 ? 'scale-125' : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{ 
                      backgroundColor: config.colors.primary 
                    }}
                    aria-label="Ir al medio"
                  />
                  <button
                    onClick={() => goToPage(totalPages - 1)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      currentPage === totalPages - 1 ? 'scale-125' : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{ 
                      backgroundColor: config.colors.primary 
                    }}
                    aria-label="Ir al final"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;