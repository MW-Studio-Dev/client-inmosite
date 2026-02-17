// ============================================
// Service para Rentals (Alquileres)
// ============================================

import axiosInstance from '@/lib/api';

interface Rental {
    id: string;
    property: string;
    property_detail?: {
        id: string;
        title: string;
        address: string;
        type: string;
    };
    tenant: string;
    tenant_detail?: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
    };
    owner: string;
    owner_detail?: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
    };
    monthly_rent: string;
    deposit: string;
    start_date: string;
    end_date: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
    updated_at: string;
}

interface APIResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

interface ListParams {
    status?: string;
    tenant?: string;
    property?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export const rentalService = {
    /**
     * Listar alquileres
     */
    async list(params?: ListParams) {
        const response = await axiosInstance.get<APIResponse<PaginatedResponse<Rental>>>(
            '/rentals/',
            { params }
        );
        return response.data;
    },

    /**
     * Obtener alquiler por ID
     */
    async get(id: string) {
        const response = await axiosInstance.get<APIResponse<Rental>>(
            `/rentals/${id}/`
        );
        return response.data;
    },

    /**
     * Crear alquiler
     */
    async create(data: {
        property: string;
        tenant: string;
        monthly_rent: string;
        deposit: string;
        start_date: string;
        end_date: string;
    }) {
        const response = await axiosInstance.post<APIResponse<Rental>>(
            '/rentals/',
            data
        );
        return response.data;
    },

    /**
     * Actualizar alquiler
     */
    async update(id: string, data: Partial<Rental>) {
        const response = await axiosInstance.patch<APIResponse<Rental>>(
            `/rentals/${id}/`,
            data
        );
        return response.data;
    },

    /**
     * Eliminar alquiler
     */
    async delete(id: string) {
        const response = await axiosInstance.delete<APIResponse<void>>(
            `/rentals/${id}/`
        );
        return response.data;
    },

    /**
     * Obtener estadísticas de alquileres
     */
    async getStats() {
        const response = await axiosInstance.get<APIResponse<{
            total_active: number;
            total_completed: number;
            total_cancelled: number;
            monthly_revenue: number;
        }>>(
            '/rentals/stats/'
        );
        return response.data;
    },
};

export type { Rental, ListParams };
