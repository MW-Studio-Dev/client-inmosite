'use client';

import React, { Suspense } from 'react';
import { WebsiteConfigProvider } from '@/contexts/WebsiteConfigContext';

interface WebsiteConfigWrapperProps {
  subdomain: string;
  children: React.ReactNode;
}

// Componente de loading simple
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

/**
 * Client component wrapper para proveer el contexto de configuración
 * del website a todas las páginas del subdomain
 */
export const WebsiteConfigWrapper: React.FC<WebsiteConfigWrapperProps> = ({
  subdomain,
  children
}) => {
  return (
    <WebsiteConfigProvider subdomain={subdomain}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </WebsiteConfigProvider>
  );
};
