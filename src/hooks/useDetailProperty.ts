// hooks/usePropertyDetail.ts
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/api';
import { PropertyDetail, PropertyDetailResponse, UsePropertyDetailReturn } from '@/types/property';
import axios from 'axios';

// Tipar la respuesta de error para evitar 'any'
interface ErrorResponse {
  message?: string;
}

export const usePropertyDetail = (propertyId: string): UsePropertyDetailReturn => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<PropertyDetailResponse>(
        `/properties/properties/${propertyId}`
      );

      if (response.data.success) {
        setProperty(response.data.data);
      } else {
        setError(response.data.message || 'Error al obtener la propiedad');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
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
  }, [propertyId]); // Incluir propertyId como dependencia

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, fetchProperty]); // Incluir fetchProperty como dependencia

  return {
    property,
    loading,
    error,
    refetch: fetchProperty
  };
};