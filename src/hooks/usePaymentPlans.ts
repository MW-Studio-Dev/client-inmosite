// ============================================
// Hook para Payment Plans (Planes de Pago)
// ============================================

import { useState, useCallback } from 'react';
import { paymentPlanService } from '@/services/paymentPlanService';
import { PlanDePagos, PaymentPlanStatus } from '@/types/rent-contracts';
import { toast } from 'sonner';

interface UsePaymentPlansOptions {
    autoFetch?: boolean;
    contractId?: string;
}

export function usePaymentPlans(options: UsePaymentPlansOptions = {}) {
    const { autoFetch = false, contractId } = options;

    const [plans, setPlans] = useState<PlanDePagos[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = useCallback(async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentPlanService.list(params);
            if (response.success) {
                setPlans(response.data.results);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar planes de pago';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPlan = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentPlanService.create(data);
            if (response.success) {
                toast.success(response.message || 'Plan de pago creado exitosamente');
                await fetchPlans(contractId ? { contrato: contractId } : undefined);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear plan de pago';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPlans, contractId]);

    const updatePlan = useCallback(async (id: string, data: Partial<PlanDePagos>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentPlanService.update(id, data);
            if (response.success) {
                toast.success(response.message || 'Plan de pago actualizado exitosamente');
                await fetchPlans(contractId ? { contrato: contractId } : undefined);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar plan de pago';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPlans, contractId]);

    const deletePlan = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await paymentPlanService.delete(id);
            toast.success('Plan de pago eliminado exitosamente');
            await fetchPlans(contractId ? { contrato: contractId } : undefined);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al eliminar plan de pago';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPlans, contractId]);

    const suspendPlan = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentPlanService.suspend(id);
            if (response.success) {
                toast.success('Plan de pago suspendido');
                await fetchPlans(contractId ? { contrato: contractId } : undefined);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al suspender plan';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPlans, contractId]);

    const reactivatePlan = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentPlanService.reactivate(id);
            if (response.success) {
                toast.success('Plan de pago reactivado');
                await fetchPlans(contractId ? { contrato: contractId } : undefined);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al reactivar plan';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPlans, contractId]);

    return {
        plans,
        loading,
        error,
        fetchPlans,
        createPlan,
        updatePlan,
        deletePlan,
        suspendPlan,
        reactivatePlan,
    };
}
