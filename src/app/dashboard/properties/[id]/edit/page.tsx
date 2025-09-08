'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const handleSave = () => {
    // Implementar l�gica de guardado
    console.log('Saving property:', propertyId);
  };

  const handleCancel = () => {
    router.push(`/dashboard/properties/${propertyId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header con navegaci�n */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/properties/${propertyId}`}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            � Volver a la propiedad
          </Link>
          <div className="text-text-secondary">|</div>
          <h1 className="text-2xl font-bold text-text-primary">Editar Propiedad</h1>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
          >
            =� Guardar Cambios
          </button>
        </div>
      </div>

      {/* Formulario de edici�n */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Informaci�n de la Propiedad
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              T�tulo
            </label>
            <input
              type="text"
              placeholder="Ej: Hermoso departamento en Palermo"
              className="w-full px-4 py-3 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Precio (USD)
            </label>
            <input
              type="number"
              placeholder="150000"
              className="w-full px-4 py-3 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tipo de Operaci�n
            </label>
            <select className="w-full px-4 py-3 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">Seleccionar</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Estado
            </label>
            <select className="w-full px-4 py-3 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
              <option value="reservado">Reservado</option>
              <option value="no_disponible">No Disponible</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Descripci�n
          </label>
          <textarea
            rows={4}
            placeholder="Describe las caracter�sticas principales de la propiedad..."
            className="w-full px-4 py-3 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Ubicaci�n */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          =� Ubicaci�n
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Provincia
            </label>
            <input
              type="text"
              placeholder="Buenos Aires"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Ciudad
            </label>
            <input
              type="text"
              placeholder="CABA"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Barrio
            </label>
            <input
              type="text"
              placeholder="Palermo"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Caracter�sticas */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Caracter�sticas Principales
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Ambientes
            </label>
            <input
              type="number"
              min="1"
              placeholder="3"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Dormitorios
            </label>
            <input
              type="number"
              min="1"
              placeholder="2"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Ba�os
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Superficie (m�)
            </label>
            <input
              type="number"
              min="1"
              placeholder="75"
              className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Aviso informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-custom-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 text-lg">9</div>
          <div>
            <p className="text-blue-800 font-medium mb-1">
              Formulario en desarrollo
            </p>
            <p className="text-blue-700 text-sm">
              Este es un componente b�sico. Se implementar� la funcionalidad completa de edici�n pr�ximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}