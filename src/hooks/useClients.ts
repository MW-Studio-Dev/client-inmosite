// hooks/useClients.ts
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api';

export interface ClientDocument {
  id: string;
  client: string;
  document_type: string;
  document_type_display: string;
  file: string;
  file_url: string;
  file_name: string;
  description: string;
  file_size: number;
  file_size_formatted: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  full_address: string | null;
  client_type: string;
  client_type_display: string;
  status: string;
  status_display: string;
  current_activity: string;
  current_activity_display: string;
  email: string | null;
  phone: string | null;
  cuit_cuil: string | null;
  photo: string | null;
  documents_count: number;
  documents: ClientDocument[];
  created_at: string;
  updated_at: string;
}

export interface ClientStats {
  overview: {
    total_clients: number;
    active_clients: number;
    inactive_clients: number;
    active_percentage: number;
  };
  by_type: Record<string, {
    label: string;
    count: number;
    percentage: number;
  }>;
  by_activity: Record<string, {
    label: string;
    count: number;
    percentage: number;
  }>;
  investors: {
    total_investors: number;
    with_properties: number;
    seeking_investments: number;
    actively_investing: number;
    available_for_investment: number;
  };
  growth: {
    last_30_days: number;
    previous_30_days: number;
    growth_trend_percentage: number;
    growth_trend_label: string;
  };
}

export interface ClientResponse {
  success: boolean;
  message: string;
  data: Client[];
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
      available: string[];
    };
  };
}

export interface UseClientsOptions {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    clientType?: string;
    autoFetch?: boolean;
  }

// Función para obtener estadísticas de clientes
export const fetchClientStats = async (): Promise<ClientStats> => {
  try {
    const response = await axiosInstance.get('/clients/statistics/');

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error al cargar las estadísticas');
    }
  } catch (err: any) {
    console.error('Error fetching client stats:', err);
    throw new Error(err?.response?.data?.message || 'Error al cargar las estadísticas de clientes');
  }
};

export const useClients = (options: UseClientsOptions = {}) => {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    status = '',
    clientType = '',
    autoFetch = true
  } = options;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchClients = async (params: UseClientsOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      // Agregar parámetros de paginación
      queryParams.append('page', (params.page || page).toString());
      queryParams.append('page_size', (params.pageSize || pageSize).toString());

      // Agregar filtros si se proporcionan
      if (params.search || search) {
        queryParams.append('search', params.search || search);
      }
      if (params.status || status) {
        queryParams.append('status', params.status || status);
      }
      if (params.clientType || clientType) {
        queryParams.append('client_type', params.clientType || clientType);
      }

      const response = await axiosInstance.get<ClientResponse>(`/clients/?${queryParams.toString()}`);

      if (response.data.success) {
        setClients(response.data.data);
        setPagination(response.data.meta.pagination);
      } else {
        setError(response.data.message || 'Error al cargar los clientes');
      }
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err?.response?.data?.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (autoFetch) {
      fetchClients();
    }
  }, [page, pageSize, search, status, clientType, autoFetch]);

  return {
    clients,
    loading,
    error,
    pagination,
    fetchClients,
    refetch: () => fetchClients()
  };
};