// Types for Subscription API — Alineados con backend serializers

export interface Plan {
    id: string;
    name: string;
    slug: string;
    plan_type: 'trial' | 'basic' | 'premium' | 'enterprise';
    billing_cycle: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
    price_usd: number;
    price_ars: number;
    price_display: string;
    duration_days: number;
    description: string;
    highlight_text: string;
    is_popular: boolean;
    features: {
        features_list: string[];
        limits: Record<string, number>;
    };
    features_list: string[];
    is_current: boolean;
}

export interface Subscription {
    id: string;
    plan: Plan;
    company_name: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
    current_period_start: string;
    current_period_end: string;
    trial_start: string | null;
    trial_end: string | null;
    canceled_at: string | null;
    current_price_usd: number;
    current_price_ars: number;
    auto_renew: boolean;
    cancel_at_period_end: boolean;
    is_active: boolean;
    is_trial: boolean;
    days_remaining: number;
    trial_days_remaining: number;
    is_expired: boolean;
    created_at: string;
    updated_at: string;
}

export interface UpgradeResponse {
    checkout_url: string;
    sandbox_url: string;
    preference_id: string;
}

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
