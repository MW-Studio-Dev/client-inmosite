'use client';

import React, { useState } from 'react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import axiosInstance from '@/lib/api';
import { useToast } from '@/components/common/Toast';
import {
  HiShoppingCart,
  HiLink,
  HiExternalLink,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiRefresh
} from 'react-icons/hi';

interface IntegrationCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  logo: string;
  available: boolean;
  comingSoon?: boolean;
  connectUrl?: string;
  externalUrl?: string;
}

const IntegrationsGrid: React.FC = () => {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { showSuccess, showError } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);

  const integrations: IntegrationCard[] = [
    {
      id: 'mercadolibre',
      name: 'Mercado Libre',
      description: 'Publica tus propiedades en la plataforma de e-commerce más grande de América Latina',
      icon: <HiShoppingCart className="h-8 w-8" />,
      logo: '/images/integrations/mercadolibre-logo.png',
      available: true,
      connectUrl: '/integrations/mercadolibre/auth/get_oauth_url/',
      externalUrl: 'https://www.mercadolibre.com.ar'
    },
    {
      id: 'zonaprops',
      name: 'ZonaProp',
      description: 'Alcanza más compradores y vendedores en el portal inmobiliario líder',
      icon: <HiLink className="h-8 w-8" />,
      logo: '/images/integrations/zonaprops-logo.png',
      available: false,
      comingSoon: true
    },
    {
      id: 'argenprop',
      name: 'Argenprop',
      description: 'Conecta con uno de los portales inmobiliarios más importantes de Argentina',
      icon: <HiLink className="h-8 w-8" />,
      logo: '/images/integrations/argenprop-logo.png',
      available: false,
      comingSoon: true
    }
  ];

  const handleConnect = async (integration: IntegrationCard) => {
    if (!integration.available || !integration.connectUrl) return;

    setConnecting(integration.id);
    try {
      const response = await axiosInstance.get(integration.connectUrl);
      const { oauth_url, state } = response.data.data;

      // Guardar el state en sessionStorage para validación
      sessionStorage.setItem('meli_oauth_state', state);

      // Redirigir a la plataforma externa
      window.location.href = oauth_url;
    } catch (error: any) {
      console.error(`Error connecting to ${integration.name}:`, error);
      const errorMsg = error.response?.data?.message || `Error al conectar con ${integration.name}`;
      showError(errorMsg);
      setConnecting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <div
          key={integration.id}
          className={`relative rounded-xl border overflow-hidden transition-all duration-300 ${
            integration.available
              ? isDark
                ? 'bg-gray-800 border-gray-700 hover:border-yellow-600 hover:shadow-lg'
                : 'bg-white border-gray-200 hover:border-yellow-400 hover:shadow-lg'
              : isDark
                ? 'bg-gray-800/50 border-gray-700 opacity-60'
                : 'bg-white/50 border-gray-200 opacity-60'
          }`}
        >
          {/* Badge for coming soon */}
          {integration.comingSoon && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500 text-white">
                Próximamente
              </span>
            </div>
          )}

          {/* Logo Section */}
          <div className={`h-32 flex items-center justify-center relative ${
            isDark ? 'bg-gray-900/50' : 'bg-gray-50'
          }`}>
            {/* Placeholder for logo */}
            <div className={`w-24 h-24 rounded-lg flex items-center justify-center ${
              integration.id === 'mercadolibre'
                ? isDark
                  ? 'bg-yellow-500/10 border-2 border-yellow-500/20'
                  : 'bg-yellow-50 border-2 border-yellow-200'
                : isDark
                  ? 'bg-gray-700/50 border-2 border-gray-600'
                  : 'bg-gray-200 border-2 border-gray-300'
            }`}>
              {integration.id === 'mercadolibre' ? (
                <div className={`p-3 rounded-lg ${
                  isDark
                    ? 'bg-yellow-500/20 border border-yellow-500/30'
                    : 'bg-yellow-100 border border-yellow-300'
                }`}>
                  <HiShoppingCart className="h-12 w-12 text-yellow-500" />
                </div>
              ) : (
                <div className={`p-3 rounded-lg ${
                  isDark
                    ? 'bg-gray-600/50 border border-gray-500'
                    : 'bg-gray-300 border border-gray-400'
                }`}>
                  <HiLink className={`h-12 w-12 ${
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  }`} />
                </div>
              )}
            </div>

            {/* Brand label overlay */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className={`px-2 py-1 rounded text-center text-xs font-medium ${
                integration.id === 'mercadolibre'
                  ? isDark
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : isDark
                    ? 'bg-gray-700/50 text-gray-400 border border-gray-600'
                    : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}>
                {integration.name}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {integration.name}
              </h3>
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {integration.description}
              </p>
            </div>

            {/* Status indicator for available integrations */}
            {integration.available && (
              <div className={`mb-4 p-3 rounded-lg ${
                isDark
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-green-400' : 'text-green-700'
                  }`}>
                    Disponible para conectar
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {integration.available ? (
                <>
                  <button
                    onClick={() => handleConnect(integration)}
                    disabled={connecting === integration.id}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      isDark
                        ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {connecting === integration.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Conectando...
                      </>
                    ) : (
                      <>
                        <HiLink className="h-4 w-4" />
                        Conectar {integration.name}
                      </>
                    )}
                  </button>

                  {integration.externalUrl && (
                    <a
                      href={integration.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                      }`}
                    >
                      <HiExternalLink className="h-4 w-4" />
                      Visitar {integration.name}
                    </a>
                  )}
                </>
              ) : (
                <button
                  disabled
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                    isDark
                      ? 'bg-gray-700/50 text-gray-500 border-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  <HiXCircle className="h-4 w-4" />
                  {integration.comingSoon ? 'Próximamente' : 'No disponible'}
                </button>
              )}
            </div>

            {/* Additional info */}
            {integration.id === 'mercadolibre' && (
              <div className={`mt-4 pt-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-green-500' : 'bg-green-600'
                    }`}></div>
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Publicación automática
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-green-500' : 'bg-green-600'
                    }`}></div>
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Sincronización en tiempo real
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-green-500' : 'bg-green-600'
                    }`}></div>
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Gestión de inventario
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntegrationsGrid;