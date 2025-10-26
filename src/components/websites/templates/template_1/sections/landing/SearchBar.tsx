'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TemplateConfig, SearchData } from '../../types';

interface PropertySearchBarProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const PropertySearchBar: React.FC<PropertySearchBarProps> = ({ config, adaptiveColors }) => {
  const router = useRouter();
  const [searchData, setSearchData] = useState<SearchData>({
    type: 'comprar',
    propertyType: 'casa',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (searchData.type) queryParams.set('type', searchData.type);
    if (searchData.propertyType) queryParams.set('propertyType', searchData.propertyType);
    if (searchData.location.trim()) queryParams.set('location', searchData.location.trim());
    if (searchData.minPrice) queryParams.set('minPrice', searchData.minPrice);
    if (searchData.maxPrice) queryParams.set('maxPrice', searchData.maxPrice);

    const queryString = queryParams.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';
    
    router.push(url);
  };

  return (
    <div 
      className="backdrop-blur-md rounded-xl p-6 shadow-2xl max-w-4xl mx-auto mt-8 border border-white/20"
      style={{ 
        backgroundColor: config.colors.surface + '90',
        backdropFilter: 'blur(12px)'
      }}
    >
      <style jsx>{`
        select option:hover,
        select option:focus,
        select option:checked {
          background-color: ${config.colors.primary}30 !important;
          color: ${config.colors.text} !important;
        }
        
        select:hover {
          background-color: ${config.colors.background}CC !important;
        }
        
        input:hover {
          background-color: ${config.colors.background}CC !important;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tipo de operación */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.medium
            }}
          >
            Quiero
          </label>
          <select 
            value={searchData.type}
            onChange={(e) => setSearchData({...searchData, type: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent backdrop-blur-sm transition-colors duration-200"
            style={{ 
              borderColor: config.colors.textLight + '30',
              backgroundColor: config.colors.background + '80',
              color: config.colors.text
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${config.colors.primary}50`}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <option value="comprar">Comprar</option>
            <option value="alquilar">Alquilar</option>
          </select>
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.medium
            }}
          >
            Tipo
          </label>
          <select 
            value={searchData.propertyType}
            onChange={(e) => setSearchData({...searchData, propertyType: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent backdrop-blur-sm transition-colors duration-200"
            style={{ 
              borderColor: config.colors.textLight + '30',
              backgroundColor: config.colors.background + '80',
              color: config.colors.text
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${config.colors.primary}50`}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            {config.sections.propertyTypes.lands.enabled && (
              <option value="terreno">Terreno</option>
            )}
            {config.sections.propertyTypes.offices.enabled && (
              <option value="oficina">Oficina</option>
            )}
            {config.sections.propertyTypes.fields.enabled && (
              <option value="campo">Campo</option>
            )}
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.medium
            }}
          >
            Ubicación
          </label>
          <input 
            type="text"
            placeholder="Zona, barrio..."
            value={searchData.location}
            onChange={(e) => setSearchData({...searchData, location: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent backdrop-blur-sm transition-colors duration-200"
            style={{ 
              borderColor: config.colors.textLight + '30',
              backgroundColor: config.colors.background + '80',
              color: config.colors.text
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${config.colors.primary}50`}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          />
        </div>

        {/* Botón buscar */}
        <div className="flex items-end">
          <button 
            onClick={handleSearch}
            className="w-full px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
            style={{ 
              backgroundColor: config.colors.primary,
              color: adaptiveColors.primaryText,
              fontWeight: config.typography.fontWeight.semibold,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = config.colors.primary;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = config.colors.primary;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchBar;