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
  console.log('Hero backgroundUrl:', backgroundUrl);
  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center pb-8 sm:pb-12 md:pb-16 overflow-hidden">
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
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_MEDIA}${config.hero.backgroundImage}`}
          alt="Hero background"
          fill
          className={`object-cover transition-opacity duration-500 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority
          onLoad={() => setMediaLoaded(true)}
        />

      )}

      {/* Overlay semi-transparente para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
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
              backgroundColor: config.colors.primary,
              color: adaptiveColors.primaryText,
              fontWeight: config.typography.fontWeight.semibold
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primary + 90  }
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
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