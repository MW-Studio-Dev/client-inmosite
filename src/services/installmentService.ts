// ============================================
// Service para Installments (Cuotas)
// ============================================

import axiosInstance, { axiosInstanceMultipart } from '@/lib/api';
import {
    APIResponse,
    PaginatedResponse,
    Cuota,
    PayInstallmentData,
    InstallmentStatus,
    PaymentMethod,
} from '@/types/rent-contracts';

interface ListParams {
    plan_pagos?: string;
    estado?: InstallmentStatus;
    fecha_vencimiento_min?: string;
    fecha_vencimiento_max?: string;
    is_overdue?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export const installmentService = {
    /**
     * Listar cuotas
     */
    async list(params?: ListParams) {
        const response = await axiosInstance.get<APIResponse<PaginatedResponse<Cuota>>>(
            '/rent/installments/',
            { params }
        );
        return response.data;
    },

    /**
     * Obtener cuota por ID
     */
    async get(id: string) {
        const response = await axiosInstance.get<APIResponse<Cuota>>(
            `/rent/installments/${id}/`
        );
        return response.data;
    },

    /**
     * Actualizar cuota
     */
    async update(id: string, data: Partial<Cuota>) {
        const response = await axiosInstance.patch<APIResponse<Cuota>>(
            `/rent/installments/${id}/`,
            data
        );
        return response.data;
    },

    /**
     * Registrar pago de cuota
     */
    async pay(id: string, data: PayInstallmentData) {
        const formData = new FormData();

        formData.append('monto_pagado', data.monto_pagado);

        if (data.fecha_pago) {
            formData.append('fecha_pago', data.fecha_pago);
        }

        if (data.metodo_pago) {
            formData.append('metodo_pago', data.metodo_pago);
        }

        if (data.comprobante) {
            formData.append('comprobante', data.comprobante);
        }

        if (data.observaciones) {
            formData.append('observaciones', data.observaciones);
        }

        const response = await axiosInstanceMultipart.post<APIResponse<Cuota>>(
            `/rent/installments/${id}/pay/`,
            formData
        );
        return response.data;
    },

    /**
     * Marcar como vencida (actualizar estado automáticamente)
     */
    async markOverdue(id: string) {
        const response = await axiosInstance.post<APIResponse<Cuota>>(
            `/rent/installments/${id}/mark_overdue/`
        );
        return response.data;
    },

    /**
     * Obtener cuotas vencidas
     */
    async getOverdue(planId?: string) {
        const params: any = { is_overdue: true };
        if (planId) {
            params.plan_pagos = planId;
        }

        const response = await axiosInstance.get<APIResponse<PaginatedResponse<Cuota>>>(
            '/rent/installments/',
            { params }
        );
        return response.data;
    },

    /**
     * Obtener próximas cuotas a vencer
     */
    async getUpcoming(planId?: string, days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        const params: any = {
            fecha_vencimiento_min: today.toISOString().split('T')[0],
            fecha_vencimiento_max: futureDate.toISOString().split('T')[0],
            estado: 'PENDIENTE',
        };

        if (planId) {
            params.plan_pagos = planId;
        }

        const response = await axiosInstance.get<APIResponse<PaginatedResponse<Cuota>>>(
            '/rent/installments/',
            { params }
        );
        return response.data;
    },

    /**
     * Descargar comprobante
     */
    async downloadReceipt(id: string) {
        const response = await axiosInstance.get(
            `/rent/installments/${id}/receipt/`,
            { responseType: 'blob' }
        );
        return response.data;
    },
};
