// ============================================
// Service para Contract Templates
// ============================================

import axiosInstance from '@/lib/api';
import {
    APIResponse,
    PaginatedResponse,
    ContractTemplate,
    CreateContractTemplateData,
    PlaceholdersData,
} from '@/types/rent-contracts';

interface ListParams {
    is_active?: boolean;
    is_default?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export const contractTemplateService = {
    /**
     * Listar templates
     */
    async list(params?: ListParams) {
        const response = await axiosInstance.get<APIResponse<PaginatedResponse<ContractTemplate>>>(
            '/rent/contract-templates/',
            { params }
        );
        return response.data;
    },

    /**
     * Obtener template por ID
     */
    async get(id: string) {
        const response = await axiosInstance.get<APIResponse<ContractTemplate>>(
            `/rent/contract-templates/${id}/`
        );
        return response.data;
    },

    /**
     * Crear template
     */
    async create(data: CreateContractTemplateData) {
        const response = await axiosInstance.post<APIResponse<ContractTemplate>>(
            '/rent/contract-templates/',
            data
        );
        return response.data;
    },

    /**
     * Actualizar template (PATCH)
     */
    async update(id: string, data: Partial<ContractTemplate>) {
        const response = await axiosInstance.patch<APIResponse<ContractTemplate>>(
            `/rent/contract-templates/${id}/`,
            data
        );
        return response.data;
    },

    /**
     * Actualizar template completo (PUT)
     */
    async replace(id: string, data: CreateContractTemplateData) {
        const response = await axiosInstance.put<APIResponse<ContractTemplate>>(
            `/rent/contract-templates/${id}/`,
            data
        );
        return response.data;
    },

    /**
     * Eliminar template
     */
    async delete(id: string) {
        const response = await axiosInstance.delete<APIResponse<void>>(
            `/rent/contract-templates/${id}/`
        );
        return response.data;
    },

    /**
     * Establecer como default
     */
    async setDefault(id: string) {
        const response = await axiosInstance.post<APIResponse<{ id: string; is_default: boolean }>>(
            `/rent/contract-templates/${id}/set_default/`
        );
        return response.data;
    },

    /**
     * Obtener template default
     */
    async getDefault() {
        const response = await axiosInstance.get<APIResponse<ContractTemplate>>(
            '/rent/contract-templates/get_default/'
        );
        return response.data;
    },

    /**
     * Obtener placeholders disponibles
     */
    async getPlaceholders() {
        const response = await axiosInstance.get<APIResponse<PlaceholdersData>>(
            '/rent/contract-templates/placeholders/'
        );
        return response.data;
    },
};
