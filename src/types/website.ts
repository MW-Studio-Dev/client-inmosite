// types/website.ts

export interface PropertyTypeConfig {
  enabled: boolean;
  title: string;
  description: string;
  icon: string;
}

export interface PropertyTypeOptions {
  value: string;
  label: string;
}

export interface PartnerCategory {
  title: string;
  description: string;
}

export interface WebsiteConfig {
  id?: string;

  // Template & Colors
  template: string;
  primary_color: string;
  primary_dark_color: string;
  primary_light_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  text_light_color: string;
  success_color: string;
  warning_color: string;
  error_color: string;

  // Typography
  font_family: string;
  font_weight_light: string;
  font_weight_normal: string;
  font_weight_medium: string;
  font_weight_semibold: string;
  font_weight_bold: string;

  // Company Info
  company_name: string;
  company_logo_width: number;
  company_logo_height: number;
  company_phone: string;
  company_email: string;
  company_address: string;
  company_whatsapp: string;

  // Hero Section
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_show_search_bar: boolean;
  hero_background_video_url: string;

  // About Section
  about_title: string;
  about_description: string;
  about_years_experience: number;
  about_properties_sold: number;
  about_phrase_1: string;
  about_phrase_2: string;
  about_phrase_3: string;

  // Property Types
  property_types_houses_enabled: boolean;
  property_types_houses_title: string;
  property_types_houses_description: string;
  property_types_houses_icon: string;

  property_types_apartments_enabled: boolean;
  property_types_apartments_title: string;
  property_types_apartments_description: string;
  property_types_apartments_icon: string;

  property_types_lands_enabled: boolean;
  property_types_lands_title: string;
  property_types_lands_description: string;
  property_types_lands_icon: string;

  property_types_offices_enabled: boolean;
  property_types_offices_title: string;
  property_types_offices_description: string;
  property_types_offices_icon: string;

  property_types_fields_enabled: boolean;
  property_types_fields_title: string;
  property_types_fields_description: string;
  property_types_fields_icon: string;

  // Contact Section
  contact_title: string;
  contact_subtitle: string;
  contact_info_title: string;
  contact_phone_title: string;
  contact_phone_action: string;
  contact_email_title: string;
  contact_email_action: string;
  contact_whatsapp_title: string;
  contact_whatsapp_value: string;
  contact_whatsapp_action: string;
  contact_whatsapp_message: string;
  contact_office_title: string;
  contact_office_action: string;

  // Schedule
  schedule_title: string;
  schedule_weekdays: string;
  schedule_weekdays_hours: string;
  schedule_saturday: string;
  schedule_saturday_hours: string;
  schedule_sunday: string;
  schedule_sunday_hours: string;

  // Contact Form
  contact_form_title: string;
  contact_form_name_label: string;
  contact_form_name_placeholder: string;
  contact_form_email_label: string;
  contact_form_email_placeholder: string;
  contact_form_phone_label: string;
  contact_form_phone_placeholder: string;
  contact_form_property_type_label: string;
  contact_form_property_type_placeholder: string;
  contact_form_message_label: string;
  contact_form_message_placeholder: string;
  contact_form_submit_button: string;
  contact_form_property_type_options: PropertyTypeOptions[];

  // Partners
  partners_enabled: boolean;
  partners_title: string;
  partners_subtitle: string;
  partners_autoplay: boolean;
  partners_autoplay_delay: number;
  partners_show_dots: boolean;
  partners_show_arrows: boolean;
  partners_categories: Record<string, PartnerCategory>;

  // Visibility
  show_rent_sale: boolean;
  show_team: boolean;
  show_projects: boolean;
  show_contact: boolean;
  show_partners: boolean;
  featured_count: number;

  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  // Social Media
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  tiktok_url: string;
  youtube_url: string;

  // Publishing
  is_published: boolean;
  google_analytics_id: string;
  facebook_pixel_id: string;

  // Metadata
  created_at?: string;
  updated_at?: string;
  subdomain?: string;
  custom_domain?: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  preview_image?: string;
  is_active: boolean;
}

export interface PublishRequest {
  is_published: boolean;
  custom_domain?: string;
}

export interface WebsiteConfigSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: string[];
}
