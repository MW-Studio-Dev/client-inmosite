// app/dashboard/clients/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ClientForm from '@/components/dashboard/clients/ClientForm';
import { useToast } from '@/components/common/Toast';
import axiosInstance from '@/lib/api';
import { HiExclamationTriangle, HiArrowLeft } from 'react-icons/hi2';

interface ClientData {
  id: string;
  client_type: string;
  status: string;
  current_activity: string;
  first_name: string;
  last_name: string;
  cuit_cuil: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  notes: string;
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
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const { showError } = useToast();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = params?.id as string;

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

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await axiosInstance.patch(`/clients/${clientId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        const message = response.data.message || 'Cliente actualizado exitosamente';

        // Si hay cambios en documentos, mostrarlos
        if (response.data?.extra_data?.documents_changes) {
          const changes = response.data.extra_data.documents_changes;
          const changeMessages = [];

          if (changes.deleted_documents?.length > 0) {
            changeMessages.push(`${changes.deleted_documents.length} eliminado(s)`);
          }
          if (changes.added_documents?.length > 0) {
            changeMessages.push(`${changes.added_documents.length} agregado(s)`);
          }

          if (changeMessages.length > 0) {
            showError(`Cliente actualizado (${changeMessages.join(', ')})`);
          }
        }

        // Redirigir después de un breve delay
        setTimeout(() => {
          router.push('/dashboard/clients/');
        }, 1500);

        return response.data;
      } else {
        throw new Error('No se pudo actualizar el cliente');
      }
    } catch (error: any) {
      console.error('Error al actualizar cliente:', error);

      if (error?.response?.data) {
        // Si el backend devuelve errores de validación, propagarlos
        throw error;
      } else {
        showError('Error al actualizar el cliente');
        throw new Error('Error al actualizar el cliente');
      }
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/clients/');
  };

  const handleRetry = () => {
    fetchClient();
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-md w-full p-6 rounded-lg border ${
          document.documentElement.classList.contains('dark')
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <HiExclamationTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className={`text-lg font-semibold mb-2 ${
              document.documentElement.classList.contains('dark')
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              Error al cargar el cliente
            </h2>
            <p className={`text-sm mb-6 ${
              document.documentElement.classList.contains('dark')
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
                onClick={handleCancel}
                className={`px-4 py-2 rounded-md transition-colors text-sm ${
                  document.documentElement.classList.contains('dark')
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
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className={`p-2 rounded-lg transition-colors ${
            document.documentElement.classList.contains('dark')
              ? 'hover:bg-slate-700 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Volver a clientes"
        >
          <HiArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Cliente
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Modifica la información de {client.first_name} {client.last_name}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClientForm
        initialData={client}
        initialDocuments={client.documents || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
}