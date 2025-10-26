// Theme Types for Real Estate Website Template
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  isDark: boolean;
}

export interface WebsiteConfig {
  theme: Theme;
  logo: {
    url: string;
    alt: string;
  };
  navigation: NavigationItem[];
  hero: HeroConfig;
  about: AboutConfig;
  contact: ContactConfig;
  social: SocialConfig;
  features: FeatureFlags;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity: number;
  ctaText: string;
  ctaLink: string;
}

export interface AboutConfig {
  title: string;
  description: string;
  image?: string;
  stats: Statistic[];
}

export interface Statistic {
  id: string;
  value: number;
  label: string;
  suffix?: string;
}

export interface ContactConfig {
  address: string;
  phone: string;
  email: string;
  whatsapp?: string;
  mapUrl?: string;
}

export interface SocialConfig {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface FeatureFlags {
  showDevelopmentProjects: boolean;
  showAboutUs: boolean;
  showStats: boolean;
  enableWhatsApp: boolean;
  enableMap: boolean;
}

// Property Types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type: PropertyType;
  status: PropertyStatus;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: PropertyFeatures;
  images: PropertyImage[];
  agent?: Agent;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking?: number;
  pool?: boolean;
  garden?: boolean;
  balcony?: boolean;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface DevelopmentProject {
  id: string;
  name: string;
  description: string;
  location: string;
  totalUnits: number;
  soldUnits: number;
  completionPercentage: number;
  estimatedCompletion: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  images: PropertyImage[];
  floorPlans?: FloorPlan[];
}

export interface FloorPlan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  imageUrl: string;
}

export type PropertyType = 'house' | 'apartment' | 'commercial' | 'land' | 'office';
export type PropertyStatus = 'for_sale' | 'for_rent' | 'sold' | 'rented';
export type ViewMode = 'grid' | 'list';

// Filter Types
export interface PropertyFilters {
  type?: PropertyType;
  status?: PropertyStatus;
  priceRange?: {
    min: number;
    max: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
}

export interface SearchFilters extends PropertyFilters {
  sortBy?: 'price' | 'date' | 'area';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SectionProps extends BaseComponentProps {
  theme?: Theme;
  config?: Partial<WebsiteConfig>;
}