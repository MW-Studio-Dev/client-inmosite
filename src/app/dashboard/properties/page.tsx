// app/dashboard/propiedades/page.tsx
'use client';

import React, { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/dashboard/properties/PropertyCard';
import { Property, PropertyFilters } from '@/types/property';
import Link from 'next/link';

export default function PropiedadesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { properties, loading, error, refetch, totalProperties } = useProperties(filters);

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleEdit = (property: Property) => {
    console.log('Editar propiedad:', property.id);
    // Aquí implementarías la lógica para editar
  };

  const handleDelete = (property: Property) => {
    console.log('Eliminar propiedad:', property.id);
    // Aquí implementarías la lógica para eliminar
  };

  const handleView = (property: Property) => {
    return window.open(`/dashboard/properties/${property.id}`, '_blank');
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">Propiedades</h2>
            <p className="mt-2 text-lg text-text-secondary">
              Gestiona tu catálogo de propiedades
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-custom-xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar propiedades</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Propiedades</h2>
          <p className="mt-2 text-lg text-text-secondary">
            Gestiona tu catálogo de propiedades ({totalProperties} propiedades)
          </p>
        </div>
        <Link
          href='/dashboard/properties/new'
          className="bg-gradient-primary text-white px-6 py-3 rounded-custom-lg font-semibold hover:scale-105 transition-all duration-300">
            + Nueva Propiedad
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tipo de Operación
            </label>
            <select
              value={filters.operation_type || ''}
              onChange={(e) => handleFilterChange({ 
                operation_type: e.target.value as 'venta' | 'alquiler' | undefined || undefined 
              })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ 
                status: e.target.value as 'disponible' | 'vendido' | 'reservado' | 'no_disponible' | undefined || undefined 
              })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
              <option value="reservado">Reservado</option>
              <option value="no_disponible">No Disponible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Publicación
            </label>
            <select
              value={filters.is_published === undefined ? '' : filters.is_published.toString()}
              onChange={(e) => handleFilterChange({ 
                is_published: e.target.value === '' ? undefined : e.target.value === 'true' 
              })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todas</option>
              <option value="true">Publicadas</option>
              <option value="false">No Publicadas</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-surface rounded-custom-xl p-12 border border-surface-border">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-text-secondary">Cargando propiedades...</p>
          </div>
        </div>
      )}

      {/* Lista de Propiedades */}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Estado Vacío */}
      {!loading && properties.length === 0 && (
        <div className="bg-surface rounded-custom-xl p-12 border border-surface-border">
          <div className="text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No hay propiedades
            </h3>
            <p className="text-text-secondary mb-6">
              {Object.keys(filters).length > 0 
                ? 'No se encontraron propiedades con los filtros aplicados'
                : 'Aún no has agregado ninguna propiedad a tu catálogo'
              }
            </p>
            {Object.keys(filters).length > 0 ? (
              <button
                onClick={clearFilters}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Limpiar Filtros
              </button>
            ) : (
              <button className="bg-gradient-primary text-white px-6 py-3 rounded-custom-lg font-semibold hover:scale-105 transition-all duration-300">
                + Agregar Primera Propiedad
              </button>
            )}
          </div>
        </div>
      )}

      {/* Botón de actualizar (flotante) */}
      {!loading && (
        <button
          onClick={() => refetch()}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          title="Actualizar propiedades"
        >
          🔄
        </button>
      )}
    </div>
  );
}