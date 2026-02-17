// ============================================
// Hook para Installments (Cuotas)
// ============================================

import { useState, useCallback } from 'react';
import { installmentService } from '@/services/installmentService';
import { Cuota, PayInstallmentData, InstallmentStatus } from '@/types/rent-contracts';
import { toast } from 'sonner';

interface UseInstallmentsOptions {
    autoFetch?: boolean;
    planId?: string;
}

export function useInstallments(options: UseInstallmentsOptions = {}) {
    const { autoFetch = false, planId } = options;

    const [installments, setInstallments] = useState<Cuota[]>([]);
    const [overdueInstallments, setOverdueInstallments] = useState<Cuota[]>([]);
    const [upcomingInstallments, setUpcomingInstallments] = useState<Cuota[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInstallments = useCallback(async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await installmentService.list(params);
            if (response.success) {
                setInstallments(response.data.results);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar cuotas';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOverdue = useCallback(async () => {
        try {
            const response = await installmentService.getOverdue(planId);
            if (response.success) {
                setOverdueInstallments(response.data.results);
            }
        } catch (err: any) {
            console.error('Error al cargar cuotas vencidas:', err);
        }
    }, [planId]);

    const fetchUpcoming = useCallback(async (days = 7) => {
        try {
            const response = await installmentService.getUpcoming(planId, days);
            if (response.success) {
                setUpcomingInstallments(response.data.results);
            }
        } catch (err: any) {
            console.error('Error al cargar próximas cuotas:', err);
        }
    }, [planId]);

    const updateInstallment = useCallback(async (id: string, data: Partial<Cuota>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await installmentService.update(id, data);
            if (response.success) {
                toast.success('Cuota actualizada exitosamente');
                await fetchInstallments(planId ? { plan_pagos: planId } : undefined);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar cuota';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInstallments, planId]);

    const payInstallment = useCallback(async (id: string, data: PayInstallmentData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await installmentService.pay(id, data);
            if (response.success) {
                toast.success(response.message || 'Pago registrado exitosamente');
                await fetchInstallments(planId ? { plan_pagos: planId } : undefined);
                await fetchOverdue();
                await fetchUpcoming();
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al registrar pago';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInstallments, fetchOverdue, fetchUpcoming, planId]);

    const markOverdue = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await installmentService.markOverdue(id);
            if (response.success) {
                toast.success('Cuota marcada como vencida');
                await fetchInstallments(planId ? { plan_pagos: planId } : undefined);
                await fetchOverdue();
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al marcar cuota como vencida';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInstallments, fetchOverdue, planId]);

    const downloadReceipt = useCallback(async (id: string) => {
        try {
            const blob = await installmentService.downloadReceipt(id);

            // Crear un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `comprobante-cuota-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Comprobante descargado');
        } catch (err: any) {
            toast.error('Error al descargar comprobante');
            throw err;
        }
    }, []);

    return {
        installments,
        overdueInstallments,
        upcomingInstallments,
        loading,
        error,
        fetchInstallments,
        fetchOverdue,
        fetchUpcoming,
        updateInstallment,
        payInstallment,
        markOverdue,
        downloadReceipt,
    };
}
