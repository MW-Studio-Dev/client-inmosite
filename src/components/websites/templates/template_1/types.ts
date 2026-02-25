
import { ReactNode } from 'react';

export interface Colors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  success: string;
  warning: string;
  error: string;
}

export interface Typography {
  fontFamily: string;
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
}

export interface Company {
  name: string;
  logo: string | {
    type: 'image';
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  showSearchBar: boolean;
  backgroundVideoUrl?: string;
}

export interface AboutUs {
  title: string;
  description: string;
  image: string;
  phrases: string[];
  yearsExperience: number;
  propertiesSold: number;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  photo: string;
  description: string;
  linkedinUrl?: string;
  instagram_url?: string;
  bio?: string;
  email?: string;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  status: string;
  deliveryDate: string;
}

export interface PropertyType {
  enabled: boolean;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface PropertyTypes {
  houses: PropertyType;
  apartments: PropertyType;
  lands: PropertyType;
  offices: PropertyType;
  fields: PropertyType;
}

export interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
}

export interface Feature {
  icon: ReactNode;
  text: string;
}

// Nueva interface para Partners
export interface Partner {
  id: number;
  name: string;
  logo: string | {
    type: 'image' | 'emoji';
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  category: string;
  description: string;
  website?: string;
  featured?: boolean;
}

export interface PartnersConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  categories: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
  carousel: {
    autoplay: boolean;
    autoplayDelay: number;
    showDots: boolean;
    showArrows: boolean;
  };
}

// Interface para WhyInvest
export interface WhyInvestBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface WhyInvestConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  benefits?: WhyInvestBenefit[];
  cta?: {
    text: string;
  };
}

// Interface para HowItWorks
export interface HowItWorksStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStat {
  value: string;
  label: string;
}

export interface HowItWorksConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  steps?: HowItWorksStep[];
  stats?: HowItWorksStat[];
  ctaText?: string;
  ctaButton?: string;
}

// Interface para FAQ
export interface FAQQuestion {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  questions: FAQQuestion[];
  contactTitle?: string;
  contactSubtitle?: string;
  contactButton?: string;
}

interface ContactMethod {
  title: string;
  action: string;
}

interface WhatsAppMethod extends ContactMethod {
  value: string;
  message: string;
}

interface ContactMethods {
  phone: ContactMethod;
  email: ContactMethod;
  whatsapp: WhatsAppMethod;
  office: ContactMethod;
}

interface ScheduleHour {
  days: string;
  hours: string;
}

interface ContactSchedule {
  title: string;
  hours: ScheduleHour[];
}

interface ContactInfo {
  title: string;
  methods: ContactMethods;
  schedule: ContactSchedule;
}

interface FormField {
  label: string;
  placeholder: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface PropertyTypeField extends FormField {
  options: SelectOption[];
}

interface ContactFormFields {
  name: FormField;
  email: FormField;
  phone: FormField;
  propertyType: PropertyTypeField;
  message: FormField;
}

interface ContactForm {
  title: string;
  fields: ContactFormFields;
  submitButton: string;
}

interface ContactConfig {
  title: string;
  subtitle: string;
  info: ContactInfo;
  form: ContactForm;
}
// types/propertyTypes.ts

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface PropertyFeature {
  id: string;
  name: string;
  value: string | number;
  icon?: string;
  type: 'text' | 'number' | 'boolean' | 'area' | 'money';
}

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyContact {
  agent: {
    name: string;
    phone: string;
    email: string;
    image?: string;
  };
  office: {
    name: string;
    phone: string;
    email: string;
  };
}
export interface PropertyPrice {
  amount: number;
  currency: string;
  period?: 'month' | 'year'; // para alquileres
};
export interface PropertyDetail {
  id: number;
  title: string;
  type: 'house' | 'apartment' | 'land' | 'office' | 'field';
  status: 'sale' | 'rent' | 'sold' | 'rented';
  price: PropertyPrice;
  images: PropertyImage[];
  description: string;
  features: PropertyFeature[];
  location: PropertyLocation;
  contact: PropertyContact;
  amenities: string[];
  nearbyPlaces: Array<{
    name: string;
    distance: string;
    type: 'school' | 'hospital' | 'shopping' | 'transport' | 'park';
  }>;
  createdAt: string;
  updatedAt: string;
  virtualTour?: string;
  floorPlan?: string;
}

export interface PropertyDetailConfig {
  gallery: {
    showThumbnails: boolean;
    showZoom: boolean;
    showFullscreen: boolean;
    autoplay: boolean;
    autoplayDelay: number;
  };
  contact: {
    showAgent: boolean;
    showOffice: boolean;
    showWhatsApp: boolean;
    showCallButton: boolean;
    showEmailButton: boolean;
    whatsappMessage: string;
  };
  features: {
    showIcons: boolean;
    groupByType: boolean;
    showInGrid: boolean;
  };
  similarProperties: {
    enabled: boolean;
    count: number;
    criteria: 'type' | 'location' | 'price' | 'features';
    title: string;
    subtitle: string;
  };
  map: {
    showMap: boolean;
    showExactLocation: boolean;
    showNearbyPlaces: boolean;
    mapProvider: 'google' | 'mapbox' | 'openstreet';
  };
  actions: {
    showFavorite: boolean;
    showShare: boolean;
    showPrint: boolean;
    showScheduleVisit: boolean;
    showVirtualTour: boolean;
  };
}
export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  favicon: string;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
}

export interface Sections {
  showRentSale: boolean;
  showTeam: boolean;
  showProjects: boolean;
  showContact: boolean;
  showPartners: boolean;
  featuredCount: number;
  aboutUs: AboutUs;
  propertyTypes: PropertyTypes;
  contact: ContactConfig;
  partners: PartnersConfig;
  whyInvest?: WhyInvestConfig;
  howItWorks?: HowItWorksConfig;
  faq?: FAQConfig;
}

export interface TemplateConfig {
  templateId?: string;
  colors: Colors;
  typography: Typography;
  company: Company;
  hero: Hero;
  seo: SEOConfig;
  social: SocialMedia;
  sections: Sections;
  team?: TeamMember[];
  projects?: Project[];
  partners?: Partner[];
}

export interface SearchData {
  type: string;
  propertyType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}