// app/dashboard/properties/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePropertyDetail } from '@/hooks/usePropertyDetailPrivate';
import Image from 'next/image';
import {
  HiArrowLeft,
  HiPencil,
  HiTrash,
  HiLocationMarker,
  HiHome,
  HiCurrencyDollar,
  HiTag,
  HiCalendar,
  HiEye,
  HiExclamationCircle,
  HiRefresh,
  HiCog,
  HiGlobe
} from 'react-icons/hi';
import { HiHomeModern } from 'react-icons/hi2';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

export default function PropertyDetailPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  console.log('PropertyDetailPage - propertyId:', propertyId);

  const { property, loading, error, refetch } = usePropertyDetail(propertyId);

  console.log('PropertyDetailPage - State:', { property, loading, error });

  const handleEdit = () => {
    router.push(`/dashboard/properties/update/${propertyId}`);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      console.log('Eliminar propiedad:', propertyId);
      // Aquí implementarías la lógica para eliminar
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return isDark
          ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'vendido':
        return isDark
          ? 'bg-slate-900/20 text-slate-400 border-slate-700'
          : 'bg-slate-100 text-slate-700 border-slate-300';
      case 'reservado':
        return isDark
          ? 'bg-amber-900/20 text-amber-400 border-amber-800'
          : 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return isDark
          ? 'bg-gray-900/20 text-gray-400 border-gray-700'
          : 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getOperationTypeBadge = (type: string) => {
    return type === 'venta'
      ? (isDark
          ? 'bg-blue-900/20 text-blue-400 border-blue-800'
          : 'bg-blue-50 text-blue-700 border-blue-200')
      : (isDark
          ? 'bg-purple-900/20 text-purple-400 border-purple-800'
          : 'bg-purple-50 text-purple-700 border-purple-200');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <Link
              href="/dashboard/properties"
              className={`inline-flex items-center gap-2 text-sm transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HiArrowLeft className="h-4 w-4" />
              Volver a propiedades
            </Link>

            <div className={`rounded-lg border p-12 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`inline-block animate-spin rounded-full h-8 w-8 border-2 mb-4 ${
                  isDark
                    ? 'border-gray-600 border-t-gray-100'
                    : 'border-gray-200 border-t-gray-900'
                }`}></div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cargando propiedad...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <Link
              href="/dashboard/properties"
              className={`inline-flex items-center gap-2 text-sm transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HiArrowLeft className="h-4 w-4" />
              Volver a propiedades
            </Link>

            <div className={`rounded-lg border p-8 ${
              isDark
                ? 'bg-red-900/20 border-red-800'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  isDark
                    ? 'bg-red-900/40'
                    : 'bg-red-100'
                }`}>
                  <HiExclamationCircle className={`h-6 w-6 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
                <h3 className={`text-base font-semibold mb-2 ${
                  isDark ? 'text-red-400' : 'text-red-900'
                }`}>
                  Error al cargar la propiedad
                </h3>
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-red-400' : 'text-red-700'
                }`}>
                  {error}
                </p>
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

  if (!property) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <Link
              href="/dashboard/properties"
              className={`inline-flex items-center gap-2 text-sm transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HiArrowLeft className="h-4 w-4" />
              Volver a propiedades
            </Link>

            <div className={`rounded-lg border p-12 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <HiHomeModern className={`h-8 w-8 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Propiedad no encontrada
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  La propiedad que buscas no existe o ha sido eliminada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {/* Header con navegación */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/properties"
                className={`inline-flex items-center gap-2 text-sm transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:text-gray-100'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiArrowLeft className="h-4 w-4" />
                Volver
              </Link>
              <div className={`h-4 w-px ${
                isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
              <h1 className={`text-2xl font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Detalle de Propiedad
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <HiPencil className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <HiTrash className="h-4 w-4" />
                Eliminar
              </button>
            </div>
          </div>

          {/* Imagen y Info Principal */}
          <div className={`rounded-lg border overflow-hidden ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Imagen */}
              <div className={`relative h-80 lg:h-auto ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {property.featured_image_url ? (
                  <Image
                    src={property.featured_image_url}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiHomeModern className={`h-24 w-24 ${
                      isDark ? 'text-gray-500' : 'text-gray-300'
                    }`} />
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="p-6">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-medium border ${getOperationTypeBadge(property.operation_type)}`}>
                    {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
                  </span>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-medium border ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                  {property.is_featured && (
                    <span className={`text-[10px] px-2 py-1 rounded-md font-medium border ${
                      isDark
                        ? 'bg-amber-900/20 text-amber-400 border-amber-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      Destacada
                    </span>
                  )}
                  {property.is_published && (
                    <span className={`text-[10px] px-2 py-1 rounded-md font-medium border ${
                      isDark
                        ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      Publicada
                    </span>
                  )}
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {property.title}
                </h2>

                <div className={`flex items-center gap-2 text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <HiLocationMarker className="h-4 w-4 flex-shrink-0" />
                  <span>{property.location_display}</span>
                </div>

                <div className={`text-3xl font-bold mb-4 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {property.price_display}
                </div>

                <div className="space-y-2 mb-4">
                  <div className={`flex items-center gap-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <HiTag className="h-4 w-4" />
                    <span>Código: {property.internal_code}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <HiEye className="h-4 w-4" />
                    <span>{property.views_count} visualizaciones</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <HiHomeModern className="h-4 w-4" />
                    <span>{property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</span>
                  </div>
                </div>

                {property.description && (
                  <div className={`rounded-md p-4 ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Descripción
                    </h3>
                    <p className={`text-sm leading-relaxed line-clamp-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Características Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Características Físicas */}
            <div className={`rounded-lg border p-6 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <HiHome className={`h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Características
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Ambientes:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.rooms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Dormitorios:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.bedrooms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Baños:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.bathrooms}</span>
                </div>
                {property.half_bathrooms > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Toilettes:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.half_bathrooms}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Superficie Total:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.surface_total} m²</span>
                </div>
                {property.surface_covered && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Superficie Cubierta:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.surface_covered} m²</span>
                  </div>
                )}
                {property.garage_spaces > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cocheras:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.garage_spaces}</span>
                  </div>
                )}
                {property.storage_spaces > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Bauleras:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.storage_spaces}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ubicación y Detalles */}
            <div className={`rounded-lg border p-6 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <HiLocationMarker className={`h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Ubicación y Detalles
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Provincia:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.province}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Ciudad:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Barrio:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.neighborhood}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Dirección:</span>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.address}</span>
                </div>
                {property.floor && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Piso:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.floor}</span>
                  </div>
                )}
                {property.unit && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Unidad:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.unit}</span>
                  </div>
                )}
                {property.age_years > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Antigüedad:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.age_years} años</span>
                  </div>
                )}
                {property.orientation && (
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Orientación:</span>
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{property.orientation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información de Precios */}
          <div className={`rounded-lg border p-6 ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              <HiCurrencyDollar className={`h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`} />
              Información de Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`text-center p-4 rounded-md border ${
                isDark
                  ? 'bg-blue-900/20 border-blue-800'
                  : 'bg-blue-50 border-blue-100'
              }`}>
                <div className={`text-xl font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  USD {property.price_usd ? Number(property.price_usd).toLocaleString() : '0'}
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>Precio en dólares</div>
              </div>
              <div className={`text-center p-4 rounded-md border ${
                isDark
                  ? 'bg-emerald-900/20 border-emerald-800'
                  : 'bg-emerald-50 border-emerald-100'
              }`}>
                <div className={`text-xl font-bold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  $ {property.price_ars ? Number(property.price_ars).toLocaleString() : '0'}
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>Precio en pesos</div>
              </div>
              <div className={`text-center p-4 rounded-md border ${
                isDark
                  ? 'bg-purple-900/20 border-purple-800'
                  : 'bg-purple-50 border-purple-100'
              }`}>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-purple-400' : 'text-purple-700'
                }`}>
                  USD {property.price_per_m2_usd ? property.price_per_m2_usd.toLocaleString() : '0'}
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>Por m² (USD)</div>
              </div>
              <div className={`text-center p-4 rounded-md border ${
                isDark
                  ? 'bg-orange-900/20 border-orange-800'
                  : 'bg-orange-50 border-orange-100'
              }`}>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-orange-400' : 'text-orange-700'
                }`}>
                  $ {property.price_per_m2_ars ? property.price_per_m2_ars.toLocaleString() : '0'}
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-orange-400' : 'text-orange-600'
                }`}>Por m² (ARS)</div>
              </div>
            </div>
            {property.expenses_ars && (
              <div className={`mt-4 p-3 rounded-md border ${
                isDark
                  ? 'bg-amber-900/20 border-amber-800'
                  : 'bg-amber-50 border-amber-100'
              }`}>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-amber-800'
                }`}>
                  Expensas: $ {Number(property.expenses_ars).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Características Adicionales - Adaptada para modo oscuro */}
          {property.features.length > 0 && (
            <div className={`rounded-lg border p-6 ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-base font-semibold mb-4 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Características Adicionales
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                      isDark
                        ? 'bg-blue-900/20 text-blue-400 border-blue-800'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEO y Metadatos - Adaptado para modo oscuro */}
          <div className={`rounded-lg border p-6 ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              SEO y Metadatos
            </h3>
            <div className="space-y-3">
              <div>
                <span className={`block text-xs mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Meta Título:</span>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>{property.meta_title}</span>
              </div>
              <div>
                <span className={`block text-xs mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Meta Descripción:</span>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>{property.meta_description}</span>
              </div>
              <div className={`grid grid-cols-2 gap-4 pt-2 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="mt-2">
                  <span className={`block text-xs mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Fecha de Creación:</span>
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <HiCalendar className={`h-3.5 w-3.5 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    {property.created_at ? new Date(property.created_at).toLocaleString('es-AR') : 'N/A'}
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`block text-xs mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Última Actualización:</span>
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <HiCalendar className={`h-3.5 w-3.5 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    {property.updated_at ? new Date(property.updated_at).toLocaleString('es-AR') : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Integraciones - Adaptada para modo oscuro */}
          <div className={`rounded-lg border p-6 ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              <HiGlobe className={`h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`} />
              Integraciones con Plataformas Inmobiliarias
            </h3>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Conecta esta propiedad con las principales plataformas inmobiliarias para aumentar su visibilidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Tokko */}
              <div className={`border rounded-lg p-4 transition-colors ${
                isDark
                  ? 'border-gray-700 hover:border-blue-600'
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isDark ? 'bg-blue-900/40' : 'bg-blue-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>T</span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>Tokko Broker</h4>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>CRM Inmobiliario</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>Próximamente</span>
                </div>
              </div>

              {/* MercadoLibre */}
              <div className={`border rounded-lg p-4 transition-colors ${
                isDark
                  ? 'border-gray-700 hover:border-yellow-600'
                  : 'border-gray-200 hover:border-yellow-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isDark ? 'bg-yellow-900/40' : 'bg-yellow-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>ML</span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>MercadoLibre</h4>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Marketplace</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>Próximamente</span>
                </div>
              </div>

              {/* Zonaprop */}
              <div className={`border rounded-lg p-4 transition-colors ${
                isDark
                  ? 'border-gray-700 hover:border-red-600'
                  : 'border-gray-200 hover:border-red-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isDark ? 'bg-red-900/40' : 'bg-red-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-red-400' : 'text-red-600'
                      }`}>Z</span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>Zonaprop</h4>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Portal Inmobiliario</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>Próximamente</span>
                </div>
              </div>

              {/* Argenprop */}
              <div className={`border rounded-lg p-4 transition-colors ${
                isDark
                  ? 'border-gray-700 hover:border-green-600'
                  : 'border-gray-200 hover:border-green-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isDark ? 'bg-green-900/40' : 'bg-green-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>A</span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>Argenprop</h4>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Portal Inmobiliario</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>Próximamente</span>
                </div>
              </div>

              {/* Properati */}
              <div className={`border rounded-lg p-4 transition-colors ${
                isDark
                  ? 'border-gray-700 hover:border-purple-600'
                  : 'border-gray-200 hover:border-purple-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isDark ? 'bg-purple-900/40' : 'bg-purple-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`}>P</span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>Properati</h4>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Portal Inmobiliario</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>Próximamente</span>
                </div>
              </div>

              {/* Más integraciones */}
              <div className={`border border-dashed rounded-lg p-4 flex items-center justify-center ${
                isDark
                  ? 'border-gray-600'
                  : 'border-gray-300'
              }`}>
                <div className="text-center">
                  <HiCog className={`h-6 w-6 mx-auto mb-1 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>Más integraciones próximamente</p>
                </div>
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-md border ${
              isDark
                ? 'bg-blue-900/20 border-blue-800'
                : 'bg-blue-50 border-blue-100'
            }`}>
              <p className={`text-xs ${
                isDark ? 'text-blue-400' : 'text-blue-700'
              }`}>
                <strong>Nota:</strong> Las integraciones permitirán sincronizar automáticamente tus propiedades con las principales plataformas del mercado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}