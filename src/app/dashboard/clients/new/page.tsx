// app/dashboard/clientes/nuevo/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ClientForm from '@/components/dashboard/clients/ClientForm';
import { useToast } from '@/components/common/Toast';
import { axiosInstanceMultipart } from '@/lib/api';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

export default function NuevoClientePage() {
  const router = useRouter();
  const { showSuccess } = useToast();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const handleSuccess = () => {
    // Mostrar mensaje de éxito
    showSuccess('¡Cliente creado exitosamente!');

    // Redirigir a la lista de clientes después de un breve delay
    setTimeout(() => {
      router.push('/dashboard/clients/');
    }, 1500);
  };

  const handleCancel = () => {
    // Redirigir de vuelta a la lista
    router.push('/dashboard/clients/');
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Crear cliente con documentos usando FormData
      const response = await axiosInstanceMultipart.post('/clients/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        handleSuccess();
        return response.data;
      } else {
        throw new Error('No se pudo crear el cliente');
      }
    } catch (error: any) {
      console.error('Error al crear cliente:', error);

      // Si el backend devuelve errores de validación, propagarlos para que el formulario los muestre
      if (error?.response?.data) {
        throw error;
      } else {
        throw new Error('Error al crear el cliente');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Nuevo Cliente
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Completa la información para agregar un nuevo cliente al sistema
        </p>
      </div>

      <ClientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
}