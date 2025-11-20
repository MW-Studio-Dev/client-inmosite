// app/dashboard/propiedades/new/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreatePropertyForm } from '@/components/dashboard/properties/PropertyCreateForm';
import { useToast } from '@/components/common/Toast';

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const { showSuccess } = useToast();

  const handleSuccess = () => {
    // Mostrar mensaje de éxito
    showSuccess('¡Propiedad creada exitosamente!');
    
    // Redirigir a la lista de propiedades después de un breve delay
    setTimeout(() => {
      router.push('/dashboard/properties/');
    }, 1500);
    
    // O redirigir a la vista de la propiedad recién creada
    // router.push(`/dashboard/propiedades/${propertyId}`);
  };

  const handleCancel = () => {
    // Redirigir de vuelta a la lista
    router.push('/dashboard/properties/');
  };

  return (
    <div className="space-y-8">
      <CreatePropertyForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}