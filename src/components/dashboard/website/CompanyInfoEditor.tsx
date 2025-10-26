// components/dashboard/website/CompanyInfoEditor.tsx
'use client';

import React from 'react';
import { ConfigSection } from './ConfigSection';
import { WebsiteConfig } from '@/types/website';

interface CompanyInfoEditorProps {
  config: Partial<WebsiteConfig>;
  onChange: (field: keyof WebsiteConfig, value: any) => void;
}

export const CompanyInfoEditor: React.FC<CompanyInfoEditorProps> = ({
  config,
  onChange,
}) => {
  return (
    <ConfigSection
      title="Información de la Empresa"
      description="Datos de contacto y configuración de la inmobiliaria"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      collapsible
      defaultOpen={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Inmobiliaria *
          </label>
          <input
            type="text"
            value={config.company_name || ''}
            onChange={(e) => onChange('company_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Inmobiliaria MW"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            value={config.company_phone || ''}
            onChange={(e) => onChange('company_phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+54 9 11 1234-5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={config.company_email || ''}
            onChange={(e) => onChange('company_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="contacto@inmobiliaria.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={config.company_whatsapp || ''}
            onChange={(e) => onChange('company_whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+5491112345678"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número con código de país (sin espacios)
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <input
            type="text"
            value={config.company_address || ''}
            onChange={(e) => onChange('company_address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Av. Principal 1234, Ciudad, País"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ancho del Logo (px)
          </label>
          <input
            type="number"
            value={config.company_logo_width || 150}
            onChange={(e) => onChange('company_logo_width', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            min="50"
            max="300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alto del Logo (px)
          </label>
          <input
            type="number"
            value={config.company_logo_height || 50}
            onChange={(e) => onChange('company_logo_height', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            min="30"
            max="150"
          />
        </div>
      </div>
    </ConfigSection>
  );
};
