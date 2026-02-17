import React, { useState, useRef, useEffect } from 'react';
import { useLocationSearch, LocationResult } from '@/hooks/useLocationSearch';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { HiSearch, HiLocationMarker, HiPencil, HiChevronUp } from 'react-icons/hi';

interface FieldMap {
  province?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
  zip_code?: string;
}

interface AddressAutocompleteProps {
  setFieldValue: (field: string, value: string) => void;
  children: React.ReactNode;
  fieldMap?: FieldMap;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  setFieldValue,
  children,
  fieldMap = {}
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { results, loading } = useLocationSearch(query);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  // Default mapping
  const mapping = {
    province: 'province',
    city: 'city',
    neighborhood: 'neighborhood',
    address: 'address',
    zip_code: 'zip_code',
    ...fieldMap
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mostrar dropdown cuando hay resultados
  useEffect(() => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  }, [results]);

  const handleSelect = (location: LocationResult) => {
    const address = location.street_number
      ? `${location.street} ${location.street_number}`
      : location.street;

    if (mapping.province) setFieldValue(mapping.province, location.state || '');
    if (mapping.city) setFieldValue(mapping.city, location.city || '');
    // Only set neighborhood if mapped and value exists (some locations might not have it)
    if (mapping.neighborhood) setFieldValue(mapping.neighborhood, location.neighborhood || location.city || '');
    if (mapping.address) setFieldValue(mapping.address, address || '');
    if (mapping.zip_code) setFieldValue(mapping.zip_code, location.postal_code || '');

    setQuery(location.display_name);
    setIsOpen(false);
    setShowDetails(false);
  };

  return (
    <div>
      {/* Buscador */}
      <div ref={containerRef} className="relative mb-4">
        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
          Buscar dirección
        </label>
        <div className="relative">
          <HiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Av. Santa Fe 3456, Buenos Aires"
            className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-colors ${isDark
                ? 'border-slate-600 bg-slate-900 text-white focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500'
                : 'border-gray-300 bg-white text-gray-900 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-400'
              }`}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Dropdown de resultados */}
        {isOpen && results.length > 0 && (
          <ul className={`absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border shadow-lg ${isDark
              ? 'bg-slate-800 border-slate-600'
              : 'bg-white border-gray-200'
            }`}>
            {results.map((location, index) => (
              <li
                key={index}
                onClick={() => handleSelect(location)}
                className={`flex items-start gap-2 px-3 py-2.5 cursor-pointer text-sm transition-colors ${isDark
                    ? 'hover:bg-slate-700 text-gray-200'
                    : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <HiLocationMarker className={`h-4 w-4 mt-0.5 shrink-0 ${isDark ? 'text-red-400' : 'text-red-500'
                  }`} />
                <span>{location.display_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón para editar manualmente */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-1.5 text-xs font-medium mb-4 transition-colors ${isDark
            ? 'text-gray-400 hover:text-white'
            : 'text-gray-500 hover:text-gray-900'
          }`}
      >
        {showDetails ? (
          <>
            <HiChevronUp className="h-3.5 w-3.5" />
            Ocultar campos
          </>
        ) : (
          <>
            <HiPencil className="h-3.5 w-3.5" />
            Editar dirección manualmente
          </>
        )}
      </button>

      {/* Campos de detalle */}
      {showDetails && children}
    </div>
  );
};

