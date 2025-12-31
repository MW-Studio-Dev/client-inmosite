// components/dashboard/clients/ClientTable.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HiEye,
  HiPencil,
  HiMail,
  HiPhone,
  HiDocumentText,
  HiChevronLeft,
  HiChevronRight,
  HiDownload,
  HiTrash,
  HiX,
  HiFolderOpen,
  HiLocationMarker,
  HiChatAlt2,
  HiPlus,
  HiUsers,
} from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { Client, ClientDocument } from '@/hooks/useClients';

interface ClientTableProps {
  clients: Client[];
  loading?: boolean;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
    page_size: number;
    start_index: number;
    end_index: number;
  };
  onPageChange?: (page: number) => void;
  onDocumentDelete?: (clientId: string, documentId: string) => void;
}

// Modal para vista rápida de documentos
const DocumentsModal: React.FC<{
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onDocumentDelete: (documentId: string) => void;
}> = ({ client, isOpen, onClose, onDocumentDelete }) => {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleDownload = (doc: ClientDocument) => {
    const link = document.createElement('a');
    link.href = doc.file_url;
    link.download = doc.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (documentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.')) {
      onDocumentDelete(documentId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className={`relative w-full max-w-4xl rounded-lg shadow-xl ${isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
          <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'
            }`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Documentos de {client.full_name}
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${isDark
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-gray-100 text-gray-500'
                }`}
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {client.documents.length === 0 ? (
              <div className="text-center py-8">
                <HiFolderOpen className={`mx-auto h-12 w-12 ${isDark ? 'text-slate-600' : 'text-gray-400'
                  }`} />
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  Este cliente no tiene documentos registrados
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {client.documents.map((document) => (
                  <div key={document.id} className={`p-4 rounded-lg border ${isDark
                    ? 'border-slate-700 bg-slate-900/50'
                    : 'border-gray-200 bg-gray-50'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                          {document.description}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                          {document.document_type_display} • {document.file_size_formatted}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'
                          }`}>
                          {new Date(document.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleDownload(document)}
                          className={`p-2 rounded-lg transition-colors ${isDark
                            ? 'hover:bg-slate-700 text-slate-400'
                            : 'hover:bg-gray-200 text-gray-600'
                            }`}
                          title="Descargar documento"
                        >
                          <HiDownload className="h-4 w-4" />
                        </button>
                        <a
                          href={document.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg transition-colors ${isDark
                            ? 'hover:bg-slate-700 text-slate-400'
                            : 'hover:bg-gray-200 text-gray-600'
                            }`}
                          title="Ver documento"
                        >
                          <HiEye className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(document.id)}
                          className={`p-2 rounded-lg transition-colors ${isDark
                            ? 'hover:bg-red-900/50 text-red-400'
                            : 'hover:bg-red-100 text-red-600'
                            }`}
                          title="Eliminar documento"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ClientTable({ clients, loading, pagination, onPageChange, onDocumentDelete, }: ClientTableProps) {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  // Estado para el modal de documentos
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);

  const handleDocumentsClick = (client: Client) => {
    setSelectedClient(client);
    setIsDocumentsModalOpen(true);
  };

  const handleDocumentsModalClose = () => {
    setIsDocumentsModalOpen(false);
    setSelectedClient(null);
  };

  const handleDocumentDelete = (documentId: string) => {
    if (selectedClient && onDocumentDelete) {
      onDocumentDelete(selectedClient.id, documentId);
      // Actualizar la lista local de clientes
      setSelectedClient({
        ...selectedClient,
        documents: selectedClient.documents.filter(doc => doc.id !== documentId),
        documents_count: selectedClient.documents_count - 1
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO':
        return isDark
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'INACTIVO':
        return isDark
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-red-50 text-red-600 border-red-200';
      default:
        return isDark
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          : 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getClientTypeColor = (clientType: string) => {
    switch (clientType) {
      case 'PROPIETARIO':
        return isDark
          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
          : 'bg-purple-50 text-purple-600 border-purple-200';
      case 'INQUILINO':
        return isDark
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          : 'bg-blue-50 text-blue-600 border-blue-200';
      case 'INVERSOR':
        return isDark
          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'GARANTE':
        return isDark
          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
          : 'bg-orange-50 text-orange-600 border-orange-200';
      case 'OTRO':
        return isDark
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          : 'bg-gray-50 text-gray-600 border-gray-200';
      default:
        return isDark
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          : 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return '';
    // Eliminar todos los caracteres no numéricos excepto +
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned;
  };

  const formatAddress = (address: string | null) => {
    if (!address) return 'Sin ubicación';
    // Limpiar caracteres raros y normalizar el texto
    return address
      .trim() // Eliminar espacios al inicio y final
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
      .replace(/[^\w\s\-\.,°ºª]/g, '') // Eliminar caracteres especiales raros
      .replace(/,,+/g, ',') // Reemplazar comas múltiples por una sola
      .replace(/,+/g, ', '); // Asegurar una sola coma
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'BUSCANDO_ALQUILER':
        return isDark
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          : 'bg-blue-50 text-blue-600 border-blue-200';
      case 'ALQUILANDO':
        return isDark
          ? 'bg-green-500/10 text-green-400 border-green-500/20'
          : 'bg-green-50 text-green-600 border-green-200';
      case 'VENDIENDO':
        return isDark
          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
          : 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return isDark
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          : 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatClientType = (type: string) => {
    switch (type) {
      case 'PROPIETARIO':
        return 'Propietario';
      case 'INQUILINO':
        return 'Inquilino';
      case 'INVERSOR':
        return 'Inversor';
      case 'GARANTE':
        return 'Garante';
      case 'OTRO':
        return 'Otro';
      default:
        return type;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVO':
        return 'Inactivo';
      default:
        return status;
    }
  };

  const formatActivity = (activity: string) => {
    switch (activity) {
      case 'BUSCANDO_ALQUILER':
        return 'Buscando Alquiler';
      case 'ALQUILANDO':
        return 'Alquilando';
      case 'VENDIENDO':
        return 'Vendiendo';
      case 'NINGUNA':
        return 'Ninguna';
      default:
        return activity;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
        ? 'border-slate-700/50 bg-slate-900'
        : 'border-gray-200 bg-white'
        }`}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Cargando clientes...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
      ? 'border-slate-700/50 bg-slate-900'
      : 'border-gray-200 bg-white'
      }`}>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          height: 12px;
          width: 12px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#1e293b' : '#f1f5f9'};
          border-radius: 10px;
          margin: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#475569' : '#cbd5e1'};
          border-radius: 10px;
          border: 2px solid ${isDark ? '#1e293b' : '#f1f5f9'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#64748b' : '#94a3b8'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${isDark ? '#1e293b' : '#f1f5f9'};
        }
      `}</style>
      {/* Vista de tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className={`w-full transition-colors duration-300`}>
          <thead className={isDark ? 'bg-slate-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Cliente
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Contacto
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Ubicación
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Actividad
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Documentos
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Registrado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-500'
                }`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${isDark ? 'divide-slate-700/50' : 'divide-gray-200'
            }`}>
            {clients.map((client) => (
              <tr key={client.id} className={`transition-colors duration-300 ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                }`}>
                <td className={`px-6 py-4 transition-colors duration-300`}>
                  <div>
                    <div className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-gray-900'
                      }`}>
                      {client.full_name || 'Sin nombre'}
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getClientTypeColor(client.client_type)}`}>
                        {formatClientType(client.client_type)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 transition-colors duration-300`}>
                  <div className="space-y-1">
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <HiMail className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                        <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                          {client.email}
                        </span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <HiPhone className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                        <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                          {client.phone}
                        </span>
                        <a
                          href={`https://wa.me/${formatPhoneNumber(client.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1 rounded transition-colors ${isDark
                              ? 'hover:bg-green-900/30 text-green-400'
                              : 'hover:bg-green-100 text-green-600'
                            }`}
                          title="Enviar mensaje por WhatsApp"
                        >
                          <HiChatAlt2 className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm transition-colors duration-300`}>
                  <div className="flex items-center gap-2">
                    <HiLocationMarker className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                    <div className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                      {formatAddress(client.full_address)}
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 transition-colors duration-300`}>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(client.status)}`}>
                    {formatStatus(client.status)}
                  </span>
                </td>
                <td className={`px-6 py-4 transition-colors duration-300`}>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getActivityColor(client.current_activity)}`}>
                    {formatActivity(client.current_activity)}
                  </span>
                </td>
                <td className={`px-6 py-4 transition-colors duration-300`}>
                  <button
                    onClick={() => handleDocumentsClick(client)}
                    className={`flex items-center gap-2 text-sm transition-colors ${client.documents_count > 0
                        ? isDark
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 px-2 py-1 rounded'
                          : 'text-blue-600 hover:text-blue-700 hover:bg-gray-100 px-2 py-1 rounded'
                        : isDark
                          ? 'text-slate-400'
                          : 'text-gray-500'
                      }`}
                    disabled={client.documents_count === 0}
                  >
                    <HiDocumentText className="h-4 w-4" />
                    <span>{client.documents_count}</span>
                    {client.documents_count > 0 && (
                      <span className="text-xs">Ver</span>
                    )}
                  </button>
                </td>
                <td className={`px-6 py-4 text-sm transition-colors duration-300`}>
                  <div className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                    {formatDate(client.created_at)}
                  </div>
                </td>
                <td className={`px-6 py-4 text-right text-sm font-medium transition-colors duration-300`}>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className={`p-1 rounded transition-colors ${isDark
                          ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                      title="Ver detalles"
                    >
                      <HiEye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/clients/${client.id}/edit`}
                      className={`p-1 rounded transition-colors ${isDark
                          ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                      title="Editar cliente"
                    >
                      <HiPencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden divide-y transition-colors duration-300">
        {clients.map((client) => (
          <div key={client.id} className={`p-4 transition-colors duration-300 ${isDark ? 'hover:bg-slate-800/50 divide-slate-700/50' : 'hover:bg-gray-50 divide-gray-200'
            }`}>
            {/* Encabezado de la tarjeta */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'
                  }`}>
                  {client.full_name || 'Sin nombre'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getClientTypeColor(client.client_type)}`}>
                    {formatClientType(client.client_type)}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(client.status)}`}>
                    {formatStatus(client.status)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className={`p-2 rounded-lg transition-colors ${isDark
                      ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  title="Ver detalles"
                >
                  <HiEye className="h-5 w-5" />
                </Link>
                <Link
                  href={`/dashboard/clients/${client.id}/edit`}
                  className={`p-2 rounded-lg transition-colors ${isDark
                      ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  title="Editar cliente"
                >
                  <HiPencil className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-2 mb-3">
              {client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <HiMail className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                  <span className={`truncate ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {client.email}
                  </span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <HiPhone className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                  <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                    {client.phone}
                  </span>
                  <a
                    href={`https://wa.me/${formatPhoneNumber(client.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1 rounded transition-colors ${isDark
                        ? 'hover:bg-green-900/30 text-green-400'
                        : 'hover:bg-green-100 text-green-600'
                      }`}
                    title="Enviar mensaje por WhatsApp"
                  >
                    <HiChatAlt2 className="h-4 w-4" />
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm">
                <HiLocationMarker className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                  {formatAddress(client.full_address)}
                </span>
              </div>
            </div>

            {/* Información adicional */}
            <div className={`grid grid-cols-2 gap-3 pt-3 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  Actividad
                </p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getActivityColor(client.current_activity)}`}>
                  {formatActivity(client.current_activity)}
                </span>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  Documentos
                </p>
                <button
                  onClick={() => handleDocumentsClick(client)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${client.documents_count > 0
                      ? isDark
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-700'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-gray-500'
                    }`}
                  disabled={client.documents_count === 0}
                >
                  <HiDocumentText className="h-4 w-4" />
                  <span>{client.documents_count}</span>
                  {client.documents_count > 0 && (
                    <span className="text-xs">Ver</span>
                  )}
                </button>
              </div>
              <div className="col-span-2">
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  Registrado
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  {formatDate(client.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && clients.length === 0 && (
        <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
          ? 'border-slate-700/50 bg-slate-900'
          : 'border-gray-200 bg-white'
          }`}>
          <div className="flex flex-col items-center py-12">
            <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-gray-100'
              }`}>
              <HiUsers className={`h-12 w-12 transition-colors duration-300 ${isDark ? 'text-slate-600' : 'text-gray-400'
                }`} />
            </div>
            <h3 className={`mb-2 text-xl font-bold transition-colors duration-300 ${isDark ? 'text-slate-200' : 'text-gray-900'
              }`}>
              No se encontraron clientes
            </h3>
            <p className={`mb-6 max-w-md text-center transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>

            </p>
            <Link href="/dashboard/clients/new">
              <button className={`px-4 py-2 rounded-lg border text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex items-center gap-2 ${isDark
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                }`}>
                <HiPlus className="h-4 w-4" />
                Agregar Primer Cliente
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.total_pages > 1 && (
        <div className={`px-6 py-4 border-t transition-colors duration-300 ${isDark ? 'border-slate-700/50 bg-slate-800' : 'border-gray-200 bg-gray-50'
          }`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-700'
              }`}>
              Mostrando {pagination.start_index + 1} a {Math.min(pagination.end_index + 1, pagination.total_count)} de{' '}
              {pagination.total_count} clientes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(pagination.current_page - 1)}
                disabled={!pagination.has_previous}
                className={`p-2 rounded-lg border transition-colors ${!pagination.has_previous
                  ? isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-700 cursor-not-allowed'
                    : 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                  : isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <HiChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.current_page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.current_page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${pagination.current_page === pageNum
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : isDark
                          ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange?.(pagination.current_page + 1)}
                disabled={!pagination.has_next}
                className={`p-2 rounded-lg border transition-colors ${!pagination.has_next
                  ? isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-700 cursor-not-allowed'
                    : 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                  : isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <HiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documentos */}
      {selectedClient && (
        <DocumentsModal
          client={selectedClient}
          isOpen={isDocumentsModalOpen}
          onClose={handleDocumentsModalClose}
          onDocumentDelete={handleDocumentDelete}
        />
      )}
    </div>
  );
}