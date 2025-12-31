// Types for Authentication
import { Subscription } from './subscription';

export type AccountStatus = 'pending_payment' | 'active' | 'suspended' | 'canceled';

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
  account_type: string;
  accept_terms: boolean | string;
  accept_privacy: boolean | string;
  // ❌ REMOVIDO: plan_slug - Ya no se selecciona en registro
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  next_step?: 'verify_email'; // ✅ Siempre es verify_email (sin payment)
  data?: {
    user: {
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
      email_verified: false;
      onboarding_completed: false;
      account_type: string;
      account_status: 'active'; // ✅ Siempre activo con plan gratis
      selected_plan: 'free'; // ✅ Plan gratis automático
    };
  };
  error_code?: string;
  errors?: Record<string, string | string[]>;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    access: string;
    refresh: string;
    user: User;
  };
  error_code?: string;
  errors?: Record<string, string | string[]>;
}



export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  account_type: string;
  account_status: AccountStatus;
  email_verified: boolean;
  is_company_owner: boolean;
  onboarding_completed: boolean;
  company?: {
    id: string;
    name: string;
    slug: string;
    website_url?: string;
    // ✅ NUEVO: Subscription completa en perfil
    subscription: Subscription;
  };
  // ❌ REMOVIDO: selected_plan_slug y payment_deadline
  // Ahora la info del plan está en company.subscription
}

export interface VerifyOTPData {
  email: string;
  otp_code: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

// ✅ NUEVO: Tipos para Onboarding
export interface OnboardingRequest {
  plan_slug?: 'free' | 'basic' | 'premium' | 'enterprise';
  company_name: string;
  city: string;
  province?: string;
  cuit?: string;
  company_phone?: string;
  company_address?: string;
  subdomain?: string;
}

export interface OnboardingResponse {
  success: boolean;
  message?: string;
  data: {
    onboarding_completed: boolean;
    payment_required: boolean;
    company: {
      id: string;
      name: string;
      subdomain: string;
      website_url: string;
    };
    payment?: {
      preference_id: string;
      checkout_url: string;
      amount_ars: number;
      plan_name: string;
      plan_slug: string;
    };
    next_step?: 'complete_payment' | 'dashboard';
  };
}
