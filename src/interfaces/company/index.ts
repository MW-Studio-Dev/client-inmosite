export interface Company {
    id: string;
    name: string;
    company_type: string;
    subdomain: string;
    custom_domain: string;
    subscription_plan: string;
    subscription_active: boolean;
    trial_end_date: string;
    logo: string;
    website_url_full: string;
    properties_count: number;
    property_limit: number;
    can_add_properties: boolean;
    is_trial_expired: boolean;
    timezone: string;
    is_company_owner: boolean;
    email?: string;
    
  }