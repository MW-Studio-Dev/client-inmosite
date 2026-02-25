'use client';

import React from 'react';
import Image from 'next/image';
import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';

interface WhyInvestSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

// Iconos disponibles para los beneficios
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingOfficeIcon
};

const WhyInvestSection: React.FC<WhyInvestSectionProps> = ({ config, adaptiveColors }) => {
  // Validar que la sección esté habilitada
  if (!config.sections.whyInvest?.enabled) {
    return null;
  }

  const whyInvestConfig = config.sections.whyInvest;

  // Beneficios por defecto si no vienen en la config
  const defaultBenefits = [
    {
      icon: 'ArrowTrendingUpIcon',
      title: 'Alto Retorno de Inversión',
      description: 'Propiedades seleccionadas con potencial de revalorización superior al promedio del mercado.'
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Inversión Segura',
      description: 'Análisis exhaustivo de cada oportunidad y asesoría legal completa en cada transacción.'
    },
    {
      icon: 'GlobeAltIcon',
      title: 'Acceso Global',
      description: 'Invierte desde cualquier parte del mundo con procesos 100% digitalizados.'
    },
    {
      icon: 'ChartBarIcon',
      title: 'Transparencia Total',
      description: 'Información detallada de cada propiedad, análisis de mercado y proyecciones claras.'
    },
    {
      icon: 'BanknotesIcon',
      title: 'Diversificación',
      description: 'Oportunidades en diferentes sectores y ubicaciones para minimizar riesgos.'
    },
    {
      icon: 'BuildingOfficeIcon',
      title: 'Gestión Profesional',
      description: 'Equipo experto que acompaña tu inversión desde la selección hasta el cierre.'
    }
  ];

  const benefits = whyInvestConfig.benefits || defaultBenefits;

  return (
    <section className="py-20" style={{ backgroundColor: config.colors.surface }}>
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
            {whyInvestConfig.title || '¿Por Qué Invertir?'}
          </h2>
          {whyInvestConfig.subtitle && (
            <p
              className="text-lg max-w-3xl mx-auto mb-6"
              style={{
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {whyInvestConfig.subtitle}
            </p>
          )}
          {whyInvestConfig.description && (
            <p
              className="text-base max-w-2xl mx-auto"
              style={{
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {whyInvestConfig.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagen destacada (si existe) */}
          {whyInvestConfig.image && (
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={whyInvestConfig.image}
                  alt={whyInvestConfig.title || 'Por qué invertir'}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />

                {/* Overlay decorativo */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.primaryDark})`
                  }}
                />
              </div>
            </div>
          )}

          {/* Grid de beneficios */}
          <div className={`order-1 lg:order-2 ${!whyInvestConfig.image ? 'lg:col-span-2' : ''}`}>
            <div className={`grid grid-cols-1 ${!whyInvestConfig.image ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
              {benefits.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon] || ArrowTrendingUpIcon;

                return (
                  <div
                    key={index}
                    className="group p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                    style={{
                      backgroundColor: config.colors.background,
                      border: `2px solid ${config.colors.primary}20`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = config.colors.primary + '60';
                      e.currentTarget.style.backgroundColor = config.colors.primary + '05';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = config.colors.primary + '20';
                      e.currentTarget.style.backgroundColor = config.colors.background;
                    }}
                  >
                    {/* Icono */}
                    <div
                      className="mb-4 p-3 rounded-lg inline-block transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: config.colors.primary + '15',
                        color: config.colors.primary
                      }}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>

                    {/* Título */}
                    <h3
                      className="text-xl mb-3"
                      style={{
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.semibold
                      }}
                    >
                      {benefit.title}
                    </h3>

                    {/* Descripción */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: config.colors.textLight,
                        fontWeight: config.typography.fontWeight.normal
                      }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA opcional */}
        {whyInvestConfig.cta && (
          <div className="text-center mt-16">
            <button
              className="px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: config.colors.primary,
                color: adaptiveColors.primaryText,
                fontWeight: config.typography.fontWeight.semibold
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
            >
              {whyInvestConfig.cta.text || 'Comenzar a Invertir'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyInvestSection;
