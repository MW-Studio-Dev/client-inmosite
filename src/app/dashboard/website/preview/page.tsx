'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWebsiteAdmin } from '@/hooks/useWebsiteAdmin';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const TEMPLATES = [
  { id: 'classic', name: 'Clásico', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'modern', name: 'Moderno', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { id: 'elegant', name: 'Elegante', icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2H5zM19 11a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6a2 2 0 012-2h2z' }
];

export default function WebsitePreviewPage() {
  const router = useRouter();
  const { config, loading, saveConfig, saving } = useWebsiteAdmin();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const host = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';

      let baseHost = host;
      if (host.includes('localhost') || host.includes('127.0.0.1')) {
        baseHost = 'localhost';
      } else {
        const parts = host.split('.');
        if (parts.length > 2) {
          baseHost = parts.slice(-2).join('.');
        }
      }

      if (config?.subdomain) {
        setPreviewUrl(`${protocol}//${config.subdomain}.${baseHost}${port}`);
      } else {
        setPreviewUrl(`${protocol}//${host}${port}/preview`);
      }
    }
  }, [config]);

  const deviceSizes = {
    desktop: { width: '100%', height: '800px' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  const handleTemplateChange = async (templateId: string) => {
    if (config?.template === templateId) return;
    try {
      await saveConfig({ template: templateId });
      // Force reload the iframe to ensure styles are updated
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe) {
        const url = new URL(previewUrl);
        url.searchParams.set('t', Date.now().toString());
        iframe.src = url.toString();
      }
    } catch (err) {
      console.error('Error switching template:', err);
      alert('Error cambiando la plantilla');
    }
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

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Template Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Diseño
            </h3>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  disabled={saving}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors border ${config?.template === t.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={t.icon} />
                    </svg>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Device Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Dispositivo
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDevice('desktop')}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors border ${device === 'desktop'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
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
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors border ${device === 'tablet'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
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
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors border ${device === 'mobile'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
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
                id="preview-iframe"
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
