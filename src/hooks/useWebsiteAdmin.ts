// hooks/useWebsiteAdmin.ts
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { WebsiteConfig, WebsiteTemplate, PublishRequest } from '@/types/website';

interface UseWebsiteAdminReturn {
  config: WebsiteConfig | null;
  templates: WebsiteTemplate[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  saveConfig: (data: Partial<WebsiteConfig>) => Promise<void>;
  publishWebsite: (data: PublishRequest) => Promise<void>;
  unpublishWebsite: () => Promise<void>;
}

export const useWebsiteAdmin = (): UseWebsiteAdminReturn => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener la configuración actual
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/websites/configs/');

      // La API devuelve un array, tomamos la primera configuración
      const configs = response.data.results || response.data;
      if (Array.isArray(configs) && configs.length > 0) {
        setConfig(configs[0]);
      } else if (!Array.isArray(configs)) {
        setConfig(configs);
      }
    } catch (err: any) {
      console.error('Error fetching website config:', err);
      if (err.response?.status === 404) {
        // No existe configuración aún, esto es normal
        setConfig(null);
      } else {
        setError(err.response?.data?.detail || 'Error al cargar la configuración');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener templates disponibles
  const fetchTemplates = useCallback(async () => {
    try {
      const response = await api.get('/websites/templates/');
      setTemplates(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.response?.data?.detail || 'Error al cargar los templates');
    }
  }, []);

  // Guardar o actualizar configuración
  const saveConfig = useCallback(async (data: Partial<WebsiteConfig>) => {
    try {
      setSaving(true);
      setError(null);

      let response;

      if (config?.id) {
        // Actualizar configuración existente
        response = await api.patch(`/websites/configs/${config.id}/`, data);
      } else {
        // Crear nueva configuración
        response = await api.post('/websites/configs/', data);
      }

      setConfig(response.data);
    } catch (err: any) {
      console.error('Error saving website config:', err);
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          'Error al guardar la configuración';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [config?.id]);

  // Publicar website
  const publishWebsite = useCallback(async (data: PublishRequest) => {
    if (!config?.id) {
      throw new Error('Debes guardar la configuración antes de publicar');
    }

    try {
      setSaving(true);
      setError(null);

      const response = await api.post(`/websites/configs/${config.id}/publish/`, data);
      setConfig(response.data);
    } catch (err: any) {
      console.error('Error publishing website:', err);
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          'Error al publicar el website';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [config?.id]);

  // Despublicar website
  const unpublishWebsite = useCallback(async () => {
    if (!config?.id) return;

    try {
      setSaving(true);
      setError(null);

      const response = await api.post(`/websites/configs/${config.id}/publish/`, {
        is_published: false
      });
      setConfig(response.data);
    } catch (err: any) {
      console.error('Error unpublishing website:', err);
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          'Error al despublicar el website';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [config?.id]);

  // Cargar configuración al montar
  useEffect(() => {
    fetchConfig();
    fetchTemplates();
  }, [fetchConfig, fetchTemplates]);

  return {
    config,
    templates,
    loading,
    saving,
    error,
    fetchConfig,
    fetchTemplates,
    saveConfig,
    publishWebsite,
    unpublishWebsite,
  };
};
