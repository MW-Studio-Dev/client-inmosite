// lib/website-transformer.ts
import React from 'react';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  BuildingOffice2Icon,
  GlobeAltIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';
import type { TemplateConfig } from '@/components/websites/templates/template_1/types';

// Mapeo de iconos desde strings a ReactNodes
const ICON_MAP: Record<string, React.ReactNode> = {
  'HomeIcon': React.createElement(HomeIcon, { className: 'w-6 h-6' }),
  'BuildingOfficeIcon': React.createElement(BuildingOfficeIcon, { className: 'w-6 h-6' }),
  'BuildingOffice2Icon': React.createElement(BuildingOffice2Icon, { className: 'w-6 h-6' }),
  'GlobeAltIcon': React.createElement(GlobeAltIcon, { className: 'w-6 h-6' }),
  'TruckIcon': React.createElement(TruckIcon, { className: 'w-6 h-6' }),
};

// Función para obtener icono desde string
function getIconFromString(iconName: string): React.ReactNode {
  return ICON_MAP[iconName] || React.createElement(HomeIcon, { className: 'w-6 h-6' });
}

// Función para transformar logo desde string o objeto
function transformLogo(logo: any): string | { type: 'image' | 'emoji'; src: string; alt?: string; width?: number; height?: number; } {
  if (typeof logo === 'string') {
    return logo;
  }
  
  if (logo && typeof logo === 'object') {
    return {
      type: logo.type || 'image',
      src: logo.src || logo.url || '',
      alt: logo.alt || '',
      width: logo.width || 120,
      height: logo.height || 40,
    };
  }
  
  return '';
}

