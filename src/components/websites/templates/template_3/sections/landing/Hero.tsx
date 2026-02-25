'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PropertySearchBar from './SearchBar';
import { TemplateConfig } from '../../types';
import { HeroSkeleton } from '../../components/skeletons';

interface HeroSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ config, adaptiveColors }) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // Determinar si el background es un video o una imagen
  const backgroundUrl = config.hero.backgroundVideoUrl;
  const backgroundImage = config.hero.backgroundImage;

  // Helper safely formats media URL to prevent Next/Image "Invalid URL" crashes
  const getMediaUrl = (path: string | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = process.env.NEXT_PUBLIC_API_MEDIA || '';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };



  // Validar que tengamos una imagen de fondo si no hay video
  const hasValidBackground = backgroundUrl || (backgroundImage && backgroundImage !== '' && backgroundImage !== '/');


  return (
    <section
      id="inicio"
      className="relative h-screen min-h-[600px] flex items-center justify-center pb-4 sm:pb-12 md:pb-16"
      style={{ backgroundColor: config.colors.background }}
    >
      {/* Contenedor del video/imagen con bordes redondeados */}
      <div className="absolute top-1 left-1 right-1 bottom-2 sm:top-3 sm:left-3 sm:right-3 sm:bottom-3 md:top-4 md:left-4 md:right-4 md:bottom-4 rounded-2xl md:rounded-3xl overflow-hidden">
        {!mediaLoaded && <HeroSkeleton backgroundColor={config.colors.surface} />}
        {backgroundUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadedData={() => setMediaLoaded(true)}
          >
            <source
              src={backgroundUrl}
              type="video/mp4"
            />
            Su navegador no soporta videos.
          </video>
        ) : hasValidBackground ? (
          <Image
            src={getMediaUrl(backgroundImage)}
            alt="Hero background"
            fill
            className={`object-cover transition-opacity duration-500 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority
            unoptimized
            onLoad={() => setMediaLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Overlay semi-transparente para legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
      </div>
      <div className="relative text-center text-white px-4 sm:px-6 md:px-8 max-w-7xl mx-auto z-10 w-full">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight px-2"
          style={{
            fontWeight: config.typography.fontWeight.bold,
            fontSize: 'clamp(1.75rem, 5vw, 4rem)'
          }}
        >
          {config.hero.title}
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto px-2"
          style={{ fontWeight: config.typography.fontWeight.normal }}
        >
          {config.hero.subtitle}
        </p>

        {config.hero.showSearchBar && (
          <div className="mb-6 sm:mb-8">
            <PropertySearchBar config={config} adaptiveColors={adaptiveColors} />
          </div>
        )}

        <div className="mt-6 sm:mt-8">
          <a
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-200 transform hover:scale-105 inline-block shadow-lg"
            style={{
              backgroundColor: config.colors.secondary,
              color: adaptiveColors.primaryText,
              fontWeight: config.typography.fontWeight.semibold
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.secondary}
            href='/properties'
          >
            {config.hero.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
