// types/property.ts
export interface Property {
  id: string;
  title: string;
  operation_type: 'venta' | 'alquiler';
  property_type: string;
  status: 'disponible' | 'vendido' | 'reservado' | 'no_disponible';
  price_usd: string;
  price_ars: string;
  price_display: string;
  location_display: string;
  main_features: string;
  featured_image_url: string | null;
  images_count: number;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyResponse {
  success: boolean;
  message: string;
  data: Property[];
}

export interface PropertyFilters {
  operation_type?: 'venta' | 'alquiler';
  property_type?: string;
  status?: 'disponible' | 'vendido' | 'reservado' | 'no_disponible';
  is_featured?: boolean;
  is_published?: boolean;
}

export interface CreatePropertyForm {
  // Información básica
  title: string;
  description: string;
  internal_code: string;
  
  // Precios
  price_usd: number | '';
  price_ars: number | '';
  
  // Tipo y estado
  operation_type: 'venta' | 'alquiler' | '';
  property_type: string;
  status: 'disponible' | 'vendido' | 'reservado' | 'no_disponible' | '';
  
  // Ubicación
  province: string;
  city: string;
  neighborhood: string;
  address: string;
  floor: number | '';
  unit: string;
  
  // Características físicas
  bedrooms: number | '';
  bathrooms: number | '';
  half_bathrooms: number | '';
  rooms: number | '';
  surface_total: number | '';
  surface_covered: number | '';
  surface_semicovered: number | '';
  surface_uncovered: number | '';
  age_years: number | '';
  orientation: string;
  garage_spaces: number | '';
  storage_spaces: number | '';
  
  // Configuración
  is_featured: boolean;
  is_published: boolean;
  
  // SEO
  meta_title: string;
  meta_description: string;
  
  // Características adicionales
  features: string[];
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  internal_code: string;
  price_usd: number;
  price_ars: number;
  operation_type: 'venta' | 'alquiler';
  property_type: string;
  status: 'disponible' | 'vendido' | 'reservado' | 'no_disponible';
  province: string;
  city: string;
  neighborhood: string;
  address: string;
  floor?: number;
  unit?: string;
  bedrooms: number;
  bathrooms: number;
  half_bathrooms: number;
  rooms: number;
  surface_total: number;
  surface_covered?: number;
  surface_semicovered?: number;
  surface_uncovered?: number;
  age_years?: number;
  orientation?: string;
  garage_spaces: number;
  storage_spaces: number;
  is_featured: boolean;
  is_published: boolean;
  meta_title?: string;
  meta_description?: string;
  features: string[];
}

export interface CreatePropertyResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    [key: string]: unknown;
  };
  errors?: {
    [key: string]: string[];
  };
}

export interface FormValidationErrors {
  [key: string]: string;
}

export interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  internal_code: string;
  price_usd: string;
  price_ars: string;
  expenses_ars: string | null;
  price_display: string;
  price_per_m2_usd: number;
  price_per_m2_ars: number;
  operation_type: 'venta' | 'alquiler';
  property_type: string;
  status: 'disponible' | 'vendido' | 'reservado' | 'no_disponible';
  province: string;
  city: string;
  neighborhood: string;
  address: string;
  floor: string;
  unit: string;
  location_display: string;
  bedrooms: number;
  bathrooms: number;
  half_bathrooms: number;
  rooms: number;
  surface_total: string;
  surface_covered: string;
  surface_semicovered: string;
  surface_uncovered: string;
  age_years: number;
  orientation: string;
  garage_spaces: number;
  storage_spaces: number;
  main_features: string;
  featured_image_url: string | null;
  images: string[];
  features: string[];
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyDetailResponse {
  success: boolean;
  message: string;
  data: PropertyDetail;
  meta: Record<string, unknown> | null;
  timestamp: string;
  request_id: string;
}

export interface UsePropertyDetailReturn {
  property: PropertyDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}