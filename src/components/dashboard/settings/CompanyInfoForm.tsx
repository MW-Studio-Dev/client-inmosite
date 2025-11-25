'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import {
  HiOfficeBuilding,
  HiGlobe,
  HiCreditCard,
  HiClock,
  HiCheck,
  HiX,
  HiExclamation
} from 'react-icons/hi';

interface CompanyFormData {
  name: string;
  company_type: string;
  subdomain: string;
  custom_domain: string;
  logo: string;
  timezone: string;
  cuit?: string;
  phone?: string;
  email?: string;
  address?: string;
}

const COMPANY_TYPES = [
  { value: 'inmobiliaria', label: 'Inmobiliaria' },
  { value: 'desarrollo', label: 'Desarrollo Inmobiliario' },
  { value: 'corredor', label: 'Corredor Inmobiliario' }
];

const SUBSCRIPTION_PLANS = [
  { value: 'basic', label: 'Básico' },
  { value: 'professional', label: 'Profesional' },
  { value: 'premium', label: 'Premium' }
];

const TIMEZONES = [
  'America/Argentina/Buenos_Aires',
  'America/Argentina/Cordoba',
  'America/Argentina/Mendoza',
  'America/Mexico_City',
  'America/Santiago',
  'America/Montevideo',
  'America/Lima',
  'America/Bogota',
  'America/Caracas'
];

export default function CompanyInfoForm() {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { user, company, updateUser } = useAuth();

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    company_type: 'inmobiliaria',
    subdomain: '',
    custom_domain: '',
    logo: '',
    timezone: 'America/Argentina/Buenos_Aires',
    cuit: '',
    phone: '',
    email: '',
    address: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        company_type: company.company_type || 'inmobiliaria',
        subdomain: company.subdomain || '',
        custom_domain: company.custom_domain || '',
        logo: company.logo || '',
        timezone: company.timezone || 'America/Argentina/Buenos_Aires',
        cuit: company.cuit || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || ''
      });
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Aquí deberías hacer la llamada a tu API para actualizar la empresa
      // Por ahora simulo una llamada exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar el estado local con los nuevos datos
      if (updateUser) {
        await updateUser({
          company: {
            ...company,
            ...formData
          }
        });
      }

      setMessage({
        type: 'success',
        text: 'Información de la empresa actualizada correctamente'
      });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al actualizar la información de la empresa'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name || '',
        company_type: company.company_type || 'inmobiliaria',
        subdomain: company.subdomain || '',
        custom_domain: company.custom_domain || '',
        logo: company.logo || '',
        timezone: company.timezone || 'America/Argentina/Buenos_Aires',
        cuit: company.cuit || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || ''
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  if (!user?.is_company_owner) {
    return (
      <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="text-center py-8">
          <HiExclamation className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Acceso Restringido
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Solo los propietarios de la empresa pueden acceder a esta configuración
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                Información de la Empresa
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Configura los datos de tu inmobiliaria
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            message.type === 'success'
              ? isDark
                ? 'bg-green-900/20 border-green-500/30 text-green-400'
                : 'bg-green-50 border-green-200 text-green-800'
              : isDark
                ? 'bg-red-900/20 border-red-500/30 text-red-400'
                : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <HiCheck className="h-5 w-5 flex-shrink-0" />
            ) : (
              <HiX className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de la Empresa */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
              </div>

              {/* CUIT */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  CUIT
                </label>
                <input
                  type="text"
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleInputChange}
                  placeholder="XX-XXXXXXXX-X"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
              </div>

              {/* Tipo de Empresa */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Tipo de Empresa *
                </label>
                <select
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  {COMPANY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teléfono */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email de Contacto
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
              </div>

              {/* Zona Horaria */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Zona Horaria *
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subdomain */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Subdominio
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 rounded-l-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                  />
                  <span className={`px-3 py-2 rounded-r-lg border border-l-0 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-600'
                  }`}>
                    .inmosite.com
                  </span>
                </div>
              </div>

              {/* Dominio Personalizado */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Dominio Personalizado
                </label>
                <input
                  type="url"
                  name="custom_domain"
                  value={formData.custom_domain}
                  onChange={handleInputChange}
                  placeholder="https://tu-dominio.com"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Dirección
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
            </div>

            {/* Logo */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                URL del Logo
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/logo.png"
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        ) : (
          /* Read-only view */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
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
                    CUIT
                  </label>
                  <p className={`text-sm font-semibold mt-1 ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {company?.cuit || 'No configurado'}
                  </p>
                </div>

                <div>
                  <label className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Tipo de Empresa
                  </label>
                  <p className={`text-sm font-semibold mt-1 capitalize ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {company?.company_type || 'No configurado'}
                  </p>
                </div>

                <div>
                  <label className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Teléfono
                  </label>
                  <p className={`text-sm font-semibold mt-1 ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {company?.phone || 'No configurado'}
                  </p>
                </div>
              </div>

              {/* Web Info */}
              <div className="space-y-4">
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

                <div>
                  <label className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Subdominio
                  </label>
                  <p className={`text-sm font-semibold mt-1 ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {company?.subdomain ? `${company.subdomain}.inmosite.com` : 'No configurado'}
                  </p>
                </div>

                <div>
                  <label className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Dominio Personalizado
                  </label>
                  <p className={`text-sm font-semibold mt-1 ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {company?.custom_domain || 'No configurado'}
                  </p>
                </div>

                <div>
                  <label className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Zona Horaria
                  </label>
                  <p className={`text-sm font-semibold mt-1 ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {company?.timezone || 'No configurado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Address and Logo */}
            {company?.address && (
              <div>
                <label className={`text-xs font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Dirección
                </label>
                <p className={`text-sm font-semibold mt-1 ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {company.address}
                </p>
              </div>
            )}

            {company?.logo && (
              <div>
                <label className={`text-xs font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Logo
                </label>
                <div className="mt-2">
                  <img
                    src={company.logo}
                    alt="Logo de la empresa"
                    className="h-16 w-auto object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}