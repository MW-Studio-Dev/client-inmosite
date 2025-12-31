// Types for Subscription API

export interface Plan {
    id: string;
    name: string;
    slug: string;
    plan_type: string;
    billing_cycle: string;
    price_usd: string;
    price_ars: number;
    price_display: string;
    duration_days: number;
    description: string;
    highlight_text?: string;
    is_popular: boolean;
    features_list: string[];
    is_current: boolean;
    is_upgrade: boolean;
    is_downgrade: boolean;
}

export interface Subscription {
    id: string;
    plan: Plan;
    company_name: string;
    status: 'active' | 'canceled' | 'expired' | 'trial';
    current_period_start: string;
    current_period_end: string;
    trial_start?: string;
    trial_end?: string;
    canceled_at?: string;
    ended_at?: string;
    current_price_usd: string;
    current_price_ars: string;
    current_price_display: string;
    auto_renew: boolean;
    cancel_at_period_end: boolean;
    is_active: boolean;
    is_trial: boolean;
    days_remaining: number;
    trial_days_remaining: number;
    is_expired: boolean;
    created_at: string;
    updated_at: string;
    analytics?: {
        properties_count: number;
        leads_count: number;
        usage_percentage: number;
    };
}

export interface UsageInfo {
    plan_name: string;
    limits: {
        properties?: number;
        leads?: number;
        storage_gb?: number;
        emails_sent?: number;
    };
    current_usage: {
        properties: number;
        leads: number;
        storage_gb: number;
        emails_sent: number;
    };
    usage_percentages: {
        [key: string]: {
            current: number;
            limit: number | null;
            percentage: number;
            is_unlimited: boolean;
        };
    };
}

export interface UpgradeCalculation {
    current_plan: {
        slug: string;
        name: string;
        price_ars: number;
    };
    new_plan: {
        slug: string;
        name: string;
        price_ars: number;
    };
    pricing: {
        upgrade_amount_ars: number;
        upgrade_amount_usd: number;
        full_price_ars: number;
        credit_applied_ars: number;
        is_free_upgrade: boolean;
        next_billing_amount: number;
    };
    calculation_details: {
        days_used: number;
        days_remaining: number;
        total_days: number;
        credit_percentage: number;
    };
    summary: {
        description: string;
        savings: string;
        total_today: string;
        next_billing: string;
    };
}

export interface Invoice {
    id: string;
    invoice_number: string;
    status: 'paid' | 'pending' | 'failed' | 'canceled';
    subscription_company: string;
    subscription_plan: string;
    subtotal_usd: string;
    subtotal_ars: string;
    tax_usd: string;
    tax_ars: string;
    total_usd: string;
    total_ars: string;
    total_display: string;
    period_start: string;
    period_end: string;
    due_date: string;
    paid_at?: string;
    payment_method: string;
    provider_payment_id?: string;
    description: string;
    is_paid: boolean;
    is_overdue: boolean;
    created_at: string;
}

export interface PaymentMethod {
    id: string;
    payment_type: 'credit_card' | 'debit_card' | 'bank_transfer';
    brand: string;
    masked_number: string;
    expiry_display: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
}

export interface PaymentIntent {
    payment_intent_id: string;
    checkout_url: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: any;
}

export interface UpgradeResponse {
    subscription_id?: string;
    new_plan?: string;
    amount_charged?: number;
    next_billing_amount?: number;
    payment_url?: string;
    init_point?: string; // URL de MercadoPago para autorizar suscripción (upgrade desde free)
    preference_id?: string;
    preapproval_id?: string; // ID de la suscripción en MercadoPago
    upgrade_amount?: number;
    calculation_details?: {
        days_used: number;
        days_remaining: number;
        credit_percentage: number;
    };
}

export interface APIResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
