// components/PropertyCard.tsx
import React from 'react';
import { Property } from '@/types/property';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  onView?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'vendido':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reservado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOperationTypeColor = (type: string) => {
    return type === 'venta' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-surface rounded-custom-xl border border-surface-border hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Imagen o placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {property.featured_image_url ? (
          <Image
            src={property.featured_image_url}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                🏠
              </div>
              <p className="text-sm text-gray-500">Sin imagen</p>
            </div>
          </div>
        )}
        
        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.is_featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              ⭐ Destacada
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getOperationTypeColor(property.operation_type)}`}>
            {property.operation_type.charAt(0).toUpperCase() + property.operation_type.slice(1)}
          </span>
        </div>

        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusColor(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>

        {/* Contador de imágenes */}
        {property.images_count > 0 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            📷 {property.images_count}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-text-primary line-clamp-2 flex-1 mr-2">
            {property.title}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {property.price_display}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-text-secondary flex items-center gap-2">
            📍 {property.location_display}
          </p>
          <p className="text-text-secondary flex items-center gap-2">
            🏠 {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
          </p>
          <p className="text-text-secondary">
            {property.main_features}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
          <span>👁️ {property.views_count} vistas</span>
          <span>📅 {formatDate(property.created_at)}</span>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(property)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Ver
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(property)}
              className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(property)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};