// ============================================
// Hook para Contract Templates
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { contractTemplateService } from '@/services/contractTemplateService';
import { ContractTemplate, CreateContractTemplateData } from '@/types/rent-contracts';
import { toast } from 'sonner';

interface UseContractTemplatesOptions {
    autoFetch?: boolean;
    fetchDefault?: boolean;
}

export function useContractTemplates(options: UseContractTemplatesOptions = {}) {
    const { autoFetch = true, fetchDefault = true } = options;

    const [templates, setTemplates] = useState<ContractTemplate[]>([]);
    const [defaultTemplate, setDefaultTemplate] = useState<ContractTemplate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplates = useCallback(async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractTemplateService.list(params);
            if (response.success) {
                setTemplates(response.data.results);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar plantillas';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDefaultTemplate = useCallback(async () => {
        try {
            const response = await contractTemplateService.getDefault();
            if (response.success) {
                setDefaultTemplate(response.data);
            }
        } catch (err: any) {
            console.warn('No se encontró plantilla por defecto');
            setDefaultTemplate(null);
        }
    }, []);

    const createTemplate = useCallback(async (data: CreateContractTemplateData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractTemplateService.create(data);
            if (response.success) {
                toast.success(response.message || 'Plantilla creada exitosamente');
                await fetchTemplates();
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear plantilla';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTemplates]);

    const updateTemplate = useCallback(async (id: string, data: Partial<ContractTemplate>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractTemplateService.update(id, data);
            if (response.success) {
                toast.success(response.message || 'Plantilla actualizada exitosamente');
                await fetchTemplates();
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar plantilla';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTemplates]);

    const deleteTemplate = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await contractTemplateService.delete(id);
            toast.success('Plantilla eliminada exitosamente');
            await fetchTemplates();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al eliminar plantilla';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTemplates]);

    const setAsDefault = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await contractTemplateService.setDefault(id);
            toast.success('Plantilla establecida como predeterminada');
            await fetchTemplates();
            await fetchDefaultTemplate();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al establecer plantilla predeterminada';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTemplates, fetchDefaultTemplate]);

    useEffect(() => {
        if (autoFetch) {
            fetchTemplates();
        }
        if (fetchDefault) {
            fetchDefaultTemplate();
        }
    }, [autoFetch, fetchDefault, fetchTemplates, fetchDefaultTemplate]);

    return {
        templates,
        defaultTemplate,
        loading,
        error,
        fetchTemplates,
        fetchDefaultTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        setAsDefault,
    };
}
