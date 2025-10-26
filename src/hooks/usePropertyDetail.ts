// hooks/usePropertyDetail.ts
import { useState, useEffect, useCallback } from 'react';
import { PropertyDetail, PropertyDetailResponse, UsePropertyDetailReturn } from '@/types/property';

export const usePropertyDetail = (subdomain: string, propertyId: string): UsePropertyDetailReturn => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use environment variable for API URL
      const apiUrl = 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/v1/properties/public/${subdomain}/properties/${propertyId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('propiedad', response);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: PropertyDetailResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error al obtener la propiedad');
      }

      setProperty(data.data);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching property detail:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  }, [subdomain, propertyId]);

  useEffect(() => {
    if (subdomain && propertyId) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain, propertyId]);

  return {
    property,
    loading,
    error,
    refetch
  };
};

export default usePropertyDetail;