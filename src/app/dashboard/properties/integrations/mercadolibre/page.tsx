'use client';

import React, { useState } from 'react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { useProperties } from '@/hooks/usPropertiesPrivate';
import { Property, PropertyFilters } from '@/types/property';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/api';
import { useToast } from '@/components/common/Toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import {
  HiPhoto,
  HiMapPin,
  HiShoppingCart,
  HiExclamationCircle,
  HiArrowPath,
  HiFunnel,
  HiSquares2X2,
  HiListBullet,
  HiBuildingOffice
} from 'react-icons/hi2';

interface PublishResponse {
  success: boolean;
  message: string;
  data: {
    sync_id: number;
    task_id: string;
    property_id: string;
    status: string;
    listing_type: string;
    message: string;
    check_status_url: string;
  };
}

export default function MercadoLibrePropertyPublishPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { showSuccess, showError, showInfo } = useToast();
  const { company } = useAuth();

  // States for properties list
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [listingType, setListingType] = useState<'silver' | 'gold' | 'premium'>('silver');

  const { properties, loading, refetch, totalProperties } = useProperties({
    filters,
    subdomain: company?.subdomain || ''
  });

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handlePublishClick = (property: Property) => {
    setSelectedProperty(property);
    setListingType('silver');
    setShowPublishModal(true);
  };

  const handlePublish = async () => {
    if (!selectedProperty) return;

    setPublishing(true);
    try {
      const response = await axiosInstance.post<PublishResponse>(
        '/integrations/mercadolibre/sync/publish_property/',
        {
          property_id: selectedProperty.id,
          meli_listing_type: listingType
        }
      );

      if (response.data.success) {
        showSuccess(response.data.message);
        showInfo('La publicación se ha creado exitosamente. Recuerda que debes pagar por la difusión para que sea visible públicamente.');

        setShowPublishModal(false);
        setSelectedProperty(null);

        // Opcional: consultar el estado después de unos segundos
        setTimeout(() => {
          checkPublicationStatus(response.data.data.check_status_url);
        }, 3000);
      } else {
        showError(response.data.message || 'Error al iniciar la publicación');
      }
    } catch (error: any) {
      console.error('Error publishing property:', error);
      const errorMsg = error.response?.data?.message || 'Error al publicar la propiedad en MercadoLibre';
      showError(errorMsg);
    } finally {
      setPublishing(false);
    }
  };

  const checkPublicationStatus = async (checkUrl: string) => {
    try {
      const response = await axiosInstance.get(checkUrl);
      if (response.data.data.status === 'completed') {
        showSuccess('¡Propiedad publicada exitosamente en MercadoLibre!');
      } else if (response.data.data.status === 'failed') {
        showError('La publicación falló. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error checking publication status:', error);
    }
  };

  // Componente para la vista de tabla con publicación
  const PropertiesTable = () => (
    <div className={`rounded-xl border overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Propiedad
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Tipo
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Operación
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Precio
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Estado
              </th>
              <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDark ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
          }`}>
            {properties.map((property) => (
              <tr key={property.id} className={`hover:opacity-80 transition-opacity ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {property.featured_image_url ? (
                        <img className="h-10 w-10 rounded object-cover" src={property.featured_image_url} alt={property.title} />
                      ) : (
                        <div className={`h-10 w-10 rounded flex items-center justify-center ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <HiBuildingOffice className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium truncate max-w-xs ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {property.title}
                      </div>
                      <div className={`text-sm truncate max-w-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {property.location_display}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>{property.property_type}</div>
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
                  <div className={`text-sm ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {property.price_display}
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handlePublishClick(property)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                        isDark
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      }`}
                    >
                      <HiShoppingCart className="h-3 w-3" />
                      Publicar
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

  // Componente de tarjeta de propiedad para modo grid
  const PropertyCard = ({ property }: { property: Property }) => (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-lg ${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {property.featured_image_url ? (
          <img
            src={property.featured_image_url}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <HiPhoto className={`h-12 w-12 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            property.operation_type === 'venta'
              ? 'bg-blue-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            property.status === 'disponible'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {property.status === 'disponible' ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <h3 className={`font-semibold mb-1 line-clamp-1 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-sm mb-3">
          <HiMapPin className={`h-3 w-3 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <span className={`line-clamp-1 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {property.location_display}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`text-xs p-2 rounded ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              {property.price_display}
            </p>
            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Precio</p>
          </div>
          <div className={`text-xs p-2 rounded ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              {property.surface_total}m²
            </p>
            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Superficie</p>
          </div>
        </div>

        <button
          onClick={() => handlePublishClick(property)}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isDark
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          <HiShoppingCart className="h-4 w-4" />
          Publicar en MercadoLibre
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-2 ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            <HiShoppingCart className={`h-8 w-8 ${
              isDark ? 'text-yellow-400' : 'text-yellow-600'
            }`} />
            Publicar en MercadoLibre
          </h1>
          <p className={`mt-2 text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Selecciona una propiedad para publicar en MercadoLibre
          </p>
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>{totalProperties} propiedades disponibles</p>
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
                    ? 'bg-yellow-600 text-white shadow-sm'
                    : 'bg-yellow-500 text-white shadow-sm'
                  : isDark
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Vista de tarjetas"
            >
              <HiSquares2X2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'table'
                  ? isDark
                    ? 'bg-yellow-600 text-white shadow-sm'
                    : 'bg-yellow-500 text-white shadow-sm'
                  : isDark
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Vista de tabla"
            >
              <HiListBullet className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              showFilters
                ? isDark
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-yellow-500 text-white shadow-md'
                : isDark
                  ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <HiFunnel className="h-4 w-4" />
            Filtros
          </button>

          <button
            onClick={() => refetch()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <HiArrowPath className="h-4 w-4" />
            Actualizar
          </button>
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
                  operation_type: e.target.value === '' ? undefined : e.target.value as 'venta' | 'alquiler'
                })}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
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
                  status: e.target.value === '' ? undefined : e.target.value as 'disponible' | 'vendido' | 'reservado' | 'no_disponible'
                })}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
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
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
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
                <HiArrowPath className="h-4 w-4" />
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className={`rounded-xl border p-4 ${
        isDark
          ? 'bg-yellow-500/10 border-yellow-500/20'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          <HiExclamationCircle className={`h-5 w-5 mt-0.5 ${
            isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <div>
            <h4 className={`text-sm font-semibold mb-1 ${
              isDark ? 'text-yellow-400' : 'text-yellow-700'
            }`}>
              Importante sobre la publicación
            </h4>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-yellow-300' : 'text-yellow-600'
            }`}>
              Al publicar una propiedad en MercadoLibre, se creará la publicación pero no será visible públicamente hasta que pagues por la difusión correspondiente.
              El proceso de publicación puede tardar unos minutos en completarse.
            </p>
          </div>
        </div>
      </div>

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
                ? 'border-gray-700 border-t-yellow-400'
                : 'border-gray-200 border-t-yellow-500'
            }`}></div>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Cargando propiedades...</p>
          </div>
        </div>
      )}

      {/* Properties List */}
      {!loading && properties.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <PropertiesTable />
          )}
        </>
      )}

      {/* Empty State */}
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
              <HiBuildingOffice className={`h-8 w-8 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {Object.keys(filters).length > 0
                ? 'No se encontraron propiedades'
                : 'Sin propiedades disponibles'
              }
            </h3>
            <p className={`text-sm mb-6 max-w-md mx-auto ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {Object.keys(filters).length > 0
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'No hay propiedades para publicar en MercadoLibre.'
              }
            </p>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                  isDark
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                <HiArrowPath className="h-4 w-4" />
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {selectedProperty && (
        <ConfirmModal
          isOpen={showPublishModal}
          title={`Publicar "${selectedProperty.title}" en MercadoLibre`}
          message={""}
          confirmText={publishing ? "Publicando..." : "Publicar"}
          cancelText="Cancelar"
          onConfirm={handlePublish}
          onCancel={() => {
            setShowPublishModal(false);
            setSelectedProperty(null);
          }}
          type="info"
          disabled={publishing}
        >
          <div className="space-y-4">
            {/* Property Preview */}
            <div className={`rounded-lg p-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                {selectedProperty.featured_image_url ? (
                  <img
                    src={selectedProperty.featured_image_url}
                    alt={selectedProperty.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded flex items-center justify-center ${
                    isDark ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <HiBuildingOffice className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {selectedProperty.title}
                  </h4>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedProperty.location_display}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {selectedProperty.price_display}
                  </p>
                </div>
              </div>
            </div>

            {/* Listing Type Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Tipo de Publicación
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'silver', label: 'Silver', desc: 'Básico' },
                  { value: 'gold', label: 'Gold', desc: 'Destacado' },
                  { value: 'premium', label: 'Premium', desc: 'Premium' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setListingType(type.value as any)}
                    disabled={publishing}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 ${
                      listingType === type.value
                        ? isDark
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-yellow-400 bg-yellow-50'
                        : isDark
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className={`font-semibold text-xs ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {type.label}
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {type.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className={`rounded-lg p-3 ${
              isDark
                ? 'bg-yellow-500/10 border border-yellow-500/20'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-start gap-2">
                <HiExclamationCircle className={`h-4 w-4 mt-0.5 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-yellow-300' : 'text-yellow-600'
                }`}>
                  La publicación se creará pero no será visible hasta que pagues por la difusión.
                </p>
              </div>
            </div>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}