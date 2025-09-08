import { Company } from '@/interfaces/company';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    avatar: string;
    is_company_owner: boolean;
    email_verified: boolean;
    onboarding_completed: boolean;
    last_login: string;
    date_joined: string;
    company: Company;
  }
  

  
  export interface AuthTokens {
    access: string;
    refresh: string;
    access_expires_at: number;
    refresh_expires_at: number;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_phone: string;
    user_password: string;
    user_password_confirm: string;
    user_accept_terms: boolean;
    user_accept_privacy: boolean;
    user_marketing_emails: boolean;
    company_name: string;
    company_type: string;
    cuit: string;
    company_phone: string;
    company_address: string;
    city: string;
    province: string;
    subdomain: string;
    website_url?: string;
  }
  
export interface AuthState {
    // Estado
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
  
    // Acciones
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; onboarding_required?: boolean }>;
    register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
    clearError: () => void;
    checkAuth: () => Promise<void>;
    refreshTokens: () => Promise<{ success: boolean; message?: string }>;
    updateUser: (userData: Partial<User>) => void;
  }