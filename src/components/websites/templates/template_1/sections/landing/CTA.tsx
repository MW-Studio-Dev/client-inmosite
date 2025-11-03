'use client';

import React from 'react';
import { TemplateConfig } from '../../types';

interface CallToActionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const CallToAction: React.FC<CallToActionProps> = ({ config, adaptiveColors }) => {
  return (
    <section
      // --- CLASES MODIFICADAS AQUÍ ---
      className="py-12 sm:py-16 md:py-20 mx-4 sm:mx-6 lg:mx-8 rounded-2xl"
      style={{
        backgroundColor: config.colors.primary,
        color: adaptiveColors.accentText
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 px-2"
          style={{ fontWeight: config.typography.fontWeight.bold, color: adaptiveColors.primaryText }}
        >
          ¿Listo para encontrar tu próximo hogar?
        </h2>
        <p
          className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed px-4"
          style={{ fontWeight: config.typography.fontWeight.normal, color: adaptiveColors.primaryText  }}
        >
          Explora nuestra amplia selección de propiedades y encuentra exactamente lo que buscas.
        </p>
        <a
          className="bg-transparent border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-200 text-base sm:text-lg inline-block shadow-lg hover:shadow-xl"
          style={{
            borderColor: adaptiveColors.primaryText,
            color: adaptiveColors.primaryText,
            fontWeight: config.typography.fontWeight.semibold
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = adaptiveColors.primaryText;
            e.currentTarget.style.color = config.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = adaptiveColors.primaryText;
          }}
          href='/properties'
        >
          Ver Todas las Propiedades
        </a>
      </div>
    </section>
  );
};

export default CallToAction;