// components/dashboard/website/ColorSchemeEditor.tsx
'use client';

import React from 'react';
import { ColorPicker } from './ColorPicker';
import { ConfigSection } from './ConfigSection';
import { WebsiteConfig } from '@/types/website';

interface ColorSchemeEditorProps {
  config: Partial<WebsiteConfig>;
  onChange: (field: keyof WebsiteConfig, value: any) => void;
}

export const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({
  config,
  onChange,
}) => {
  return (
    <ConfigSection
      title="Colores del Sitio"
      description="Personaliza la paleta de colores de tu sitio web"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      }
      collapsible
      defaultOpen={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colores Primarios */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Colores Primarios</h4>

          <ColorPicker
            label="Color Principal"
            value={config.primary_color || '#dc2626'}
            onChange={(value) => onChange('primary_color', value)}
            description="Color principal de tu marca"
          />

          <ColorPicker
            label="Color Principal Oscuro"
            value={config.primary_dark_color || '#991b1b'}
            onChange={(value) => onChange('primary_dark_color', value)}
            description="Versión más oscura para hover y énfasis"
          />

          <ColorPicker
            label="Color Principal Claro"
            value={config.primary_light_color || '#ef4444'}
            onChange={(value) => onChange('primary_light_color', value)}
            description="Versión más clara para fondos sutiles"
          />
        </div>

        {/* Colores Secundarios */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Colores Secundarios</h4>

          <ColorPicker
            label="Color Secundario"
            value={config.secondary_color || '#b91c1c'}
            onChange={(value) => onChange('secondary_color', value)}
            description="Color de acento secundario"
          />

          <ColorPicker
            label="Color de Acento"
            value={config.accent_color || '#dc2626'}
            onChange={(value) => onChange('accent_color', value)}
            description="Para destacar elementos importantes"
          />
        </div>

        {/* Colores de Fondo */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Colores de Fondo</h4>

          <ColorPicker
            label="Fondo Principal"
            value={config.background_color || '#ffffff'}
            onChange={(value) => onChange('background_color', value)}
            description="Color de fondo general del sitio"
          />

          <ColorPicker
            label="Fondo de Superficie"
            value={config.surface_color || '#fef2f2'}
            onChange={(value) => onChange('surface_color', value)}
            description="Color para tarjetas y secciones"
          />
        </div>

        {/* Colores de Texto */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Colores de Texto</h4>

          <ColorPicker
            label="Texto Principal"
            value={config.text_color || '#0f172a'}
            onChange={(value) => onChange('text_color', value)}
            description="Color del texto principal"
          />

          <ColorPicker
            label="Texto Secundario"
            value={config.text_light_color || '#64748b'}
            onChange={(value) => onChange('text_light_color', value)}
            description="Color para texto secundario o subtítulos"
          />
        </div>

        {/* Colores de Estado */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="font-medium text-gray-900">Colores de Estado</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorPicker
              label="Éxito"
              value={config.success_color || '#10b981'}
              onChange={(value) => onChange('success_color', value)}
              description="Para mensajes positivos"
            />

            <ColorPicker
              label="Advertencia"
              value={config.warning_color || '#f59e0b'}
              onChange={(value) => onChange('warning_color', value)}
              description="Para avisos importantes"
            />

            <ColorPicker
              label="Error"
              value={config.error_color || '#dc2626'}
              onChange={(value) => onChange('error_color', value)}
              description="Para mensajes de error"
            />
          </div>
        </div>
      </div>

      {/* Vista previa de colores */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Vista Previa</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries({
            'Principal': config.primary_color,
            'Principal Oscuro': config.primary_dark_color,
            'Principal Claro': config.primary_light_color,
            'Secundario': config.secondary_color,
            'Acento': config.accent_color,
          }).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </ConfigSection>
  );
};
