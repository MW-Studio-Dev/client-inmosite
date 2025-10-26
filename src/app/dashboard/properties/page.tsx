// app/dashboard/propiedades/page.tsx
'use client';

import React, { useState } from 'react';
import { useProperties } from '@/hooks/usPropertiesPrivate';
import { PropertyCard } from '@/components/dashboard/properties/PropertyCard';
import { Property, PropertyFilters } from '@/types/property';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import Link from 'next/link';
import {
  HiPlus,
  HiFilter,
  HiRefresh,
  HiOfficeBuilding,
  HiExclamationCircle,
  HiViewGrid,
  HiViewList,
  HiEye,
  HiPencil,
  HiTrash,
} from 'react-icons/hi';
import { HiHomeModern } from 'react-icons/hi2';

export default function PropiedadesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // Nuevo estado para controlar la vista
  const { company } = useAuth();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { properties, loading, error, refetch, totalProperties } = useProperties({
    filters,
    subdomain: company?.subdomain || ''
  });

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

  // Componente para la vista de tabla
  const PropertiesTable = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propiedad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operación
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publicación
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {property.featured_image_url && property.featured_image_url.length > 0 ? (
                        <img className="h-10 w-10 rounded object-cover" src={property.featured_image_url} alt={property.title} />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                          <HiHomeModern className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {property.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {property.location_display}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{property.property_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.operation_type === 'venta' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.operation_type === 'venta' 
                      ? `$${property.price_usd?.toLocaleString()}` 
                      : `$${property.price_ars?.toLocaleString()}/mes`
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.status === 'disponible' 
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'vendido'
                      ? 'bg-red-100 text-red-800'
                      : property.status === 'reservado'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status === 'disponible' 
                      ? 'Disponible'
                      : property.status === 'vendido'
                      ? 'Vendido'
                      : property.status === 'reservado'
                      ? 'Reservado'
                      : 'No Disponible'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.is_published ? 'Publicada' : 'No Publicada'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(property)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Ver"
                    >
                      <HiEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Editar"
                    >
                      <HiPencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(property)}
                      className="text-gray-400 hover:text-red-600"
                      title="Eliminar"
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <HiOfficeBuilding className="h-6 w-6 text-gray-600 dark:text-white" />
                Propiedades
              </h1>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <HiExclamationCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-base font-semibold text-red-900 mb-2">Error al cargar</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
                >
                  <HiRefresh className="h-4 w-4" />
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {/* Header simplificado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-semibold flex items-center gap-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <HiOfficeBuilding className={`h-6 w-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Propiedades
              </h1>
              <p className={`text-sm mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>{totalProperties} propiedades en total</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Botones para cambiar vista */}
              <div className={`border rounded-lg p-1 flex shadow-sm ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? isDark
                        ? 'bg-gray-600 text-white shadow-sm'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title="Vista de tarjetas"
                >
                  <HiViewGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    viewMode === 'table'
                      ? isDark
                        ? 'bg-gray-600 text-white shadow-sm'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title="Vista de tabla"
                >
                  <HiViewList className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  showFilters
                    ? isDark
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md'
                    : isDark
                      ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <HiFilter className="h-4 w-4" />
                Filtros
              </button>
              <Link
                href='/dashboard/properties/new'
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg ${
                  isDark
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                }`}
              >
                <HiPlus className="h-4 w-4" />
                Nueva
              </Link>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className={`rounded-xl border p-4 shadow-sm ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Operación
                  </label>
                  <select
                    value={filters.operation_type || ''}
                    onChange={(e) => handleFilterChange({
                      operation_type: e.target.value as 'venta' | 'alquiler' | undefined || undefined
                    })}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Todas</option>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Estado
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange({
                      status: e.target.value as 'disponible' | 'vendido' | 'reservado' | 'no_disponible' | undefined || undefined
                    })}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Todos</option>
                    <option value="disponible">Disponible</option>
                    <option value="vendido">Vendido</option>
                    <option value="reservado">Reservado</option>
                    <option value="no_disponible">No Disponible</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Publicación
                  </label>
                  <select
                    value={filters.is_published === undefined ? '' : filters.is_published.toString()}
                    onChange={(e) => handleFilterChange({
                      is_published: e.target.value === '' ? undefined : e.target.value === 'true'
                    })}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Todas</option>
                    <option value="true">Publicadas</option>
                    <option value="false">No Publicadas</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className={`w-full px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 hover:shadow-sm ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <HiRefresh className="h-4 w-4" />
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={`rounded-lg border p-12 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`inline-block animate-spin rounded-full h-8 w-8 border-2 mb-4 ${
                  isDark
                    ? 'border-gray-700 border-t-gray-300'
                    : 'border-gray-200 border-t-gray-900'
                }`}></div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Cargando propiedades...</p>
              </div>
            </div>
          )}

          {/* Lista de Propiedades - Vista condicional */}
          {!loading && properties.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              ) : (
                <PropertiesTable />
              )}
            </>
          )}

          {/* Estado Vacío */}
          {!loading && properties.length === 0 && (
            <div className={`rounded-lg border p-12 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <HiOfficeBuilding className={`h-8 w-8 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {Object.keys(filters).length > 0
                    ? 'No se encontraron propiedades'
                    : 'Sin propiedades'
                  }
                </h3>
                <p className={`text-sm mb-6 max-w-md mx-auto ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {Object.keys(filters).length > 0
                    ? 'Intenta ajustar los filtros de búsqueda.'
                    : 'Comienza agregando tu primera propiedad.'
                  }
                </p>
                {Object.keys(filters).length > 0 ? (
                  <button
                    onClick={clearFilters}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                      isDark
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    <HiRefresh className="h-4 w-4" />
                    Limpiar Filtros
                  </button>
                ) : (
                  <Link
                    href='/dashboard/properties/new'
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                      isDark
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <HiPlus className="h-4 w-4" />
                    Agregar Propiedad
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}