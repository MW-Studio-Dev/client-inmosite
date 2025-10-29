'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyUpdateForm } from '@/components/dashboard/properties/PropertyUpdateForm';
import { useToast } from '@/components/common/Toast';
import { usePropertyDetail } from '@/hooks/usePropertyDetailPrivate';
import { HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

export default function PropertyUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const { showSuccess } = useToast();

  const { property, loading, error } = usePropertyDetail(propertyId);

  const handleSuccess = () => {
    showSuccess('Propiedad actualizada exitosamente!');

    setTimeout(() => {
      router.push(`/dashboard/properties/${propertyId}`);
    }, 1500);
  };

  const handleCancel = () => {
    router.push(`/dashboard/properties/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/properties/${propertyId}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </Link>
          <div className="text-gray-400">|</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Propiedad
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/properties"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
            <span>Volver a propiedades</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Error al cargar la propiedad
            </h2>
            <p className="text-red-700 dark:text-red-400">
              {error || 'No se pudo encontrar la propiedad solicitada.'}
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/properties"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <HiArrowLeft className="h-4 w-4" />
                Volver a propiedades
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/properties/${propertyId}`}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </Link>
        <div className="text-gray-400">|</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Editar Propiedad
        </h1>
      </div>

      <PropertyUpdateForm
        property={property}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
