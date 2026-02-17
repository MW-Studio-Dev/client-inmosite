import axiosInstance from '@/lib/api';
import type { Plan, Subscription, UpgradeResponse, APIResponse, PaginatedResponse } from '@/types/subscription';

const BASE = '/subscriptions';

export const subscriptionService = {
    /**
     * Lista todos los planes de suscripción activos.
     * No requiere auth (útil para onboarding/registro).
     */
    async getPlans(forRegistration = false): Promise<Plan[]> {
        const response = await axiosInstance.get<any>(
            `${BASE}/plans/`,
            { headers: forRegistration ? { Authorization: '' } : undefined }
        );
        console.log("Plans API Response: ", response.data);

        // Handle paginated response
        if (response.data.results && Array.isArray(response.data.results)) {
            return response.data.results;
        }

        // Handle direct array response
        if (Array.isArray(response.data)) {
            return response.data;
        }

        // Handle data wrapper
        if (response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        console.error("Unexpected plans response format:", response.data);
        return [];
    },

    /**
     * Obtiene la suscripción actual de la empresa del usuario.
     */
    async getCurrentSubscription(): Promise<Subscription | null> {
        const response = await axiosInstance.get<APIResponse<Subscription | null>>(
            `${BASE}/subscription/`
        );
        return response.data.data;
    },

    /**
     * Crea preferencia de pago en MercadoPago y devuelve checkout_url.
     * El frontend debe redirigir: window.location.href = result.checkout_url
     */
    async upgrade(planSlug: string): Promise<UpgradeResponse> {
        const response = await axiosInstance.post<APIResponse<UpgradeResponse>>(
            `${BASE}/subscription/upgrade/`,
            { plan_slug: planSlug }
        );
        return response.data.data;
    },

    /**
     * Cancela la suscripción actual.
     * @param immediately - true: cancela ya. false: cancela al fin del período.
     */
    async cancel(immediately = false): Promise<Subscription> {
        const response = await axiosInstance.post<APIResponse<Subscription>>(
            `${BASE}/subscription/cancel/`,
            { immediately }
        );
        return response.data.data;
    },
};
