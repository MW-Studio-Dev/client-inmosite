// app/dashboard/propiedades/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePropertyDetail } from '@/hooks/useDetailProperty';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const { property, loading, error, refetch } = usePropertyDetail(propertyId);

  const handleEdit = () => {
    router.push(`/dashboard/propiedades/${propertyId}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      console.log('Eliminar propiedad:', propertyId);
      // Aquí implementarías la lógica para eliminar
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      disponible: 'bg-green-100 text-green-800 border-green-200',
      vendido: 'bg-red-100 text-red-800 border-red-200',
      reservado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      no_disponible: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return badges[status as keyof typeof badges] || badges.disponible;
  };

  const getOperationTypeBadge = (type: string) => {
    const badges = {
      venta: 'bg-blue-100 text-blue-800 border-blue-200',
      alquiler: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[type as keyof typeof badges] || badges.venta;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/propiedades"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Volver a propiedades
          </Link>
        </div>
        
        <div className="bg-surface rounded-custom-xl p-12 border border-surface-border">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-text-secondary">Cargando propiedad...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/propiedades"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Volver a propiedades
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-custom-xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar la propiedad</h3>
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

  if (!property) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/propiedades"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Volver a propiedades
          </Link>
        </div>

        <div className="bg-surface rounded-custom-xl p-12 border border-surface-border">
          <div className="text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Propiedad no encontrada</h3>
            <p className="text-text-secondary">La propiedad que buscas no existe o ha sido eliminada.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/propiedades"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Volver a propiedades
          </Link>
          <div className="text-text-secondary">|</div>
          <h1 className="text-2xl font-bold text-text-primary">Detalle de Propiedad</h1>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            ✏️ Editar
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {/* Información Principal */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <div className="flex flex-wrap gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1).replace('_', ' ')}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getOperationTypeBadge(property.operation_type)}`}>
            {property.operation_type.charAt(0).toUpperCase() + property.operation_type.slice(1)}
          </span>
          {property.is_featured && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              ⭐ Destacada
            </span>
          )}
          {property.is_published && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              📢 Publicada
            </span>
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-text-primary mb-2">{property.title}</h2>
        <p className="text-lg text-text-secondary mb-4">{property.location_display}</p>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="text-3xl font-bold text-primary">{property.price_display}</div>
          <div className="text-text-secondary">
            <div className="text-sm">Código: {property.internal_code}</div>
            <div className="text-sm">{property.views_count} visualizaciones</div>
          </div>
        </div>

        {property.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Descripción</h3>
            <p className="text-text-secondary leading-relaxed">{property.description}</p>
          </div>
        )}
      </div>

      {/* Características Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Características Físicas */}
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">🏠 Características</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Ambientes:</span>
              <span className="font-medium">{property.rooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Dormitorios:</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Baños:</span>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            {property.half_bathrooms > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Toilettes:</span>
                <span className="font-medium">{property.half_bathrooms}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Superficie Total:</span>
              <span className="font-medium">{property.surface_total} m²</span>
            </div>
            {property.surface_covered && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Superficie Cubierta:</span>
                <span className="font-medium">{property.surface_covered} m²</span>
              </div>
            )}
            {property.garage_spaces > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Cocheras:</span>
                <span className="font-medium">{property.garage_spaces}</span>
              </div>
            )}
            {property.storage_spaces > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Bauleras:</span>
                <span className="font-medium">{property.storage_spaces}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ubicación y Detalles */}
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">📍 Ubicación y Detalles</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Provincia:</span>
              <span className="font-medium">{property.province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Ciudad:</span>
              <span className="font-medium">{property.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Barrio:</span>
              <span className="font-medium">{property.neighborhood}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Dirección:</span>
              <span className="font-medium">{property.address}</span>
            </div>
            {property.floor && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Piso:</span>
                <span className="font-medium">{property.floor}</span>
              </div>
            )}
            {property.unit && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Unidad:</span>
                <span className="font-medium">{property.unit}</span>
              </div>
            )}
            {property.age_years > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Antigüedad:</span>
                <span className="font-medium">{property.age_years} años</span>
              </div>
            )}
            {property.orientation && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Orientación:</span>
                <span className="font-medium">{property.orientation}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de Precios */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h3 className="text-xl font-semibold text-text-primary mb-4">💰 Información de Precios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">USD {Number(property.price_usd).toLocaleString()}</div>
            <div className="text-sm text-blue-500">Precio en dólares</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$ {Number(property.price_ars).toLocaleString()}</div>
            <div className="text-sm text-green-500">Precio en pesos</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">USD {property.price_per_m2_usd.toLocaleString()}</div>
            <div className="text-sm text-purple-500">Por m² (USD)</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">$ {property.price_per_m2_ars.toLocaleString()}</div>
            <div className="text-sm text-orange-500">Por m² (ARS)</div>
          </div>
        </div>
        {property.expenses_ars && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-800 font-medium">Expensas: $ {Number(property.expenses_ars).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Características Adicionales */}
      {property.features.length > 0 && (
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">✨ Características Adicionales</h3>
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SEO y Metadatos */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h3 className="text-xl font-semibold text-text-primary mb-4">🔍 SEO y Metadatos</h3>
        <div className="space-y-3">
          <div>
            <span className="text-text-secondary block text-sm mb-1">Meta Título:</span>
            <span className="font-medium">{property.meta_title}</span>
          </div>
          <div>
            <span className="text-text-secondary block text-sm mb-1">Meta Descripción:</span>
            <span className="font-medium">{property.meta_description}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-text-secondary block text-sm mb-1">Fecha de Creación:</span>
              <span className="font-medium">{new Date(property.created_at).toLocaleString('es-AR')}</span>
            </div>
            <div>
              <span className="text-text-secondary block text-sm mb-1">Última Actualización:</span>
              <span className="font-medium">{new Date(property.updated_at).toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}