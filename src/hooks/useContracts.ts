// ============================================
// Hook para Contracts (Contratos)
// ============================================

import { useState, useCallback } from 'react';
import { contractService } from '@/services/contractService';
import { Contrato, CreateContractData, ContractStatus } from '@/types/rent-contracts';
import { toast } from 'sonner';

interface UseContractsOptions {
    autoFetch?: boolean;
    initialFilters?: {
        status?: ContractStatus;
        tenant?: string;
        rental?: string;
    };
}

export function useContracts(options: UseContractsOptions = {}) {
    const { autoFetch = false, initialFilters } = options;

    const [contracts, setContracts] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContracts = useCallback(async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.list(params);
            if (response.success) {
                setContracts(response.data.results);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar contratos';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createContract = useCallback(async (data: CreateContractData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.create(data);
            if (response.success) {
                toast.success(response.message || 'Contrato creado exitosamente');
                await fetchContracts(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear contrato';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchContracts, initialFilters]);

    const updateContract = useCallback(async (id: string, data: Partial<Contrato>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.update(id, data);
            if (response.success) {
                toast.success(response.message || 'Contrato actualizado exitosamente');
                await fetchContracts(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar contrato';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchContracts, initialFilters]);

    const generateContract = useCallback(async (id: string, regenerate = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.generate(id, regenerate);
            if (response.success) {
                toast.success(response.message || 'Contenido generado exitosamente');
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al generar contenido';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signContract = useCallback(async (id: string, signing_date?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.sign(id, signing_date);
            if (response.success) {
                toast.success(response.message || 'Contrato firmado exitosamente');
                await fetchContracts(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al firmar contrato';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchContracts, initialFilters]);

    const activateContract = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.activate(id);
            if (response.success) {
                toast.success(response.message || 'Contrato activado exitosamente');
                await fetchContracts(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al activar contrato';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchContracts, initialFilters]);

    const cancelContract = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.cancel(id);
            if (response.success) {
                toast.success(response.message || 'Contrato cancelado');
                await fetchContracts(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cancelar contrato';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchContracts, initialFilters]);

    const previewContract = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.preview(id);
            if (response.success) {
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar vista previa';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteContract = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractService.delete(id);
            if (response.success) {
                toast.success('Contrato eliminado exitosamente');
                await fetchContracts(initialFilters);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al eliminar contrato';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchContracts, initialFilters]);

    return {
        contracts,
        loading,
        error,
        fetchContracts,
        createContract,
        updateContract,
        deleteContract,
        generateContract,
        signContract,
        activateContract,
        cancelContract,
        previewContract,
    };
}
