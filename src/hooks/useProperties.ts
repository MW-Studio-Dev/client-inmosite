// hooks/useProperties.ts
import { useState, useEffect, useCallback} from 'react';
import axiosInstance from '@/lib/api';
import { Property, PropertyResponse, PropertyFilters } from '@/types/property';
import axios from 'axios';

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalProperties: number;
}

// Tipar la respuesta de error para evitar 'any'
interface ErrorResponse {
  message?: string;
}

interface UsePropertiesParams {
  filters?: PropertyFilters;
  subdomain?: string;
  isFeatured?: boolean;
  isDevelopment?: boolean;
}

export const useProperties = ({
  filters,
  subdomain,
  isFeatured = false,
  isDevelopment = false
}: UsePropertiesParams): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProperties, setTotalProperties] = useState<number>(0);
 


  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params si hay filtros
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const queryString = queryParams.toString();

      // Determinar el endpoint según si son propiedades destacadas o no
      let endpoint: string;
      if (isFeatured) {
        // Endpoint para propiedades destacadas
        endpoint = `/properties/public/${subdomain}/properties/featured/${queryString ? `?${queryString}` : ''}`;
      } else {
        // Endpoint para propiedades normales
        endpoint = `/properties/public/${subdomain}/properties/${queryString ? `?${queryString}` : ''}`;
      }
      if (isDevelopment) {
        endpoint = `/properties/public/${subdomain}/properties/?type=development${queryString ? `&${queryString}` : ''}`;
      }
      const response = await axiosInstance.get<PropertyResponse>(endpoint);

      if (response.data.success) {
        setProperties(response.data.data);
        setTotalProperties(response.data.data.length);
      } else {
        setError(response.data.message || 'Error al obtener las propiedades');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      if (axios.isAxiosError(err)) {
        // Tipar correctamente la respuesta de error
        const errorData = err.response?.data as ErrorResponse | undefined;
        setError(errorData?.message || err.message || 'Error de conexión al servidor');
      } else {
        setError(err instanceof Error ? err.message : 'Error de conexión al servidor');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, subdomain, isFeatured]); // Incluir filters, subdomain y isFeatured como dependencias

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); // Usar fetchProperties como dependencia

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    totalProperties
  };
};