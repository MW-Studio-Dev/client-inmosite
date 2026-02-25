'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebsiteAdmin } from '@/hooks/useWebsiteAdmin';
import { WebsiteConfig } from '@/types/website';
import { ColorSchemeEditor } from '@/components/dashboard/website/ColorSchemeEditor';
import { HeroEditor } from '@/components/dashboard/website/HeroEditor';
import { CompanyInfoEditor } from '@/components/dashboard/website/CompanyInfoEditor';
import { SocialMediaEditor } from '@/components/dashboard/website/SocialMediaEditor';
import { WebsiteOnboarding } from '@/components/dashboard/website/WebsiteOnboarding';

export default function SitioWebPage() {
  const router = useRouter();
  const {
    config,
    templates,
    loading,
    saving,
    error,
    saveConfig,
    publishWebsite,
    unpublishWebsite,
  } = useWebsiteAdmin();

  const [localConfig, setLocalConfig] = useState<Partial<WebsiteConfig>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Sincronizar config cuando se carga
  React.useEffect(() => {
    if (config) {
      setLocalConfig(config);
    } else {
      // Valores por defecto si no hay configuración
      setLocalConfig({
        template: 'modern',
        primary_color: '#dc2626',
        primary_dark_color: '#991b1b',
        primary_light_color: '#ef4444',
        secondary_color: '#b91c1c',
        accent_color: '#dc2626',
        background_color: '#ffffff',
        surface_color: '#fef2f2',
        text_color: '#0f172a',
        text_light_color: '#64748b',
        success_color: '#10b981',
        warning_color: '#f59e0b',
        error_color: '#dc2626',
        font_family: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
        company_name: '',
        company_phone: '',
        company_email: '',
        company_whatsapp: '',
        company_address: '',
        company_logo_width: 150,
        company_logo_height: 50,
        hero_title: 'Encontrá tu hogar ideal',
        hero_subtitle: 'Más de 20 años conectando personas con sus propiedades soñadas.',
        hero_cta_text: 'Ver propiedades',
        hero_show_search_bar: true,
        hero_background_video_url: '',
        facebook_url: '',
        instagram_url: '',
        linkedin_url: '',
        tiktok_url: '',
        youtube_url: '',
      });
    }
  }, [config]);

  const handleFieldChange = (field: keyof WebsiteConfig, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveConfig(localConfig);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const handlePublish = async () => {
    try {
      await publishWebsite({ is_published: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error publishing website:', err);
    }
  };

  const handlePreview = () => {
    router.push('/dashboard/website/preview');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  const isConfigured = config && config.company_name && config.company_name.trim().length > 0;

  if (!isConfigured) {
    return (
      <div className="min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <WebsiteOnboarding
          initialConfig={localConfig}
          onComplete={async (onboardingConfig) => {
            try {
              await saveConfig(onboardingConfig);
              setShowSuccess(true);
              // Redirect to preview to choose template and view changes
              router.push('/dashboard/website/preview');
            } catch (err) {
              console.error(err);
              alert("Error guardando la configuración inicial");
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Configuración del Sitio Web</h2>
          <p className="mt-2 text-lg text-gray-600">
            Personaliza tu sitio web de forma completa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Vista Previa
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {config?.id && (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {config.is_published ? 'Actualizar Publicación' : 'Publicar Sitio'}
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Cambios guardados correctamente</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Status Badge */}
      {config?.is_published && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Sitio Publicado
        </div>
      )}

      {/* Configuration Sections */}
      <div className="space-y-6">
        <CompanyInfoEditor config={localConfig} onChange={handleFieldChange} />
        <ColorSchemeEditor config={localConfig} onChange={handleFieldChange} />
        <HeroEditor config={localConfig} onChange={handleFieldChange} />
        <SocialMediaEditor config={localConfig} onChange={handleFieldChange} />
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-sm text-gray-500">
            {config?.updated_at && (
              <span>Última actualización: {new Date(config.updated_at).toLocaleString('es-AR')}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
