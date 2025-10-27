// API utility functions for fetching website/public data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PropertyAPIResponse {
  id: string;
  title: string;
  price_usd: string;
  price_ars: string;
  price_display: string;
  operation_type: 'venta' | 'alquiler';
  property_type: string;
  status: 'disponible' | 'vendido' | 'reservado' | 'no_disponible';
  city: string;
  neighborhood: string;
  location_display: string;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  surface_total: string;
  main_features: string;
  featured_image_url: string | null;
  featured_thumbnail_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface PropertyListResponse {
  success: boolean;
  message: string;
  data: PropertyAPIResponse[];
  meta: {
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      has_next: boolean;
      has_previous: boolean;
      next_page: number | null;
      previous_page: number | null;
      page_size: number;
      start_index: number;
      end_index: number;
    };
    filters: {
      applied: Record<string, unknown>;
      available: unknown[];
    };
  };
  timestamp: string;
  request_id: string;
}

export interface FetchPropertiesParams {
  subdomain: string;
  page?: number;
  page_size?: number;
  operation_type?: 'venta' | 'alquiler';
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_surface?: number;
  max_surface?: number;
  neighborhood?: string;
  city?: string;
  is_featured?: boolean;
}

/**
 * Fetch properties from the public API
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with property list response
 */
export async function fetchPublicProperties(
  params: FetchPropertiesParams
): Promise<PropertyListResponse> {
  const { subdomain, ...queryParams } = params;

  // Build query string
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const url = `${API_BASE_URL}/v1/properties/public/${subdomain}/properties/${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: PropertyListResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

/**
 * Get subdomain from hostname (client-side)
 */
export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // For localhost development, return a default subdomain
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'inmosanmartin'; // Default for development
  }

  // For production, extract subdomain
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}