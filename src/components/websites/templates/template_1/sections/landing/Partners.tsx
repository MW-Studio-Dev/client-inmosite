'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';
import { ExternalLinkIcon } from 'lucide-react';

interface PartnersSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ config, adaptiveColors }) => {
  console.log('Partners Debug:', {
    showPartners: config.sections.showPartners,
    partnersLength: config.partners?.length,
    partners: config.partners,
    categories: config.sections.partners?.categories
  });

  // Validar que existan partners y la sección esté habilitada
  if (!config.sections.showPartners ) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState<boolean>(true);

  // Configurar partners por slide (responsive)
  const partnersPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };

  // Agrupar partners por slides
  const partnerSlides = useMemo(() => {
    const slides = [];
    const totalPartners = config.partners?.length || 0;
    
    // Para desktop (4 por slide)
    for (let i = 0; i < totalPartners; i += partnersPerSlide.desktop) {
      slides.push(config.partners!.slice(i, i + partnersPerSlide.desktop));
    }
    
    return slides;
  }, [config.partners]);

  // Autoplay del carrusel
  useEffect(() => {
    if (!config.sections.partners?.carousel?.autoplay || !isAutoplayEnabled || partnerSlides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % partnerSlides.length);
    }, config.sections.partners.carousel.autoplayDelay || 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoplayEnabled, partnerSlides.length, config.sections.partners?.carousel]);

  // Función para renderizar el logo del partner
  const renderPartnerLogo = (partner: any) => {
    if (typeof partner.logo === 'string') {
      // Es emoji
      return (
        <div className="flex items-center justify-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_MEDIA}${partner.logo}`}
            alt={partner.name}
            width={400}
            height={400}
            unoptimized
            />
        </div>
      );
    }
    
    if (typeof partner.logo === 'object' && partner.logo.type === 'image') {
      // Es imagen
      return (
        <div className="flex items-center justify-center h-16 w-24">
          <Image
            src={partner.logo.src}
            alt={partner.logo.alt || partner.name}
            width={partner.logo.width || 120}
            height={partner.logo.height || 60}
            className="object-contain max-h-full max-w-full opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      );
    }
    
    // Fallback
    return (
      <div className="flex items-center justify-center h-16 w-24">
        <span className="text-2xl">🤝</span>
      </div>
    );
  };

  // Navegación del carrusel
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplayEnabled(false);
    setTimeout(() => setIsAutoplayEnabled(true), 5000); // Reanudar autoplay después de 5s
  };

  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? partnerSlides.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = (currentIndex + 1) % partnerSlides.length;
    goToSlide(newIndex);
  };

  // Obtener categorías desde config.sections.partners.categories
  const categories = useMemo(() => {
    if (!config.sections.partners?.categories) return [];
    
    return Object.entries(config.sections.partners.categories).map(([key, value]) => ({
      key,
      title: value.title,
      description: value.description
    }));
  }, [config.sections.partners?.categories]);

  return (
    <section className="py-20" style={{ backgroundColor: config.colors.background }}>
      <div className="container mx-auto px-4">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl mb-4"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold
            }}
          >
            {config.sections.partners?.title || 'Nuestros Partners'}
          </h2>
          {config.sections.partners?.subtitle && (
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ 
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {config.sections.partners.subtitle}
            </p>
          )}
        </div>



        {/* Carrusel de Partners */}
        <div className="relative">
          {/* Controles del carrusel */}
          {config.sections.partners?.carousel?.showArrows && partnerSlides.length > 1 && (
            <>
              <button
                onClick={goToPrevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText
                }}
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <button
                onClick={goToNextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText
                }}
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Slides del carrusel */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {partnerSlides.map((slide, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
                    {slide.map((partner) => (
                      <div 
                        key={partner.id}
                        className="group relative p-6 text-center rounded-xl border-2 border-transparent hover:border-current transition-all duration-300 transform hover:-translate-y-1"
                        style={{ 
                          backgroundColor: config.colors.surface,
                          borderColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = config.colors.primary + '30';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        {/* Badge de destacado */}
                        {partner.featured && (
                          <div className="absolute top-2 right-2">
                            <span 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: config.colors.warning,
                                color: 'white',
                                fontWeight: config.typography.fontWeight.semibold
                              }}
                            >
                              Destacado
                            </span>
                          </div>
                        )}

                        {/* Logo del partner */}
                        <div className="mb-4">
                          {renderPartnerLogo(partner)}
                        </div>

                        {/* Información del partner */}
                        <h4 
                          className="text-lg mb-2"
                          style={{ 
                            color: config.colors.text,
                            fontWeight: config.typography.fontWeight.semibold
                          }}
                        >
                          {partner.name}
                        </h4>

                        {/* Categoría */}
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                          style={{ 
                            backgroundColor: config.colors.primary + '20',
                            color: config.colors.primary,
                            fontWeight: config.typography.fontWeight.medium
                          }}
                        >
                          {config.sections.partners?.categories?.[partner.category]?.title || partner.category}
                        </span>

                        {/* Descripción */}
                        <p 
                          className="text-sm mb-4 leading-relaxed"
                          style={{ 
                            color: config.colors.textLight,
                            fontWeight: config.typography.fontWeight.normal
                          }}
                        >
                          {partner.description}
                        </p>

                        {/* Enlace al sitio web */}
                        {partner.website && (
                          <Link 
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-sm transition-colors duration-200"
                            style={{ 
                              color: config.colors.primary,
                              fontWeight: config.typography.fontWeight.medium
                            }}
                          >
                            <span>Visitar sitio</span>
                            <ExternalLinkIcon className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de puntos */}
          {config.sections.partners?.carousel?.showDots && partnerSlides.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {partnerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="w-3 h-3 rounded-full transition-all duration-200"
                  style={{ 
                    backgroundColor: currentIndex === index 
                      ? config.colors.primary 
                      : config.colors.textLight + '40'
                  }}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mensaje de llamada a la acción */}
        <div className="text-center mt-16">
          <div 
            className="inline-block p-6 rounded-xl"
            style={{ backgroundColor: config.colors.surface }}
          >
            <p 
              className="text-lg mb-4"
              style={{ 
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.medium
              }}
            >
              ¿Interesado en ser nuestro partner?
            </p>
            <button 
              className="px-8 py-3 rounded-lg transition-colors duration-200"
              style={{ 
                backgroundColor: config.colors.primary,
                color: adaptiveColors.primaryText,
                fontWeight: config.typography.fontWeight.semibold
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
            >
              Contactar para Alianzas
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;