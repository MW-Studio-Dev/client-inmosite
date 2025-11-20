// hooks/useClientOptions.ts
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api';

interface ClientOption {
  value: string;
  label: string;
  description: string;
}

interface ClientOptions {
  types: ClientOption[];
  statuses: ClientOption[];
  activities: ClientOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClientOptions = (): ClientOptions => {
  const [types, setTypes] = useState<ClientOption[]>([]);
  const [statuses, setStatuses] = useState<ClientOption[]>([]);
  const [activities, setActivities] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Realizar todas las peticiones en paralelo
      const [typesResponse, statusesResponse, activitiesResponse] = await Promise.all([
        axiosInstance.get('/clients/client_types/'),
        axiosInstance.get('/clients/client_statuses/'),
        axiosInstance.get('/clients/client_activities/')
      ]);

      // Extraer datos de las respuestas
      if (typesResponse.data?.success) {
        setTypes(typesResponse.data.data || []);
      }

      if (statusesResponse.data?.success) {
        setStatuses(statusesResponse.data.data || []);
      }

      if (activitiesResponse.data?.success) {
        setActivities(activitiesResponse.data.data || []);
      }

    } catch (err: any) {
      console.error('Error al obtener opciones de clientes:', err);
      setError(err?.response?.data?.message || 'Error al cargar las opciones');

      // En caso de error, establecer valores por defecto
      setTypes([
        { value: 'PROPIETARIO', label: 'Propietario', description: 'Cliente que posee propiedades para alquilar o vender' },
        { value: 'INQUILINO', label: 'Inquilino', description: 'Cliente que busca propiedades en alquiler' }
      ]);

      setStatuses([
        { value: 'ACTIVO', label: 'Activo', description: 'Cliente actualmente activo en el sistema' },
        { value: 'INACTIVO', label: 'Inactivo', description: 'Cliente temporalmente inactivo' }
      ]);

      setActivities([
        { value: 'ALQUILANDO', label: 'Alquilando', description: 'Cliente actualmente alquilando una propiedad' },
        { value: 'VENDIENDO', label: 'Vendiendo', description: 'Cliente vendiendo una propiedad' },
        { value: 'BUSCANDO_ALQUILER', label: 'Buscando Alquiler', description: 'Cliente buscando propiedad en alquiler' },
        { value: 'BUSCANDO_INVERTIR', label: 'Buscando Invertir', description: 'Cliente buscando propiedades para inversión' },
        { value: 'NINGUNA', label: 'Ninguna', description: 'Sin actividad actual definida' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return {
    types,
    statuses,
    activities,
    loading,
    error,
    refetch: fetchOptions
  };
};