// Función principal para transformar datos del backend al formato del frontend
export function transformBackendToFrontend(backendData: any): TemplateConfig {
  // Transformar colores
  const colors = {
    primary: backendData.colors?.primary || backendData.primary_color || '#6366f1',
    primaryDark: backendData.colors?.primaryDark || backendData.primary_dark_color || '#4f46e5',
    primaryLight: backendData.colors?.primaryLight || backendData.primary_light_color || '#8b5cf6',
    secondary: backendData.colors?.secondary || backendData.secondary_color || '#06b6d4',
    accent: backendData.colors?.accent || backendData.accent_color || '#4f46e5',
    background: backendData.colors?.background || backendData.background_color || '#ffffff',
    surface: backendData.colors?.surface || backendData.surface_color || '#f8fafc',
    text: backendData.colors?.text || backendData.text_color || '#0f172a',
    textLight: backendData.colors?.textLight || backendData.text_light_color || '#64748b',
    success: backendData.colors?.success || backendData.success_color || '#10b981',
    warning: backendData.colors?.warning || backendData.warning_color || '#f59e0b',
    error: backendData.colors?.error || backendData.error_color || '#ef4444',
  };

  // Transformar tipografía
  const typography = {
    fontFamily: backendData.typography?.fontFamily || backendData.font_family || 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: {
      light: backendData.typography?.fontWeight?.light || backendData.font_weight_light || '300',
      normal: backendData.typography?.fontWeight?.normal || backendData.font_weight_normal || '400',
      medium: backendData.typography?.fontWeight?.medium || backendData.font_weight_medium || '500',
      semibold: backendData.typography?.fontWeight?.semibold || backendData.font_weight_semibold || '600',
      bold: backendData.typography?.fontWeight?.bold || backendData.font_weight_bold || '700',
    },
    fontSize: {
      xs: backendData.typography?.fontSize?.xs || backendData.font_size_xs || '0.75rem',
      sm: backendData.typography?.fontSize?.sm || backendData.font_size_sm || '0.875rem',
      base: backendData.typography?.fontSize?.base || backendData.font_size_base || '1rem',
      lg: backendData.typography?.fontSize?.lg || backendData.font_size_lg || '1.125rem',
      xl: backendData.typography?.fontSize?.xl || backendData.font_size_xl || '1.25rem',
      '2xl': backendData.typography?.fontSize?.['2xl'] || backendData.font_size_2xl || '1.5rem',
      '3xl': backendData.typography?.fontSize?.['3xl'] || backendData.font_size_3xl || '1.875rem',
      '4xl': backendData.typography?.fontSize?.['4xl'] || backendData.font_size_4xl || '2.25rem',
    },
  };

  // Transformar información de la empresa
  const company = {
    name: backendData.company?.name || backendData.company_name || '',
    logo: transformLogo(backendData.company?.logo || backendData.logo),
    phone: backendData.company?.phone || backendData.company_phone || '',
    email: backendData.company?.email || backendData.company_email || '',
    address: backendData.company?.address || backendData.company_address || '',
    whatsapp: backendData.company?.whatsapp || backendData.company_whatsapp || '',
  };

  // Transformar hero section
  const hero = {
    title: backendData.hero?.title || backendData.hero_title || '',
    subtitle: backendData.hero?.subtitle || backendData.hero_subtitle || '',
    backgroundImage: backendData.hero?.backgroundImage || backendData.hero_image || '',
    ctaText: backendData.hero?.ctaText || backendData.hero_cta_text || 'Explorar propiedades',
    showSearchBar: backendData.hero?.showSearchBar ?? backendData.hero_show_search_bar ?? true,
  };

  // Transformar about us
  const aboutUs = {
    title: backendData.sections?.aboutUs?.title || backendData.about_title || '',
    description: backendData.sections?.aboutUs?.description || backendData.about_description || '',
  };

  // Transformar tipos de propiedades
  const propertyTypes = {
    houses: {
      enabled: backendData.sections?.propertyTypes?.houses?.enabled ?? backendData.property_types_houses_enabled ?? true,
      title: backendData.sections?.propertyTypes?.houses?.title || backendData.property_types_houses_title || 'Casas',
      description: backendData.sections?.propertyTypes?.houses?.description || backendData.property_types_houses_description || '',
      icon: getIconFromString(backendData.sections?.propertyTypes?.houses?.icon || backendData.property_types_houses_icon || 'HomeIcon'),
    },
    apartments: {
      enabled: backendData.sections?.propertyTypes?.apartments?.enabled ?? backendData.property_types_apartments_enabled ?? true,
      title: backendData.sections?.propertyTypes?.apartments?.title || backendData.property_types_apartments_title || 'Apartamentos',
      description: backendData.sections?.propertyTypes?.apartments?.description || backendData.property_types_apartments_description || '',
      icon: getIconFromString(backendData.sections?.propertyTypes?.apartments?.icon || backendData.property_types_apartments_icon || 'BuildingOfficeIcon'),
    },
    lands: {
      enabled: backendData.sections?.propertyTypes?.lands?.enabled ?? backendData.property_types_lands_enabled ?? true,
      title: backendData.sections?.propertyTypes?.lands?.title || backendData.property_types_lands_title || 'Terrenos',
      description: backendData.sections?.propertyTypes?.lands?.description || backendData.property_types_lands_description || '',
      icon: getIconFromString(backendData.sections?.propertyTypes?.lands?.icon || backendData.property_types_lands_icon || 'GlobeAltIcon'),
    },
    offices: {
      enabled: backendData.sections?.propertyTypes?.offices?.enabled ?? backendData.property_types_offices_enabled ?? true,
      title: backendData.sections?.propertyTypes?.offices?.title || backendData.property_types_offices_title || 'Oficinas',
      description: backendData.sections?.propertyTypes?.offices?.description || backendData.property_types_offices_description || '',
      icon: getIconFromString(backendData.sections?.propertyTypes?.offices?.icon || backendData.property_types_offices_icon || 'BuildingOffice2Icon'),
    },
    fields: {
      enabled: backendData.sections?.propertyTypes?.fields?.enabled ?? backendData.property_types_fields_enabled ?? true,
      title: backendData.sections?.propertyTypes?.fields?.title || backendData.property_types_fields_title || 'Campos',
      description: backendData.sections?.propertyTypes?.fields?.description || backendData.property_types_fields_description || '',
      icon: getIconFromString(backendData.sections?.propertyTypes?.fields?.icon || backendData.property_types_fields_icon || 'TruckIcon'),
    },
  };

  // Transformar configuración de contacto
  const contact = {
    title: backendData.sections?.contact?.title || backendData.contact_title || 'Contacto',
    subtitle: backendData.sections?.contact?.subtitle || backendData.contact_subtitle || '',
    info: {
      title: backendData.sections?.contact?.info?.title || backendData.contact_info_title || 'Información de Contacto',
      methods: {
        phone: {
          title: backendData.sections?.contact?.info?.methods?.phone?.title || backendData.contact_phone_title || 'Teléfono',
          action: backendData.sections?.contact?.info?.methods?.phone?.action || backendData.contact_phone_action || 'Llamar',
        },
        email: {
          title: backendData.sections?.contact?.info?.methods?.email?.title || backendData.contact_email_title || 'Email',
          action: backendData.sections?.contact?.info?.methods?.email?.action || backendData.contact_email_action || 'Enviar email',
        },
        whatsapp: {
          title: backendData.sections?.contact?.info?.methods?.whatsapp?.title || backendData.contact_whatsapp_title || 'WhatsApp',
          action: backendData.sections?.contact?.info?.methods?.whatsapp?.action || backendData.contact_whatsapp_action || 'Escribir',
          value: backendData.sections?.contact?.info?.methods?.whatsapp?.value || backendData.contact_whatsapp_value || 'Chat directo',
          message: backendData.sections?.contact?.info?.methods?.whatsapp?.message || backendData.contact_whatsapp_message || 'Hola, me interesa una propiedad',
        },
        office: {
          title: backendData.sections?.contact?.info?.methods?.office?.title || backendData.contact_office_title || 'Oficina',
          action: backendData.sections?.contact?.info?.methods?.office?.action || backendData.contact_office_action || 'Visitar',
        },
      },
      schedule: {
        title: backendData.sections?.contact?.info?.schedule?.title || backendData.schedule_title || 'Horarios',
        hours: backendData.sections?.contact?.info?.schedule?.hours || [
          {
            days: backendData.schedule_weekdays || 'Lunes - Viernes',
            hours: backendData.schedule_weekdays_hours || '9:00 AM - 6:00 PM',
          },
          {
            days: backendData.schedule_saturday || 'Sábado',
            hours: backendData.schedule_saturday_hours || '9:00 AM - 2:00 PM',
          },
          // {
          //   days: backendData.schedule_sunday || 'Domingo',
          //   hours: backendData.schedule_sunday_hours || 'Cerrado',
          // },
        ],
      },
    },
    form: {
      title: backendData.sections?.contact?.form?.title || backendData.contact_form_title || 'Envíanos un mensaje',
      fields: {
        name: {
          label: backendData.sections?.contact?.form?.fields?.name?.label || backendData.contact_form_name_label || 'Nombre',
          placeholder: backendData.sections?.contact?.form?.fields?.name?.placeholder || backendData.contact_form_name_placeholder || 'Tu nombre',
        },
        email: {
          label: backendData.sections?.contact?.form?.fields?.email?.label || backendData.contact_form_email_label || 'Email',
          placeholder: backendData.sections?.contact?.form?.fields?.email?.placeholder || backendData.contact_form_email_placeholder || 'tu@email.com',
        },
        phone: {
          label: backendData.sections?.contact?.form?.fields?.phone?.label || backendData.contact_form_phone_label || 'Teléfono',
          placeholder: backendData.sections?.contact?.form?.fields?.phone?.placeholder || backendData.contact_form_phone_placeholder || 'Tu teléfono',
        },
        propertyType: {
          label: backendData.sections?.contact?.form?.fields?.propertyType?.label || backendData.contact_form_property_type_label || 'Tipo de propiedad',
          placeholder: backendData.sections?.contact?.form?.fields?.propertyType?.placeholder || backendData.contact_form_property_type_placeholder || 'Selecciona un tipo',
          options: backendData.sections?.contact?.form?.fields?.propertyType?.options || backendData.contact_form_property_type_options || [
            { value: 'casa', label: 'Casa' },
            { value: 'apartamento', label: 'Apartamento' },
            { value: 'terreno', label: 'Terreno' },
            { value: 'oficina', label: 'Oficina' },
          ],
        },
        message: {
          label: backendData.sections?.contact?.form?.fields?.message?.label || backendData.contact_form_message_label || 'Mensaje',
          placeholder: backendData.sections?.contact?.form?.fields?.message?.placeholder || backendData.contact_form_message_placeholder || 'Tu mensaje',
        },
      },
      submitButton: backendData.sections?.contact?.form?.submitButton || backendData.contact_form_submit_button || 'Enviar',
    },
  };

  // Transformar configuración de partners
  const partners = {
    enabled: backendData.sections?.partners?.enabled ?? backendData.partners_enabled ?? true,
    title: backendData.sections?.partners?.title || backendData.partners_title || 'Nuestros Partners',
    subtitle: backendData.sections?.partners?.subtitle || backendData.partners_subtitle || '',
    categories: backendData.sections?.partners?.categories || backendData.partners_categories || {},
    carousel: {
      autoplay: backendData.sections?.partners?.carousel?.autoplay ?? backendData.partners_autoplay ?? true,
      autoplayDelay: backendData.sections?.partners?.carousel?.autoplayDelay || backendData.partners_autoplay_delay || 4000,
      showDots: backendData.sections?.partners?.carousel?.showDots ?? backendData.partners_show_dots ?? true,
      showArrows: backendData.sections?.partners?.carousel?.showArrows ?? backendData.partners_show_arrows ?? true,
    },
  };

  // Transformar secciones
  const sections = {
    showRentSale: backendData.sections?.showRentSale ?? backendData.show_rent_sale ?? true,
    showTeam: backendData.sections?.showTeam ?? backendData.show_team ?? false,
    showProjects: backendData.sections?.showProjects ?? backendData.show_projects ?? true,
    showContact: backendData.sections?.showContact ?? backendData.show_contact ?? true,
    showPartners: backendData.sections?.showPartners ?? backendData.show_partners ?? true,
    featuredCount: backendData.sections?.featuredCount || backendData.featured_count || 3,
    aboutUs,
    propertyTypes,
    contact,
    partners,
  };

  // Transformar team members
  const team = backendData.team?.map((member: any) => ({
    id: member.id,
    name: member.name,
    position: member.position,
    image: member.image || member.photo,
    description: member.description || member.bio,
  })) || [];

  // Transformar projects
  const projects = backendData.projects?.map((project: any) => ({
    id: project.id,
    name: project.name,
    location: project.location,
    image: project.image,
    description: project.description,
    status: project.status,
    deliveryDate: project.deliveryDate || project.delivery_date,
  })) || [];

  // Transformar partners
  const partnersArray = backendData.partners?.map((partner: any) => ({
    id: partner.id,
    name: partner.name,
    logo: transformLogo(partner.logo),
    category: partner.category,
    description: partner.description,
    website: partner.website,
    featured: partner.featured || partner.is_featured,
  })) || [];

  // Configuración final
  const templateConfig: TemplateConfig = {
    colors,
    typography,
    company,
    hero,
    sections,
    team,
    projects,
    partners: partnersArray,
  };

  return templateConfig;
}

