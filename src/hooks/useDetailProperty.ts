// hooks/useDetailProperty.ts
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/api';
import { PropertyDetail, PropertyDetailResponse, UsePropertyDetailReturn } from '@/types/property';
import axios from 'axios';
import { normalizeFeatures } from '@/utils/normalizeFeatures';

// Tipar la respuesta de error para evitar 'any'
interface ErrorResponse {
  message?: string;
}

export const usePropertyDetail = (propertyId: string): UsePropertyDetailReturn => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    console.log('useDetailProperty - fetchProperty called with propertyId:', propertyId);
    try {
      setLoading(true);
      setError(null);

      const url = `/properties/properties/${propertyId}`;
      console.log('useDetailProperty - Fetching URL:', url);

      const response = await axiosInstance.get<PropertyDetailResponse>(url);

      console.log('useDetailProperty - Response:', response.data);

      if (response.data.success) {
        const normalized = { ...response.data.data, features: normalizeFeatures(response.data.data.features) };
        setProperty(normalized);
        console.log('useDetailProperty - Property set:', normalized);
      } else {
        const errorMsg = response.data.message || 'Error al obtener la propiedad';
        console.error('useDetailProperty - API returned success=false:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('useDetailProperty - Error fetching property:', err);
      if (axios.isAxiosError(err)) {
        // Tipar correctamente la respuesta de error
        const errorData = err.response?.data as ErrorResponse | undefined;
        const errorMsg = errorData?.message || err.message || 'Error de conexión al servidor';
        console.error('useDetailProperty - Axios error:', errorMsg, err.response);
        setError(errorMsg);
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Error de conexión al servidor';
        console.error('useDetailProperty - Unknown error:', errorMsg);
        setError(errorMsg);
      }
    } finally {
      console.log('useDetailProperty - Setting loading to false');
      setLoading(false);
    }
  }, [propertyId]); // Incluir propertyId como dependencia

  useEffect(() => {
    console.log('useDetailProperty - useEffect triggered, propertyId:', propertyId);
    if (propertyId) {
      console.log('useDetailProperty - Calling fetchProperty');
      fetchProperty();
    } else {
      console.log('useDetailProperty - No propertyId, skipping fetch');
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]); // Solo dependemos de propertyId, no de fetchProperty para evitar loops

  return {
    property,
    loading,
    error,
    refetch: fetchProperty
  };
};