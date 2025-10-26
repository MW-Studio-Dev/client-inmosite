'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWebsiteAdmin } from '@/hooks/useWebsiteAdmin';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export default function WebsitePreviewPage() {
  const router = useRouter();
  const { config, loading } = useWebsiteAdmin();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (config?.subdomain) {
      // URL del preview basado en el subdominio
      setPreviewUrl(`http://${config.subdomain}.localhost:3001`);
    } else {
      // URL de preview genérico si no hay subdominio
      setPreviewUrl('http://localhost:3001/preview');
    }
  }, [config]);

  const deviceSizes = {
    desktop: { width: '100%', height: '800px' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  const handleOpenLive = () => {
    if (config?.custom_domain) {
      window.open(`https://${config.custom_domain}`, '_blank');
    } else if (config?.subdomain) {
      window.open(previewUrl, '_blank');
    }
  };

  const handleBackToConfig = () => {
    router.push('/dashboard/website');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={handleBackToConfig}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Configuración
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Vista Previa del Sitio Web</h2>
          <p className="mt-2 text-lg text-gray-600">
            Previsualiza cómo se verá tu sitio web en diferentes dispositivos
          </p>
        </div>

        <div className="flex items-center gap-3">
          {config?.is_published && (
            <button
              onClick={handleOpenLive}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver Sitio en Vivo
            </button>
          )}
        </div>
      </div>

      {/* Device Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Dispositivo
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setDevice('desktop')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                device === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Desktop
              </span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                device === 'tablet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Tablet
              </span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                device === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Móvil
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[600px]">
          {!config ? (
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg mb-2">
                No hay configuración disponible
              </p>
              <p className="text-gray-500 mb-4">
                Primero debes configurar tu sitio web
              </p>
              <button
                onClick={handleBackToConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ir a Configuración
              </button>
            </div>
          ) : (
            <div
              className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={{
                width: deviceSizes[device].width,
                height: deviceSizes[device].height,
                maxWidth: '100%',
              }}
            >
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h4 className="font-bold text-gray-900">Responsive</h4>
          </div>
          <p className="text-sm text-gray-600">
            Tu sitio se adapta automáticamente a todos los dispositivos
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h4 className="font-bold text-gray-900">Optimizado</h4>
          </div>
          <p className="text-sm text-gray-600">
            Carga rápida y optimizado para SEO
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h4 className="font-bold text-gray-900">Actualización Automática</h4>
          </div>
          <p className="text-sm text-gray-600">
            Los cambios se reflejan inmediatamente
          </p>
        </div>
      </div>

      {/* URL Info */}
      {config && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-blue-900 mb-1">URL de tu sitio web</p>
              <p className="text-sm text-blue-700">
                {config.is_published ? (
                  <>
                    Tu sitio está publicado en:{' '}
                    <a
                      href={config.custom_domain ? `https://${config.custom_domain}` : previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono underline"
                    >
                      {config.custom_domain || config.subdomain + '.tudominio.com'}
                    </a>
                  </>
                ) : (
                  'Tu sitio aún no está publicado. Guarda los cambios y publícalo desde la configuración.'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
