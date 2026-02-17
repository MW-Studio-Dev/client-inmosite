// ============================================
// Service para Payment Plans (Planes de Pago)
// ============================================

import axiosInstance from '@/lib/api';
import {
    APIResponse,
    PaginatedResponse,
    PlanDePagos,
    PaymentPlanStatus,
} from '@/types/rent-contracts';

interface ListParams {
    contrato?: string;
    inquilino?: string;
    estado_general?: PaymentPlanStatus;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

interface CreatePaymentPlanData {
    contrato: string;
    duracion_meses: number;
    monto_cuota: string;
    fecha_inicio: string;
    ajuste?: string;
    aplicar_ajuste_automatico?: boolean;
}

export const paymentPlanService = {
    /**
     * Listar planes de pago
     */
    async list(params?: ListParams) {
        const response = await axiosInstance.get<APIResponse<PaginatedResponse<PlanDePagos>>>(
            '/rent/payment-plans/',
            { params }
        );
        return response.data;
    },

    /**
     * Obtener plan de pago por ID
     */
    async get(id: string) {
        const response = await axiosInstance.get<APIResponse<PlanDePagos>>(
            `/rent/payment-plans/${id}/`
        );
        return response.data;
    },

    /**
     * Crear plan de pago
     */
    async create(data: CreatePaymentPlanData) {
        const response = await axiosInstance.post<APIResponse<PlanDePagos>>(
            '/rent/payment-plans/',
            data
        );
        return response.data;
    },

    /**
     * Actualizar plan de pago
     */
    async update(id: string, data: Partial<PlanDePagos>) {
        const response = await axiosInstance.patch<APIResponse<PlanDePagos>>(
            `/rent/payment-plans/${id}/`,
            data
        );
        return response.data;
    },

    /**
     * Eliminar plan de pago
     */
    async delete(id: string) {
        const response = await axiosInstance.delete<APIResponse<void>>(
            `/rent/payment-plans/${id}/`
        );
        return response.data;
    },

    /**
     * Suspender plan de pago
     */
    async suspend(id: string) {
        const response = await axiosInstance.post<APIResponse<PlanDePagos>>(
            `/rent/payment-plans/${id}/suspend/`
        );
        return response.data;
    },

    /**
     * Reactivar plan de pago
     */
    async reactivate(id: string) {
        const response = await axiosInstance.post<APIResponse<PlanDePagos>>(
            `/rent/payment-plans/${id}/reactivate/`
        );
        return response.data;
    },

    /**
     * Obtener estadísticas del plan
     */
    async getStats(id: string) {
        const response = await axiosInstance.get<APIResponse<{
            total_installments: number;
            paid_installments: number;
            pending_installments: number;
            overdue_installments: number;
            completion_percentage: number;
            total_paid_amount: string;
            total_pending_amount: string;
        }>>(
            `/rent/payment-plans/${id}/stats/`
        );
        return response.data;
    },
};
