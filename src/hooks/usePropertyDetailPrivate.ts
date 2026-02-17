// hooks/usePropertyDetailPrivate.ts
import { useState, useEffect, useCallback } from 'react';
import { PropertyDetail, PropertyDetailResponse, UsePropertyDetailReturn } from '@/types/property';
import { useAuth } from './useAuth';
import { normalizeFeatures } from '@/utils/normalizeFeatures';

export const usePropertyDetail = ( propertyId: string): UsePropertyDetailReturn => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {tokens} = useAuth();
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_MEDIA;
      const response = await fetch(`${apiUrl}/api/v1/properties/properties/${propertyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.access}`
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

      const normalized = { ...data.data, features: normalizeFeatures(data.data.features) };
      setProperty(normalized);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching property detail:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  }, [ propertyId]);

  useEffect(() => {
    if ( propertyId) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ propertyId]);

  return {
    property,
    loading,
    error,
    refetch
  };
};

export default usePropertyDetail;