'use client';

import React from 'react';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  KeyIcon,
  ChartBarIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';

interface HowItWorksSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

// Iconos disponibles para los pasos
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MagnifyingGlassIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  KeyIcon,
  ChartBarIcon,
  UserGroupIcon
};

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ config, adaptiveColors }) => {
  // Validar que la sección esté habilitada
  if (!config.sections.howItWorks?.enabled) {
    return null;
  }

  const howItWorksConfig = config.sections.howItWorks;

  // Pasos por defecto si no vienen en la config
  const defaultSteps = [
    {
      number: 1,
      icon: 'MagnifyingGlassIcon',
      title: 'Explora Oportunidades',
      description: 'Navega nuestro catálogo curado de inversiones inmobiliarias premium con análisis detallado de cada propiedad.'
    },
    {
      number: 2,
      icon: 'ChartBarIcon',
      title: 'Análisis Profesional',
      description: 'Recibe asesoría personalizada de nuestro equipo experto con proyecciones de ROI y evaluación de riesgos.'
    },
    {
      number: 3,
      icon: 'DocumentCheckIcon',
      title: 'Due Diligence Legal',
      description: 'Nuestro equipo legal verifica todos los documentos y garantiza una transacción segura y transparente.'
    },
    {
      number: 4,
      icon: 'BanknotesIcon',
      title: 'Financiamiento',
      description: 'Te conectamos con las mejores opciones de financiamiento adaptadas a tu perfil de inversión.'
    },
    {
      number: 5,
      icon: 'KeyIcon',
      title: 'Cierre de Deal',
      description: 'Acompañamiento completo en el proceso de cierre y entrega de llaves de tu inversión.'
    },
    {
      number: 6,
      icon: 'UserGroupIcon',
      title: 'Gestión Post-Venta',
      description: 'Soporte continuo y servicios de gestión de propiedades para maximizar tu retorno de inversión.'
    }
  ];

  const steps = howItWorksConfig.steps || defaultSteps;

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
            {howItWorksConfig.title || '¿Cómo Funciona?'}
          </h2>
          {howItWorksConfig.subtitle && (
            <p
              className="text-lg max-w-3xl mx-auto mb-6"
              style={{
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {howItWorksConfig.subtitle}
            </p>
          )}
          {howItWorksConfig.description && (
            <p
              className="text-base max-w-2xl mx-auto"
              style={{
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {howItWorksConfig.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Imagen destacada (si existe) */}
          {howItWorksConfig.image && (
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={howItWorksConfig.image}
                  alt={howItWorksConfig.title || 'Cómo funciona'}
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

              {/* Stats decorativos opcionales */}
              {howItWorksConfig.stats && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {howItWorksConfig.stats.map((stat: any, index: number) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-lg"
                      style={{ backgroundColor: config.colors.surface }}
                    >
                      <div
                        className="text-2xl md:text-3xl mb-1"
                        style={{
                          color: config.colors.primary,
                          fontWeight: config.typography.fontWeight.bold
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          color: config.colors.textLight,
                          fontWeight: config.typography.fontWeight.medium
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline de pasos - Vista compacta para cuando hay imagen */}
          {howItWorksConfig.image && (
            <div className="order-1 lg:order-2">
              <div className="space-y-4">
                {steps.slice(0, 4).map((step, index) => {
                  const IconComponent = iconMap[step.icon] || MagnifyingGlassIcon;

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: config.colors.surface,
                        border: `2px solid ${config.colors.primary}20`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = config.colors.primary + '60';
                        e.currentTarget.style.backgroundColor = config.colors.primary + '05';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = config.colors.primary + '20';
                        e.currentTarget.style.backgroundColor = config.colors.surface;
                      }}
                    >
                      {/* Número e icono */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: config.colors.primary,
                            color: adaptiveColors.primaryText
                          }}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 pt-1">
                        <h3
                          className="text-lg mb-1"
                          style={{
                            color: config.colors.text,
                            fontWeight: config.typography.fontWeight.semibold
                          }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: config.colors.textLight,
                            fontWeight: config.typography.fontWeight.normal
                          }}
                        >
                          {step.description}
                        </p>
                      </div>

                      {/* Badge de número */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: config.colors.primary + '20',
                          color: config.colors.primary,
                          fontWeight: config.typography.fontWeight.bold
                        }}
                      >
                        {step.number}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Timeline horizontal completa - Solo si NO hay imagen */}
        {!howItWorksConfig.image && (
          <div className="relative">
            {/* Línea conectora en desktop */}
            <div
              className="hidden lg:block absolute top-14 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(to right, ${config.colors.primary}20, ${config.colors.primary}, ${config.colors.primary}20)`,
                zIndex: 0
              }}
            />

            {/* Grid de pasos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = iconMap[step.icon] || MagnifyingGlassIcon;

                return (
                  <div
                    key={index}
                    className="group text-center transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Número e icono */}
                    <div className="flex flex-col items-center mb-4">
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                        style={{
                          backgroundColor: config.colors.primary,
                          color: adaptiveColors.primaryText
                        }}
                      >
                        <IconComponent className="h-12 w-12" />
                      </div>

                      {/* Badge de número */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md"
                        style={{
                          backgroundColor: config.colors.background,
                          color: config.colors.primary,
                          fontWeight: config.typography.fontWeight.bold,
                          border: `3px solid ${config.colors.primary}`
                        }}
                      >
                        {step.number}
                      </div>
                    </div>

                    {/* Card de contenido */}
                    <div
                      className="p-6 rounded-xl"
                      style={{
                        backgroundColor: config.colors.surface
                      }}
                    >
                      <h3
                        className="text-xl mb-3"
                        style={{
                          color: config.colors.text,
                          fontWeight: config.typography.fontWeight.semibold
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: config.colors.textLight,
                          fontWeight: config.typography.fontWeight.normal
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div
            className="inline-block p-6 rounded-xl max-w-2xl"
            style={{ backgroundColor: config.colors.surface }}
          >
            <p
              className="text-lg mb-4"
              style={{
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.medium
              }}
            >
              {howItWorksConfig.ctaText || '¿Listo para comenzar tu inversión inmobiliaria?'}
            </p>
            <button
              className="px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: config.colors.primary,
                color: adaptiveColors.primaryText,
                fontWeight: config.typography.fontWeight.semibold
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
            >
              {howItWorksConfig.ctaButton || 'Comenzar Ahora'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
