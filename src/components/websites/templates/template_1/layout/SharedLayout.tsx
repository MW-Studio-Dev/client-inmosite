'use client';

import React from 'react';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';
import { Navbar, TopHeader, Footer } from '../sections/layout';
import ErrorBoundary from '@/components/debug/ErrorBoundary';

// Funciones de utilidad para colores adaptativos
const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

const getAdaptiveTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

// WhatsApp Button Component
const WhatsAppButton: React.FC<{ config: any }> = ({ config }) => {
  if (!config) return null;

  return (
    <a
      href={`https://wa.me/${config.company.whatsapp}?text=${encodeURIComponent(
        config.sections.contact.info.methods.whatsapp.message || '¡Hola! Me interesa conocer más sobre sus propiedades.'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor: config.colors.success }}
      className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-50 transform hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
      </svg>
    </a>
  );
};

interface SharedLayoutProps {
  children: React.ReactNode;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ children }) => {
  const { config, loading, error } = useWebsiteConfigContext();

  // Mostrar loading mientras carga la config
  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si falla la carga
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900">Error al cargar configuración</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const adaptiveColors = {
    primaryText: getAdaptiveTextColor(config.colors.primary),
    accentText: getAdaptiveTextColor(config.colors.accent),
    backgroundText: getAdaptiveTextColor(config.colors.background),
    surfaceText: getAdaptiveTextColor(config.colors.surface)
  };

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: config.colors.background }} className="min-h-screen">
        {/* Header fijo - renderizado una sola vez */}
        <TopHeader config={config} />
        <Navbar config={config} adaptiveColors={adaptiveColors} />

        {/* Contenido dinámico de cada página */}
        <main className="min-h-[calc(100vh-200px)]">
          {children}
        </main>

        {/* Footer fijo - renderizado una sola vez */}
        <Footer config={config} adaptiveColors={adaptiveColors} />

        {/* WhatsApp Button fijo - renderizado una sola vez */}
        <WhatsAppButton config={config} />
      </div>
    </ErrorBoundary>
  );
};

export default SharedLayout;
