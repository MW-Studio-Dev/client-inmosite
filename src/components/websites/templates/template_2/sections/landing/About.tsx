'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';
import { AboutSkeleton } from '../../components/skeletons';

interface AboutUsSectionProps {
  config: TemplateConfig;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ config }) => {
  const { aboutUs } = config.sections;
  const [yearsCount, setYearsCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animación de contadores cuando la sección es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  // Contador animado para años de experiencia
  useEffect(() => {
    if (!isVisible || !aboutUs.yearsExperience) return;

    const duration = 2000;
    const steps = 60;
    const increment = aboutUs.yearsExperience / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= aboutUs.yearsExperience) {
        setYearsCount(aboutUs.yearsExperience);
        clearInterval(timer);
      } else {
        setYearsCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, aboutUs.yearsExperience]);

  // Contador animado para propiedades vendidas
  useEffect(() => {
    if (!isVisible || !aboutUs.propertiesSold) return;

    const duration = 2000;
    const steps = 60;
    const increment = aboutUs.propertiesSold / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= aboutUs.propertiesSold) {
        setPropertiesCount(aboutUs.propertiesSold);
        clearInterval(timer);
      } else {
        setPropertiesCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, aboutUs.propertiesSold]);

  // Filtrar frases vacías
  const validPhrases = aboutUs.phrases?.filter(phrase => phrase && phrase.trim() !== '') || [];

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="py-16 md:py-24"
      style={{ backgroundColor: config.colors.background }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Columna izquierda - Contenido */}
          <div className="space-y-8 order-2 lg:order-1">
            <div>
              <h2
                className="text-4xl md:text-5xl mb-4 leading-tight"
                style={{
                  color: config.colors.text,
                  fontWeight: config.typography.fontWeight.bold
                }}
              >
                {aboutUs.title}{' '}
                <span style={{ color: config.colors.primary }}>
                  {config.company?.name || ''}
                </span>
              </h2>
              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{
                  color: config.colors.textLight,
                  fontWeight: config.typography.fontWeight.normal
                }}
              >
                {aboutUs.description}
              </p>
            </div>

            {/* Estadísticas animadas */}
            {(aboutUs.yearsExperience || aboutUs.propertiesSold) && (
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {aboutUs.yearsExperience && (
                  <div 
                    className="text-center p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                    style={{ 
                      backgroundColor: config.colors.secondary + '15',
                      borderColor: config.colors.secondary + '30'
                    }}
                  >
                    <div
                      className="text-5xl md:text-6xl mb-2 font-bold"
                      style={{
                        color: config.colors.primary,
                        fontWeight: config.typography.fontWeight.bold
                      }}
                    >
                      {yearsCount}+
                    </div>
                    <div
                      className="text-sm md:text-base font-medium"
                      style={{ color: config.colors.text }}
                    >
                      Años de experiencia
                    </div>
                  </div>
                )}

                {aboutUs.propertiesSold && (
                  <div 
                    className="text-center p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                    style={{ 
                      backgroundColor: config.colors.secondary + '15',
                      borderColor: config.colors.secondary + '30'
                    }}
                  >
                    <div
                      className="text-5xl md:text-6xl mb-2 font-bold"
                      style={{
                        color: config.colors.primary,
                        fontWeight: config.typography.fontWeight.bold
                      }}
                    >
                      {propertiesCount}+
                    </div>
                    <div
                      className="text-sm md:text-base font-medium"
                      style={{ color: config.colors.text }}
                    >
                      Propiedades vendidas
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Frases/características dinámicas */}
            {validPhrases.length > 0 && (
              <div className="space-y-4">
                {validPhrases.map((phrase, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: config.colors.primary }}
                    >
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                    <span
                      className="text-base md:text-lg leading-relaxed"
                      style={{
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.normal
                      }}
                    >
                      {phrase}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha - Imagen redondeada sin contenedor */}
          <div className="relative order-1 lg:order-2">
            {!imageLoaded && (
              <div className="absolute inset-0 rounded-3xl">
                <AboutSkeleton backgroundColor={config.colors.textLight + '30'} />
              </div>
            )}
            {aboutUs.image && aboutUs.image !== '' && aboutUs.image !== '/' ? (
              <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_MEDIA}${aboutUs.image}`}
                  alt={aboutUs.title || "Sobre nosotros"}
                  fill
                  className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  quality={100}
                  priority
                  unoptimized={true}
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    imageRendering: 'crisp-edges',
                  }}
                />
              </div>
            ) : (
              <div
                className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5] w-full rounded-3xl shadow-2xl flex items-center justify-center"
                style={{ backgroundColor: config.colors.surface }}
              >
                <span className="text-6xl">🏢</span>
              </div>
            )}

            {/* Decoración de fondo */}
            <div
              className="absolute -bottom-8 -right-8 w-64 h-64 lg:w-80 lg:h-80 rounded-3xl -z-20 blur-3xl opacity-40"
              style={{ backgroundColor: config.colors.secondary }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
