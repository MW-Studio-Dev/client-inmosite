// hooks/useProperties.ts
'use client';

import { useState, useEffect } from 'react';

export interface Property {
  id: string;
  title: string;
  price_display: string;
  location_display: string;
  bedrooms: number;
  bathrooms: number;
  surface_total: string;
  featured_image_url: string | null;
  featured_thumbnail_url: string | null;
  operation_type: string;
  property_type: string;
  main_features: string;
  created_at: string;
}

interface PropertiesResponse {
  success: boolean;
  message: string;
  data: Property[];
  meta: {
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      has_next: boolean;
      has_previous: boolean;
      next_page: number | null;
      previous_page: number | null;
      page_size: number;
      start_index: number;
      end_index: number;
    };
    filters: {
      applied: Record<string, any>;
      available: any[];
    };
  };
  timestamp: string;
  request_id: string;
}

interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProperties = (subdomain: string, baseUrl?: string): UsePropertiesResult => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar baseUrl si se proporciona, sino usar una URL por defecto
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_MEDIA;
      const url = `${apiBaseUrl}/api/v1/properties/public/${subdomain}/properties/featured/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Agregar cache y configuraciones adicionales según necesites
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: PropertiesResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las propiedades');
      }

      setProperties(data.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subdomain) {
      fetchProperties();
    }
  }, [subdomain]);

  const refetch = async () => {
    await fetchProperties();
  };

  return {
    properties,
    loading,
    error,
    refetch,
  };
};