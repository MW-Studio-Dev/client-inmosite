// components/dashboard/website/HeroEditor.tsx
'use client';

import React from 'react';
import { ConfigSection } from './ConfigSection';
import { WebsiteConfig } from '@/types/website';

interface HeroEditorProps {
  config: Partial<WebsiteConfig>;
  onChange: (field: keyof WebsiteConfig, value: any) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ config, onChange }) => {
  return (
    <ConfigSection
      title="Sección Hero"
      description="Personaliza la sección principal de bienvenida"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      collapsible
      defaultOpen={true}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título Principal
          </label>
          <input
            type="text"
            value={config.hero_title || ''}
            onChange={(e) => onChange('hero_title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Encontrá tu hogar ideal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtítulo
          </label>
          <textarea
            value={config.hero_subtitle || ''}
            onChange={(e) => onChange('hero_subtitle', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe tu servicio brevemente..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto del Botón CTA
          </label>
          <input
            type="text"
            value={config.hero_cta_text || ''}
            onChange={(e) => onChange('hero_cta_text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Ver propiedades"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Video de Fondo (opcional)
          </label>
          <input
            type="url"
            value={config.hero_background_video_url || ''}
            onChange={(e) => onChange('hero_background_video_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Si no se especifica, se usará una imagen de fondo
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hero_show_search_bar"
            checked={config.hero_show_search_bar ?? true}
            onChange={(e) => onChange('hero_show_search_bar', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="hero_show_search_bar" className="ml-2 text-sm text-gray-700">
            Mostrar barra de búsqueda en el Hero
          </label>
        </div>
      </div>
    </ConfigSection>
  );
};