// Función auxiliar para debug - comparar datos
export function debugDataTransformation(backendData: any, frontendData: TemplateConfig) {
  console.group('🔄 Website Data Transformation Debug');
  
  console.log('📥 Backend Data:', {
    companyName: backendData.company?.name || backendData.company_name,
    heroTitle: backendData.hero?.title || backendData.hero_title,
    colorsCount: Object.keys(backendData.colors || {}).length,
    sectionsEnabled: {
      showTeam: backendData.sections?.showTeam ?? backendData.show_team,
      showProjects: backendData.sections?.showProjects ?? backendData.show_projects,
      showPartners: backendData.sections?.showPartners ?? backendData.show_partners,
    },
    teamCount: backendData.team?.length || 0,
    projectsCount: backendData.projects?.length || 0,
    partnersCount: backendData.partners?.length || 0,
  });
  
  console.log('📤 Frontend Data:', {
    companyName: frontendData.company.name,
    heroTitle: frontendData.hero.title,
    colorsCount: Object.keys(frontendData.colors).length,
    sectionsEnabled: {
      showTeam: frontendData.sections.showTeam,
      showProjects: frontendData.sections.showProjects,
      showPartners: frontendData.sections.showPartners,
    },
    teamCount: frontendData.team?.length || 0,
    projectsCount: frontendData.projects?.length || 0,
    partnersCount: frontendData.partners?.length || 0,
  });
  
  console.groupEnd();
}

// Función para validar que los datos transformados están completos
export function validateTransformedData(templateConfig: TemplateConfig): boolean {
  const errors: string[] = [];
  
  if (!templateConfig.company.name) {
    errors.push('Company name is missing');
  }
  
  if (!templateConfig.hero.title) {
    errors.push('Hero title is missing');
  }
  
  if (!templateConfig.colors.primary) {
    errors.push('Primary color is missing');
  }
  
  if (!templateConfig.typography.fontFamily) {
    errors.push('Font family is missing');
  }
  
  if (errors.length > 0) {
    console.error('❌ Template validation errors:', errors);
    return false;
  }
  
  console.log('✅ Template validation passed');
  return true;
}