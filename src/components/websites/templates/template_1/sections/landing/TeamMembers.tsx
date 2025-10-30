'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { TemplateConfig } from '../../types';

interface TeamSectionProps {
  config: TemplateConfig;
}

const TeamSection: React.FC<TeamSectionProps> = ({ config }) => {
  if (!config.sections.showTeam || !config.team) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const teamMembers = config.team;
  const teamCount = teamMembers.length;
  const useCarousel = teamCount >= 4;
  const itemsPerPage = 4;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.ceil(teamCount / itemsPerPage) - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(teamCount / itemsPerPage));
  };

  const getCurrentMembers = () => {
    if (!useCarousel) return teamMembers;
    const start = currentIndex * itemsPerPage;
    return teamMembers.slice(start, start + itemsPerPage);
  };

  const renderMemberCard = (member: any) => {
    const hasValidPhoto = member.photo && member.photo !== '' && member.photo !== '/';

    return (
      <div
        key={member.id}
        className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full max-w-sm mx-auto"
        style={{ backgroundColor: config.colors.background }}
      >
        <div className="relative h-80">
          {hasValidPhoto ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_MEDIA}${member.photo}`}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: config.colors.surface }}
            >
              <span className="text-6xl">👤</span>
            </div>
          )}
        </div>
      <div className="p-6 text-center">
        <h3
          className="text-xl mb-2"
          style={{
            color: config.colors.text,
            fontWeight: config.typography.fontWeight.bold
          }}
        >
          {member.name}
        </h3>
        <p
          className="mb-3"
          style={{
            color: config.colors.primary,
            fontWeight: config.typography.fontWeight.semibold
          }}
        >
          {member.position}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: config.colors.textLight,
            fontWeight: config.typography.fontWeight.normal
          }}
        >
          {member.bio}
        </p>
      </div>
    </div>
    );
  };

  // Grid classes según cantidad de miembros
  const getGridClass = () => {
    if (useCarousel) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8';
    if (teamCount === 1) return 'flex justify-center';
    if (teamCount === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto';
    if (teamCount === 3) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto';
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8';
  };
  
  return (
    <section id="equipo" className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: config.colors.surface }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 px-2"
            style={{
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold
            }}
          >
            Nuestro Equipo
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4"
            style={{ color: config.colors.textLight }}
          >
            Profesionales experimentados comprometidos con brindarte el mejor servicio inmobiliario.
          </p>
        </div>

        {useCarousel ? (
          // Carousel mode para 4+ miembros
          <div className="relative">
            <div className={getGridClass()}>
              {getCurrentMembers().map(renderMemberCard)}
            </div>

            {/* Controles del carrusel - Hidden on mobile */}
            {Math.ceil(teamCount / itemsPerPage) > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="hidden md:block absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: config.colors.primary,
                    color: '#fff'
                  }}
                  aria-label="Anterior"
                >
                  <ChevronLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="hidden md:block absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: config.colors.primary,
                    color: '#fff'
                  }}
                  aria-label="Siguiente"
                >
                  <ChevronRightIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                </button>

                {/* Indicadores de puntos */}
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(teamCount / itemsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className="w-3 h-3 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: currentIndex === index
                          ? config.colors.primary
                          : config.colors.textLight + '40'
                      }}
                      aria-label={`Ir a página ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          // Grid estático centrado para 1-3 miembros
          <div className={getGridClass()}>
            {teamMembers.map(renderMemberCard)}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;