'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';
import { useProperties } from '@/hooks/useProperties';
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
  const { properties, loading, error, refetch } = useProperties({ subdomain: subdomain, isFeatured: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Responsive slides to show
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Get property image
  const getPropertyImage = (property: any) => {
    if (property.featured_image_url) {
      return `${process.env.NEXT_PUBLIC_API_MEDIA}${property.featured_image_url}`;
    }
    return "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  // Navigation
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < properties.length - 1;

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => Math.min(properties.length - 1, prev + 1));
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (properties.length > slidesToShow) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          return next >= properties.length ? 0 : next;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [properties.length, slidesToShow, currentIndex]);

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
        className="py-16 md:py-24"
        style={{ backgroundColor: config.colors.surface }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
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
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        className="py-16 md:py-24"
        style={{ backgroundColor: config.colors.surface }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
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
            <p className="text-lg mt-8" style={{ color: config.colors.textLight }}>
              No hay propiedades disponibles en este momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="propiedades"
      className="py-16 md:py-24"
      style={{ backgroundColor: config.colors.surface }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl mb-4"
            style={{
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold
            }}
          >
            Nuestras Propiedades
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: config.colors.textLight }}
          >
            Explora nuestra amplia selección de propiedades en las mejores ubicaciones.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {properties.length > slidesToShow && (
            <>
              <button
                onClick={goToPrev}
                disabled={!canGoPrev}
                className={`absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                  canGoPrev ? 'hover:scale-110' : 'opacity-30 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: config.colors.background,
                  color: config.colors.text
                }}
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={goToNext}
                disabled={!canGoNext}
                className={`absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                  canGoNext ? 'hover:scale-110' : 'opacity-30 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: config.colors.background,
                  color: config.colors.text
                }}
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6 md:gap-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`
              }}
            >
              {properties.map((property: any) => (
                <div
                  key={property.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / slidesToShow}% - ${(slidesToShow - 1) * (slidesToShow === 1 ? 0 : slidesToShow === 2 ? 1.5 : 2)}rem)` }}
                >
                  <a
                    href={`/properties/${property.id}`}
                    className="group block h-full"
                  >
                    <div
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
                      style={{ backgroundColor: config.colors.background }}
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={getPropertyImage(property)}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className="px-4 py-2 rounded-full text-sm md:text-base font-bold shadow-lg"
                            style={{
                              backgroundColor: config.colors.primary,
                              color: adaptiveColors.primaryText
                            }}
                          >
                            {property.price_display}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6 flex flex-col flex-grow">
                        {/* Title */}
                        <h3
                          className="text-lg md:text-xl mb-3 line-clamp-2 min-h-[3.5rem]"
                          style={{
                            color: config.colors.text,
                            fontWeight: config.typography.fontWeight.bold
                          }}
                        >
                          {property.title}
                        </h3>

                        {/* Location */}
                        <div
                          className="flex items-center gap-2 mb-4"
                          style={{ color: config.colors.textLight }}
                        >
                          <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm md:text-base truncate">
                            {property.location_display}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div
                            className="text-center py-3 rounded-lg"
                            style={{ backgroundColor: config.colors.surface }}
                          >
                            <div
                              className="text-xl md:text-2xl font-bold mb-1"
                              style={{ color: config.colors.text }}
                            >
                              {property.bedrooms}
                            </div>
                            <div
                              className="text-xs md:text-sm"
                              style={{ color: config.colors.textLight }}
                            >
                              hab.
                            </div>
                          </div>
                          <div
                            className="text-center py-3 rounded-lg"
                            style={{ backgroundColor: config.colors.surface }}
                          >
                            <div
                              className="text-xl md:text-2xl font-bold mb-1"
                              style={{ color: config.colors.text }}
                            >
                              {property.bathrooms}
                            </div>
                            <div
                              className="text-xs md:text-sm"
                              style={{ color: config.colors.textLight }}
                            >
                              baños
                            </div>
                          </div>
                          <div
                            className="text-center py-3 rounded-lg"
                            style={{ backgroundColor: config.colors.surface }}
                          >
                            <div
                              className="text-xl md:text-2xl font-bold mb-1"
                              style={{ color: config.colors.text }}
                            >
                              {property.surface_total}
                            </div>
                            <div
                              className="text-xs md:text-sm"
                              style={{ color: config.colors.textLight }}
                            >
                              sup.
                            </div>
                          </div>
                        </div>

                        {/* Property Type */}
                        <div className="mb-4">
                          <span
                            className="text-xs md:text-sm uppercase tracking-wider font-medium"
                            style={{ color: config.colors.textLight }}
                          >
                            {property.operation_type} • {property.property_type}
                          </span>
                        </div>

                        {/* Button */}
                        <button
                          className="w-full py-3 rounded-lg font-semibold transition-all duration-200 mt-auto hover:shadow-lg"
                          style={{
                            backgroundColor: config.colors.primary,
                            color: adaptiveColors.primaryText
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = config.colors.primaryDark;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = config.colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {properties.length > slidesToShow && (
            <div className="flex justify-center mt-8 gap-2">
              {properties.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      isActive ? 'w-8 scale-110' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: config.colors.primary }}
                    aria-label={`Ir a propiedad ${index + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
