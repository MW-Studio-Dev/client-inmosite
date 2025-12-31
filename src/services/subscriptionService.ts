import axiosInstance from '@/lib/api';
import type {
    Plan,
    Subscription,
    UsageInfo,
    UpgradeCalculation,
    Invoice,
    PaymentMethod,
    PaymentIntent,
    UpgradeResponse,
    APIResponse,
    PaginatedResponse,
} from '@/types/subscription';

const SUBSCRIPTIONS_BASE = '/subscriptions';

export const subscriptionService = {
    // ==================== PLANES ====================

    /**
     * Obtiene todos los planes de suscripción disponibles
     * @param forRegistration - Si es true, obtiene planes para registro (sin autenticación)
     */
    async getPlans(forRegistration: boolean = false): Promise<Plan[]> {
        try {
            const response = await axiosInstance.get<APIResponse<Plan[]>>(
                `${SUBSCRIPTIONS_BASE}/plans/`,
                {
                    // Si es para registro, no enviar el token de autenticación
                    headers: forRegistration ? { Authorization: '' } : undefined
                }
            );
            return response.data.data;
        } catch (error: any) {
            // Si falla la petición autenticada, intentar sin autenticación
            if (forRegistration && error.response?.status === 401) {
                const response = await axiosInstance.get<APIResponse<Plan[]>>(
                    `${SUBSCRIPTIONS_BASE}/plans/`,
                    { headers: { Authorization: '' } }
                );
                return response.data.data;
            }
            throw error;
        }
    },

    /**
     * Obtiene el detalle de un plan específico
     */
    async getPlan(planId: string): Promise<Plan> {
        const response = await axiosInstance.get<APIResponse<Plan>>(`${SUBSCRIPTIONS_BASE}/plans/${planId}/`);
        return response.data.data;
    },

    /**
     * Calcula el costo de upgrade a un plan específico
     */
    async calculateUpgradeCost(planId: string): Promise<UpgradeCalculation> {
        const response = await axiosInstance.post<APIResponse<UpgradeCalculation>>(
            `${SUBSCRIPTIONS_BASE}/plans/${planId}/calculate-upgrade-cost/`
        );
        return response.data.data;
    },

    // ==================== SUSCRIPCIÓN ====================

    /**
     * Obtiene la suscripción actual de la empresa
     */
    async getCurrentSubscription(): Promise<Subscription | null> {
        const response = await axiosInstance.get<APIResponse<Subscription | null>>(
            `${SUBSCRIPTIONS_BASE}/subscription/`
        );
        return response.data.data;
    },

    /**
     * Obtiene información de uso actual
     */
    async getUsage(): Promise<UsageInfo> {
        const response = await axiosInstance.get<APIResponse<UsageInfo>>(
            `${SUBSCRIPTIONS_BASE}/subscription/usage/`
        );
        return response.data.data;
    },

    /**
     * Calcula el costo de upgrade con prorrateo
     */
    async calculateUpgradeWithProrate(newPlanSlug: string): Promise<UpgradeCalculation> {
        const response = await axiosInstance.post<APIResponse<UpgradeCalculation>>(
            `${SUBSCRIPTIONS_BASE}/subscription/calculate-upgrade-cost/`,
            { new_plan_slug: newPlanSlug }
        );
        return response.data.data;
    },

    /**
     * Realiza upgrade con prorrateo (Método seguro con verificación de pago)
     * @param newPlanSlug - Slug del plan al que se desea actualizar
     * @param paymentMethod - Método de pago (default: 'mercadopago')
     */
    async upgradeWithProrate(
        newPlanSlug: string,
        paymentMethod: string = 'mercadopago'
    ): Promise<UpgradeResponse> {
        const response = await axiosInstance.post<APIResponse<UpgradeResponse>>(
            `${SUBSCRIPTIONS_BASE}/subscription/upgrade-with-prorate/`,
            {
                new_plan_slug: newPlanSlug,
                payment_method: paymentMethod,
            }
        );
        return response.data.data;
    },

    /**
     * Crea una preferencia de pago en MercadoPago para checkout externo
     * @param planSlug - Slug del plan a contratar
     */
    async createPaymentPreference(planSlug: string): Promise<{init_point: string; preference_id: string}> {
        const response = await axiosInstance.post<APIResponse<{init_point: string; preference_id: string}>>(
            `${SUBSCRIPTIONS_BASE}/subscription/create-payment-preference/`,
            {
                plan_slug: planSlug,
            }
        );
        return response.data.data;
    },

    /**
     * Upgrade desde plan gratuito a plan pago (crea suscripción en MercadoPago)
     * @param newPlanSlug - Slug del plan al que se desea actualizar
     * @param cardTokenId - Token de tarjeta generado por MercadoPago SDK
     * @param paymentMethodId - ID del método de pago (opcional)
     * @param issuerId - ID del emisor de la tarjeta (opcional)
     * @param payerEmail - Email del pagador (opcional)
     */
    async upgradeFromFreeToPaid(
        newPlanSlug: string,
        cardTokenId: string,
        paymentMethodId?: string,
        issuerId?: string,
        payerEmail?: string
    ): Promise<UpgradeResponse> {
        const payload: any = {
            new_plan_slug: newPlanSlug,
            card_token_id: cardTokenId,
        };

        if (paymentMethodId) payload.payment_method_id = paymentMethodId;
        if (issuerId) payload.issuer_id = issuerId;
        if (payerEmail) payload.payer_email = payerEmail;

        const response = await axiosInstance.post<APIResponse<UpgradeResponse>>(
            `${SUBSCRIPTIONS_BASE}/subscription/upgrade-to-paid-plan/`,
            payload
        );
        return response.data.data;
    },

    /**
     * Upgrade entre planes pagos (con prorrateo)
     * @param newPlanSlug - Slug del plan al que se desea actualizar
     * @param paymentMethod - Método de pago (default: 'mercadopago')
     */
    async upgradePaidToPaid(newPlanSlug: string, paymentMethod: string = 'mercadopago'): Promise<UpgradeResponse> {
        const response = await axiosInstance.post<APIResponse<UpgradeResponse>>(
            `${SUBSCRIPTIONS_BASE}/subscription/upgrade-paid-to-paid/`,
            {
                new_plan_slug: newPlanSlug,
                payment_method: paymentMethod,
            }
        );
        return response.data.data;
    },

    /**
     * Upgrade tradicional (sin prorrateo automático)
     * @deprecated Usar upgradeFromFreeToPaid o upgradePaidToPaid según el caso
     */
    async upgradePlan(
        planSlug: string,
        paymentProvider: string = 'mercadopago',
        billingType: 'recurring' | 'one_time' = 'recurring'
    ): Promise<any> {
        const response = await axiosInstance.post<APIResponse<any>>(
            `${SUBSCRIPTIONS_BASE}/subscription/upgrade/`,
            {
                plan_slug: planSlug,
                payment_provider: paymentProvider,
                billing_type: billingType,
            }
        );
        return response.data.data;
    },

    /**
     * Cancela la suscripción
     */
    async cancelSubscription(
        immediately: boolean = false,
        reason?: string
    ): Promise<Subscription> {
        const response = await axiosInstance.post<APIResponse<Subscription>>(
            `${SUBSCRIPTIONS_BASE}/subscription/cancel/`,
            {
                immediately,
                reason,
            }
        );
        return response.data.data;
    },

    /**
     * Reactiva una suscripción cancelada
     */
    async reactivateSubscription(): Promise<Subscription> {
        const response = await axiosInstance.post<APIResponse<Subscription>>(
            `${SUBSCRIPTIONS_BASE}/subscription/reactivate/`
        );
        return response.data.data;
    },

    // ==================== PAGOS ====================

    /**
     * Crea una intención de pago único
     */
    async createPaymentIntent(
        amount: number,
        currency: string = 'ARS',
        metadata?: any
    ): Promise<PaymentIntent> {
        const response = await axiosInstance.post<APIResponse<PaymentIntent>>(
            `${SUBSCRIPTIONS_BASE}/subscription/create-payment-intent/`,
            {
                amount,
                currency,
                metadata,
            }
        );
        return response.data.data;
    },

    /**
     * Configura pago recurrente
     */
    async setupRecurringPayment(
        currency: string = 'ARS',
        metadata?: any
    ): Promise<any> {
        const response = await axiosInstance.post<APIResponse<any>>(
            `${SUBSCRIPTIONS_BASE}/subscription/setup-recurring-payment/`,
            {
                currency,
                metadata,
            }
        );
        return response.data.data;
    },

    /**
     * Configura facturación automática
     */
    async setupAutomaticBilling(): Promise<any> {
        const response = await axiosInstance.post<APIResponse<any>>(
            `${SUBSCRIPTIONS_BASE}/subscription/setup-automatic-billing/`
        );
        return response.data.data;
    },

    // ==================== FACTURAS ====================

    /**
     * Obtiene lista de facturas
     */
    async getInvoices(params?: {
        status?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<Invoice>> {
        const response = await axiosInstance.get<APIResponse<PaginatedResponse<Invoice>>>(
            `${SUBSCRIPTIONS_BASE}/invoices/`,
            { params }
        );
        return response.data.data;
    },

    /**
     * Obtiene detalle de una factura
     */
    async getInvoice(invoiceId: string): Promise<Invoice> {
        const response = await axiosInstance.get<APIResponse<Invoice>>(
            `${SUBSCRIPTIONS_BASE}/invoices/${invoiceId}/`
        );
        return response.data.data;
    },

    /**
     * Descarga una factura en PDF
     */
    async downloadInvoice(invoiceId: string): Promise<Blob> {
        const response = await axiosInstance.get(
            `${SUBSCRIPTIONS_BASE}/invoices/${invoiceId}/download/`,
            {
                responseType: 'blob',
            }
        );
        return response.data;
    },

    // ==================== MÉTODOS DE PAGO ====================

    /**
     * Obtiene lista de métodos de pago
     */
    async getPaymentMethods(): Promise<PaymentMethod[]> {
        const response = await axiosInstance.get<APIResponse<PaymentMethod[]>>(
            `${SUBSCRIPTIONS_BASE}/payment-methods/`
        );
        return response.data.data;
    },

    /**
     * Agrega un nuevo método de pago
     */
    async addPaymentMethod(paymentMethodData: any): Promise<PaymentMethod> {
        const response = await axiosInstance.post<APIResponse<PaymentMethod>>(
            `${SUBSCRIPTIONS_BASE}/payment-methods/`,
            paymentMethodData
        );
        return response.data.data;
    },

    /**
     * Establece un método de pago como predeterminado
     */
    async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
        const response = await axiosInstance.post<APIResponse<PaymentMethod>>(
            `${SUBSCRIPTIONS_BASE}/payment-methods/${paymentMethodId}/set-default/`
        );
        return response.data.data;
    },

    /**
     * Elimina un método de pago
     */
    async deletePaymentMethod(paymentMethodId: string): Promise<void> {
        await axiosInstance.delete(
            `${SUBSCRIPTIONS_BASE}/payment-methods/${paymentMethodId}/`
        );
    },
};
