// components/PropertyCard.tsx
'use client'

import React from 'react';
import { Property } from '@/types/property';
import Image from 'next/image';
import {
  HiLocationMarker,
  HiHome,
  HiEye,
  HiPencil,
  HiTrash,
  HiExternalLink,
  HiPrinter
} from 'react-icons/hi';
import { HiHomeModern } from 'react-icons/hi2';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

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
  const {tokens} = useAuth();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-emerald-500/90 text-white border-emerald-400';
      case 'vendido':
        return 'bg-slate-500/90 text-white border-slate-400';
      case 'reservado':
        return 'bg-amber-500/90 text-white border-amber-400';
      default:
        return 'bg-gray-500/90 text-white border-gray-400';
    }
  };

  const getOperationTypeBadge = (type: string) => {
    return type === 'venta'
      ? 'bg-red-600/90 text-white border-red-500'
      : 'bg-purple-600/90 text-white border-purple-500';
  };

  const handlePrintPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const pdfUrl = `${apiUrl}/v1/properties/properties/${property.id}/generate_pdf`;
    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens?.access}`,
        'Content-Type': 'application/pdf'
      }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className={`group rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full ${
      isDark
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
        : 'bg-white border-gray-200 hover:border-red-400'
    }`}>
      {/* Imagen */}
      <div className={`relative h-32 overflow-hidden flex-shrink-0 ${
        isDark
          ? 'bg-gradient-to-br from-gray-700 to-gray-800'
          : 'bg-gradient-to-br from-gray-100 to-gray-200'
      }`}>
        {property.featured_image_url ? (
          <Image
            src={property.featured_image_url}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiHome className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Badges - Reorganizados */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold backdrop-blur-md ${getOperationTypeBadge(property.operation_type)} shadow-md`}>
            {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
          </span>
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold backdrop-blur-md ${getStatusColor(property.status)} shadow-md`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Título */}
        <h3 className={`text-xs font-bold line-clamp-1 mb-1.5 leading-tight ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {property.title}
        </h3>

        {/* Precio */}
        <div className="mb-2">
          <p className={`text-base font-bold ${
              isDark ? 'text-white' : 'text-gray-600'
            }`}>
            {property.price_display}
          </p>
        </div>

        {/* Información de ubicación y tipo */}
        <div className={`space-y-1 mb-2 pb-2 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className="flex items-start gap-1">
            <HiLocationMarker className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
            <span className={`text-[10px] line-clamp-1 flex-1 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>{property.location_display}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiHomeModern className={`h-3 w-3 flex-shrink-0 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-[10px] ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>{property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</span>
          </div>
        </div>

        {/* Acciones - Ajustadas */}
        <div className="grid grid-cols-2 gap-1 mt-auto">
          {/* Botón Ficha */}
          <button
            onClick={handlePrintPDF}
            className={`col-span-2 py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all duration-200 flex items-center justify-center gap-1 border ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
            title="Imprimir ficha"
          >
            <HiPrinter className="h-3 w-3" />
            Ficha
          </button>

          {/* Botón Ver */}
          {onView && (
            <button
              onClick={() => onView(property)}
              className={`py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all duration-200 flex items-center justify-center gap-1 border ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <HiEye className="h-3 w-3" />
              Ver
            </button>
          )}

          {/* Botón Editar */}
          {onEdit && (
            <button
              onClick={() => onEdit(property)}
              className={`py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-sm hover:shadow-md ${
                isDark
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
              }`}
            >
              <HiPencil className="h-3 w-3" />
              Editar
            </button>
          )}

          {/* Botón Eliminar */}
          {onDelete && (
            <button
              onClick={() => onDelete(property)}
              className={`col-span-2 py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all duration-200 flex items-center justify-center gap-1 border ${
                isDark
                  ? 'bg-gray-700 hover:bg-red-900/30 text-red-400 border-gray-600 hover:border-red-800'
                  : 'bg-white hover:bg-red-50 text-red-600 border-red-300 hover:border-red-400'
              }`}
            >
              <HiTrash className="h-3 w-3" />
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};