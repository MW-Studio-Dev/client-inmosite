'use client';

import React, { useState } from 'react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { MercadoLibreIntegration } from '@/components/dashboard/integrations/MercadoLibreIntegration';
import { IntegrationsGrid } from '@/components/dashboard/integrations/IntegrationsGrid';
import {
  HiUser,
  HiLockClosed,
  HiCreditCard,
  HiBell,
  HiOfficeBuilding,
  HiChevronRight
} from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';

type Section = 'general' | 'integrations';

export default function ConfiguracionPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { user, company } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('general');

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Configuración
            </h1>
            <p className={`mt-2 text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Administra tu cuenta y preferencias
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={`border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveSection('general')}
                className={`pb-4 px-2 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeSection === 'general'
                    ? isDark
                      ? 'border-red-500 text-red-400'
                      : 'border-red-600 text-red-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-200'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveSection('integrations')}
                className={`pb-4 px-2 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeSection === 'integrations'
                    ? isDark
                      ? 'border-red-500 text-red-400'
                      : 'border-red-600 text-red-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-200'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Integraciones
              </button>
            </nav>
          </div>

          {/* General Section */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              {/* Company Info Card */}
              <div className={`rounded-xl border p-6 ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    isDark
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <HiOfficeBuilding className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Información del Negocio
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Datos de tu inmobiliaria
                    </p>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  isDark
                    ? 'bg-gray-900/50 border border-gray-700'
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="space-y-3">
                    <div>
                      <label className={`text-xs font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Nombre de la Empresa
                      </label>
                      <p className={`text-sm font-semibold mt-1 ${
                        isDark ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {company?.name || 'No configurado'}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Subdominio
                      </label>
                      <p className={`text-sm font-semibold mt-1 ${
                        isDark ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {company?.subdomain || 'No configurado'}
                      </p>
                    </div>
                    {company?.email && (
                      <div>
                        <label className={`text-xs font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Email de Contacto
                        </label>
                        <p className={`text-sm font-semibold mt-1 ${
                          isDark ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {company?.email || 'No configurado'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  className={`rounded-xl border p-6 text-left transition-all duration-200 hover:shadow-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      isDark
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <HiUser className="h-6 w-6 text-blue-500" />
                    </div>
                    <HiChevronRight className={`h-5 w-5 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Perfil
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Información personal y de contacto
                  </p>
                </button>

                <button
                  className={`rounded-xl border p-6 text-left transition-all duration-200 hover:shadow-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      isDark
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <HiLockClosed className="h-6 w-6 text-green-500" />
                    </div>
                    <HiChevronRight className={`h-5 w-5 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Seguridad
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Contraseña y configuración de seguridad
                  </p>
                </button>

                <button
                  className={`rounded-xl border p-6 text-left transition-all duration-200 hover:shadow-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      isDark
                        ? 'bg-purple-500/10 border border-purple-500/20'
                        : 'bg-purple-50 border border-purple-200'
                    }`}>
                      <HiCreditCard className="h-6 w-6 text-purple-500" />
                    </div>
                    <HiChevronRight className={`h-5 w-5 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Suscripción
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Plan actual y facturación
                  </p>
                </button>

                <button
                  className={`rounded-xl border p-6 text-left transition-all duration-200 hover:shadow-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      isDark
                        ? 'bg-yellow-500/10 border border-yellow-500/20'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <HiBell className="h-6 w-6 text-yellow-500" />
                    </div>
                    <HiChevronRight className={`h-5 w-5 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Notificaciones
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Preferencias de notificaciones
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Integrations Section */}
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Integraciones
                </h2>
                <p className={`mt-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Conecta tu cuenta con plataformas externas para automatizar la publicación de propiedades
                </p>
              </div>

              {/* Integrations Grid */}
              <IntegrationsGrid />

              {/* Current Connection Status */}
              <div className="mt-8">
                <MercadoLibreIntegration />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  