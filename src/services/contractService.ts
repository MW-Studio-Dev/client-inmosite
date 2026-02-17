// ============================================
// Service para Contracts (Contratos)
// ============================================

import axiosInstance from '@/lib/api';
import {
    APIResponse,
    PaginatedResponse,
    Contrato,
    CreateContractData,
    GenerateContractResponse,
    ContractPreviewResponse,
    ContractStatus,
} from '@/types/rent-contracts';

interface ListParams {
    status?: ContractStatus;
    tenant?: string;
    rental?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export const contractService = {
    /**
     * Listar contratos
     */
    async list(params?: ListParams) {
        const response = await axiosInstance.get<APIResponse<PaginatedResponse<Contrato>>>(
            '/rent/contracts/',
            { params }
        );
        return response.data;
    },

    /**
     * Obtener contrato por ID
     */
    async get(id: string) {
        const response = await axiosInstance.get<APIResponse<Contrato>>(
            `/rent/contracts/${id}/`
        );
        return response.data;
    },

    /**
     * Crear contrato
     */
    async create(data: CreateContractData) {
        const response = await axiosInstance.post<APIResponse<Contrato>>(
            '/rent/contracts/',
            data
        );
        return response.data;
    },

    /**
     * Actualizar contrato
     */
    async update(id: string, data: Partial<Contrato>) {
        const response = await axiosInstance.patch<APIResponse<Contrato>>(
            `/rent/contracts/${id}/`,
            data
        );
        return response.data;
    },

    /**
     * Eliminar contrato
     */
    async delete(id: string) {
        const response = await axiosInstance.delete<APIResponse<void>>(
            `/rent/contracts/${id}/`
        );
        return response.data;
    },

    /**
     * Generar contenido del contrato
     */
    async generate(id: string, regenerate = false) {
        const response = await axiosInstance.post<APIResponse<GenerateContractResponse>>(
            `/rent/contracts/${id}/generate/`,
            { regenerate }
        );
        return response.data;
    },

    /**
     * Firmar contrato
     */
    async sign(id: string, signing_date?: string) {
        const response = await axiosInstance.post<APIResponse<Contrato>>(
            `/rent/contracts/${id}/sign/`,
            { signing_date }
        );
        return response.data;
    },

    /**
     * Activar contrato
     */
    async activate(id: string) {
        const response = await axiosInstance.post<APIResponse<Contrato>>(
            `/rent/contracts/${id}/activate/`
        );
        return response.data;
    },

    /**
     * Cancelar contrato
     */
    async cancel(id: string) {
        const response = await axiosInstance.post<APIResponse<Contrato>>(
            `/rent/contracts/${id}/cancel/`
        );
        return response.data;
    },

    /**
     * Preview del contrato (contenido completo)
     */
    async preview(id: string) {
        const response = await axiosInstance.get<APIResponse<ContractPreviewResponse>>(
            `/rent/contracts/${id}/preview/`
        );
        return response.data;
    },
};
