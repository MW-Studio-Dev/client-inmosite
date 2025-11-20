// app/dashboard/clients/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/common/Toast';
import axiosInstance from '@/lib/api';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import {
  HiUser,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiDocumentText,
  HiArrowLeft,
  HiEye,
  HiDownload,
  HiOfficeBuilding,
  HiIdentification,
  HiCalendar,
  HiDocument
} from 'react-icons/hi';
import { HiExclamationTriangle, HiChevronDoubleRight } from 'react-icons/hi2';

interface ClientData {
  id: string;
  client_type: string;
  client_type_display: string;
  status: string;
  status_display: string;
  current_activity: string;
  current_activity_display: string;
  first_name: string;
  last_name: string;
  full_name: string;
  cuit_cuil: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  full_address: string;
  notes: string;
  photo?: string;
  documents: Array<{
    id: string;
    document_type: string;
    document_type_display: string;
    file: string;
    description: string;
    file_size: number;
    file_size_formatted: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
  documents_count: number;
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { showError } = useToast();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = params?.id as string;

  // Helper functions
  const getClientTypeColor = (clientType: string) => {
    const colors = {
      PROPIETARIO: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
      INQUILINO: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
      INVERSOR: isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200',
      GARANTE: isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
      OTRO: isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-200',
      default: isDark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'
    };
    return colors[clientType as keyof typeof colors] || colors.default;
  };

  const getActivityColor = (activity: string) => {
    const colors = {
      ALQUILANDO: isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200',
      VENDIENDO: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200',
      BUSCANDO_ALQUILER: isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-200',
      BUSCANDO_INVERTIR: isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-200',
      OTRA: isDark ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-600 border-pink-200',
      default: isDark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'
    };
    return colors[activity as keyof typeof colors] || colors.default;
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid Argentine number
    if (cleanPhone.length === 10) {
      return `+54${cleanPhone}`;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('15')) {
      return `+549${cleanPhone.slice(1)}`;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('54')) {
      return `+${cleanPhone}`;
    } else {
      // Return original if can't format
      return phone;
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    // Clean up special characters and extra spaces
    return address
      .replace(/[^\w\s.,ºª-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const openWhatsApp = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    const message = encodeURIComponent('Hola, me contacto desde la inmobiliaria.');
    const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/clients/${clientId}/`);

      if (response.data?.success && response.data?.data) {
        setClient(response.data.data);
      } else {
        throw new Error('No se pudo obtener la información del cliente');
      }
    } catch (error: any) {
      console.error('Error al cargar cliente:', error);
      setError(error?.response?.data?.message || 'Error al cargar el cliente');
      showError('Error al cargar la información del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/clients/${clientId}/edit`);
  };

  const handleBack = () => {
    router.push('/dashboard/clients/');
  };

  const handleRetry = () => {
    fetchClient();
  };

  const downloadDocument = (document: any) => {
    if (document.file) {
      window.open(document.file, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando informaci�n del cliente...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-md w-full p-6 rounded-lg border ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <HiExclamationTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className={`text-lg font-semibold mb-2 ${
              isDark
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              Error al cargar el cliente
            </h2>
            <p className={`text-sm mb-6 ${
              isDark
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}>
              {error || 'No se pudo encontrar la información del cliente'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Reintentar
              </button>
              <button
                onClick={handleBack}
                className={`px-4 py-2 rounded-md transition-colors text-sm ${
                  isDark
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Volver a clientes"
          >
            <HiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {client.full_name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300 ${getClientTypeColor(client.client_type)}`}>
                {client.client_type_display}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300 ${getActivityColor(client.current_activity)}`}>
                {client.current_activity_display}
              </span>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                • {client.status_display}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <HiChevronDoubleRight className="h-4 w-4" />
          Editar Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className={`rounded-lg border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b transition-colors duration-300 ${
              isDark
                ? 'border-slate-700'
                : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${
                isDark
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                <HiUser className="h-5 w-5 text-red-600" />
                Información Básica
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                    Nombre Completo
                  </label>
                  <p className={`mt-1 transition-colors duration-300 ${
                    isDark
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    {client.full_name}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                    Tipo de Cliente
                  </label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300 ${getClientTypeColor(client.client_type)}`}>
                      {client.client_type_display}
                    </span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                    Estado
                  </label>
                  <p className={`mt-1 transition-colors duration-300 ${
                    isDark
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    {client.status_display}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                    Actividad Actual
                  </label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300 ${getActivityColor(client.current_activity)}`}>
                      {client.current_activity_display}
                    </span>
                  </div>
                </div>
                {client.cuit_cuil && (
                  <div className="md:col-span-2">
                    <label className={`text-sm font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}>
                      CUIT/CUIL
                    </label>
                    <p className={`mt-1 transition-colors duration-300 ${
                      isDark
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>
                      {client.cuit_cuil}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className={`rounded-lg border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b transition-colors duration-300 ${
              isDark
                ? 'border-slate-700'
                : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${
                isDark
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                <HiPhone className="h-5 w-5 text-red-600" />
                Información de Contacto
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.phone && (
                  <div>
                    <label className={`text-sm font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}>
                      Teléfono
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <p className={`transition-colors duration-300 ${
                        isDark
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}>
                        {client.phone}
                      </p>
                      <button
                        onClick={() => openWhatsApp(client.phone)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-green-500/20 text-green-400'
                            : 'hover:bg-green-50 text-green-600'
                        }`}
                        title="Enviar mensaje por WhatsApp"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-.31.08-1.26.33.33-1.22.09-.34-.2-.32a8.188 8.188 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.12.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {client.email && (
                  <div>
                    <label className={`text-sm font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}>
                      Email
                    </label>
                    <div className="mt-1">
                      <a
                        href={`mailto:${client.email}`}
                        className={`transition-colors duration-300 ${
                          isDark
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {client.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dirección */}
          {client.full_address && (
            <div className={`rounded-lg border transition-colors duration-300 ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 border-b transition-colors duration-300 ${
                isDark
                  ? 'border-slate-700'
                  : 'border-gray-200'
              }`}>
                <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  <HiLocationMarker className="h-5 w-5 text-red-600" />
                  Dirección
                </h2>
              </div>
              <div className="p-4">
                <p className={`transition-colors duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {formatAddress(client.full_address)}
                </p>
              </div>
            </div>
          )}

          {/* Notas */}
          {client.notes && (
            <div className={`rounded-lg border transition-colors duration-300 ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 border-b transition-colors duration-300 ${
                isDark
                  ? 'border-slate-700'
                  : 'border-gray-200'
              }`}>
                <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  <HiDocumentText className="h-5 w-5 text-red-600" />
                  Notas
                </h2>
              </div>
              <div className="p-4">
                <p className={`whitespace-pre-wrap transition-colors duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {client.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documentos */}
          <div className={`rounded-lg border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b transition-colors duration-300 ${
              isDark
                ? 'border-slate-700'
                : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${
                isDark
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                <HiDocument className="h-5 w-5 text-red-600" />
                Documentos ({client.documents_count})
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {client.documents.length > 0 ? (
                client.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border transition-colors duration-300 ${
                      isDark
                        ? 'bg-slate-900 border-slate-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                          isDark
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}>
                          {doc.document_type_display}
                        </p>
                        {doc.description && (
                          <p className={`text-xs mt-1 transition-colors duration-300 ${
                            isDark
                              ? 'text-gray-400'
                              : 'text-gray-600'
                          }`}>
                            {doc.description}
                          </p>
                        )}
                        <p className={`text-xs mt-1 transition-colors duration-300 ${
                          isDark
                            ? 'text-gray-500'
                            : 'text-gray-500'
                        }`}>
                          {doc.file_size_formatted} • {formatDate(doc.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadDocument(doc)}
                        className={`ml-2 p-1.5 rounded transition-colors ${
                          isDark
                            ? 'hover:bg-slate-700 text-gray-400'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                        title="Ver documento"
                      >
                        <HiEye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm text-center transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}>
                  No hay documentos cargados
                </p>
              )}
            </div>
          </div>

          {/* Información del Sistema */}
          <div className={`rounded-lg border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b transition-colors duration-300 ${
              isDark
                ? 'border-slate-700'
                : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${
                isDark
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                <HiCalendar className="h-5 w-5 text-red-600" />
                Información del Sistema
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className={`text-sm font-medium transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}>
                  Creado el
                </label>
                <p className={`mt-1 text-sm transition-colors duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {formatDate(client.created_at)}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}>
                  Última actualización
                </label>
                <p className={`mt-1 text-sm transition-colors duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {formatDate(client.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}