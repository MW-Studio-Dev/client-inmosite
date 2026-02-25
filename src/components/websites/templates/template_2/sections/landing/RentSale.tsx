'use client';

import React from 'react';
import { TemplateConfig } from '../../types';
import { FaHome, FaBuilding, FaMapMarkedAlt, FaCity } from 'react-icons/fa';

interface RentSaleSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

// Mapeo de iconos según el tipo de propiedad
const getPropertyIcon = (title: string) => {
  const iconClass = "text-6xl"; // Tamaño del icono
  
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('casa')) {
    return <FaHome className={iconClass} />;
  } else if (titleLower.includes('departamento')) {
    return <FaBuilding className={iconClass} />;
  } else if (titleLower.includes('terreno') || titleLower.includes('lotes')) {
    return <FaMapMarkedAlt className={iconClass} />;
  } else if (titleLower.includes('emprendimiento')) {
    return <FaCity className={iconClass} />;
  }
  
  return <FaHome className={iconClass} />;
};

const RentSaleSection: React.FC<RentSaleSectionProps> = ({ config, adaptiveColors }) => {
  if (!config.sections.showRentSale) return null;

  const enabledPropertyTypes = Object.entries(config.sections.propertyTypes)
    .filter(([_, type]) => type.enabled)
    .map(([key, type]) => ({ key, ...type }));

  // Función para determinar si un tipo de propiedad puede ser alquilado
  const canBeRented = (title: string) => {
    const titleLower = title.toLowerCase();
    return !titleLower.includes('terreno') &&
           !titleLower.includes('lote') &&
           !titleLower.includes('emprendimiento');
  };

  return (
    <section className="py-20" style={{ backgroundColor: config.colors.surface }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl mb-4"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold
            }}
          >
            ¿Qué tipo de propiedad buscas?
          </h2>
          <p 
            className="text-lg"
            style={{ color: config.colors.textLight }}
          >
            Tenemos opciones para cada necesidad y presupuesto
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {enabledPropertyTypes.map((propertyType) => (
            <div
              key={propertyType.key}
              className="p-6 sm:p-8 text-center rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: config.colors.background }}
            >
              <div
                className="mb-4 sm:mb-6 flex justify-center items-center"
                style={{ color: config.colors.primary }}
              >
                {getPropertyIcon(propertyType.title)}
              </div>
              <h3
                className="text-xl sm:text-2xl mb-3 sm:mb-4"
                style={{
                  color: config.colors.text,
                  fontWeight: config.typography.fontWeight.bold
                }}
              >
                {propertyType.title}
              </h3>
              <p
                className="mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base"
                style={{
                  color: config.colors.textLight,
                  fontWeight: config.typography.fontWeight.normal
                }}
              >
                {propertyType.description}
              </p>
              <div className="space-y-2">
                <button
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  style={{
                    backgroundColor: config.colors.primary,
                    color: adaptiveColors.primaryText,
                    fontWeight: config.typography.fontWeight.semibold
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.secondary}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
                >
                  Ver en Venta
                </button>
                {canBeRented(propertyType.title) && (
                  <button
                    className="w-full border-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                    style={{
                      borderColor: config.colors.primary,
                      color: config.colors.primary,
                      backgroundColor: 'transparent',
                      fontWeight: config.typography.fontWeight.semibold
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = config.colors.secondary;
                      e.currentTarget.style.color = adaptiveColors.primaryText;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = config.colors.primary;
                    }}
                  >
                    Ver en Alquiler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentSaleSection;
