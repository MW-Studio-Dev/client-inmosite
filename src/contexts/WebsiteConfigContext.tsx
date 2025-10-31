'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TemplateConfig } from '@/components/websites/templates/template_1/types';

interface WebsiteConfigResponse {
  success: boolean;
  message: string;
  data: {
    colors: {
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
    };
    typography: {
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
    };
    company: {
      name: string;
      logo: {
        type: string;
        src: string;
        alt: string;
        width: number;
        height: number;
      };
      phone: string;
      email: string;
      address: string;
      whatsapp: string;
    };
    hero: {
      title: string;
      subtitle: string;
      backgroundImage: string;
      ctaText: string;
      showSearchBar: boolean;
      backgroundVideoUrl?: string;
    };
    sections: any;
    team: any[];
    projects: any[];
    partners: any[];
    seo?: {
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string;
      favicon: string;
    };
    social?: {
      facebook: string;
      instagram: string;
      linkedin: string;
      tiktok: string;
      youtube: string;
    };
  };
  meta: any;
  timestamp: string;
  request_id: string;
}

interface WebsiteConfigContextType {
  config: TemplateConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const WebsiteConfigContext = createContext<WebsiteConfigContextType | undefined>(undefined);

interface WebsiteConfigProviderProps {
  children: ReactNode;
  subdomain: string;
}

// Función para transformar los datos de la API al formato del template
function transformApiDataToTemplateConfig(apiData: WebsiteConfigResponse['data']): TemplateConfig {
  const getPropertyTypeIcon = (key: string) => {
    const iconMap: Record<string, string> = {
      houses: 'HomeIcon',
      apartments: 'BuildingOfficeIcon',
      lands: 'GlobeAltIcon',
      offices: 'BuildingOffice2Icon',
      fields: 'TruckIcon'
    };
    return iconMap[key] || 'HomeIcon';
  };

  return {
    colors: {
      primary: apiData.colors.primary,
      primaryDark: apiData.colors.primaryDark,
      primaryLight: apiData.colors.primaryLight,
      secondary: apiData.colors.secondary,
      accent: apiData.colors.accent,
      background: apiData.colors.background,
      surface: apiData.colors.surface,
      text: apiData.colors.text,
      textLight: apiData.colors.textLight,
      success: apiData.colors.success,
      warning: apiData.colors.warning,
      error: apiData.colors.error,
    },
    typography: {
      fontFamily: apiData.typography.fontFamily,
      fontWeight: apiData.typography.fontWeight,
      fontSize: apiData.typography.fontSize,
    },
    company: {
      name: apiData.company.name,
      logo: {
        type: 'image' as const,
        src: apiData.company.logo.src,
        alt: apiData.company.logo.alt,
        width: apiData.company.logo.width,
        height: apiData.company.logo.height,
      },
      phone: apiData.company.phone,
      email: apiData.company.email,
      address: apiData.company.address,
      whatsapp: apiData.company.whatsapp,
    },
    hero: {
      title: apiData.hero.title,
      subtitle: apiData.hero.subtitle,
      backgroundImage: apiData.hero.backgroundImage,
      ctaText: apiData.hero.ctaText,
      showSearchBar: apiData.hero.showSearchBar,
      backgroundVideoUrl: apiData.hero.backgroundVideoUrl,
    },
    sections: {
      showRentSale: apiData.sections.showRentSale,
      showTeam: apiData.sections.showTeam,
      showProjects: apiData.sections.showProjects,
      showContact: apiData.sections.showContact,
      showPartners: apiData.sections.showPartners,
      featuredCount: apiData.sections.featuredCount,
      aboutUs: {
        title: apiData.sections.aboutUs.title,
        description: apiData.sections.aboutUs.description,
        yearsExperience: apiData.sections.aboutUs.yearsExperience,
        propertiesSold: apiData.sections.aboutUs.propertiesSold,
        phrases: apiData.sections.aboutUs.phrases || [],
        image: apiData.sections.aboutUs.image || null,
      },
      propertyTypes: {
        houses: {
          enabled: apiData.sections.propertyTypes.houses.enabled,
          title: apiData.sections.propertyTypes.houses.title,
          description: apiData.sections.propertyTypes.houses.description,
          icon: getPropertyTypeIcon('houses'),
        },
        apartments: {
          enabled: apiData.sections.propertyTypes.apartments.enabled,
          title: apiData.sections.propertyTypes.apartments.title,
          description: apiData.sections.propertyTypes.apartments.description,
          icon: getPropertyTypeIcon('apartments'),
        },
        lands: {
          enabled: apiData.sections.propertyTypes.lands.enabled,
          title: apiData.sections.propertyTypes.lands.title,
          description: apiData.sections.propertyTypes.lands.description,
          icon: getPropertyTypeIcon('lands'),
        },
        offices: {
          enabled: apiData.sections.propertyTypes.offices.enabled,
          title: apiData.sections.propertyTypes.offices.title,
          description: apiData.sections.propertyTypes.offices.description,
          icon: getPropertyTypeIcon('offices'),
        },
        fields: {
          enabled: apiData.sections.propertyTypes.fields.enabled,
          title: apiData.sections.propertyTypes.fields.title,
          description: apiData.sections.propertyTypes.fields.description,
          icon: getPropertyTypeIcon('fields'),
        },
      },
      contact: {
        title: apiData.sections.contact.title,
        subtitle: apiData.sections.contact.subtitle,
        info: {
          title: apiData.sections.contact.info.title,
          methods: {
            phone: {
              title: apiData.sections.contact.info.methods.phone.title,
              action: apiData.sections.contact.info.methods.phone.action,
            },
            email: {
              title: apiData.sections.contact.info.methods.email.title,
              action: apiData.sections.contact.info.methods.email.action,
            },
            whatsapp: {
              title: apiData.sections.contact.info.methods.whatsapp.title,
              value: apiData.sections.contact.info.methods.whatsapp.value,
              action: apiData.sections.contact.info.methods.whatsapp.action,
              message: apiData.sections.contact.info.methods.whatsapp.message,
            },
            office: {
              title: apiData.sections.contact.info.methods.office.title,
              action: apiData.sections.contact.info.methods.office.action,
            },
          },
          schedule: {
            title: apiData.sections.contact.info.schedule.title,
            hours: apiData.sections.contact.info.schedule.hours,
          },
        },
        form: {
          title: apiData.sections.contact.form.title,
          fields: {
            name: {
              label: apiData.sections.contact.form.fields.name.label,
              placeholder: apiData.sections.contact.form.fields.name.placeholder,
            },
            email: {
              label: apiData.sections.contact.form.fields.email.label,
              placeholder: apiData.sections.contact.form.fields.email.placeholder,
            },
            phone: {
              label: apiData.sections.contact.form.fields.phone.label,
              placeholder: apiData.sections.contact.form.fields.phone.placeholder,
            },
            propertyType: {
              label: apiData.sections.contact.form.fields.propertyType.label,
              placeholder: apiData.sections.contact.form.fields.propertyType.placeholder,
              options: apiData.sections.contact.form.fields.propertyType.options,
            },
            message: {
              label: apiData.sections.contact.form.fields.message.label,
              placeholder: apiData.sections.contact.form.fields.message.placeholder,
            },
          },
          submitButton: apiData.sections.contact.form.submitButton,
        },
      },
      partners: {
        enabled: apiData.sections.partners.enabled,
        title: apiData.sections.partners.title,
        subtitle: apiData.sections.partners.subtitle,
        categories: apiData.sections.partners.categories,
        carousel: apiData.sections.partners.carousel,
      },
    },
    team: apiData.team || [],
    projects: apiData.projects || [],
    partners: apiData.partners || [],
    seo: apiData.seo || {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      favicon: '',
    },
    social: apiData.social || {
      facebook: '',
      instagram: '',
      linkedin: '',
      tiktok: '',
      youtube: '',
    },
  };
}

export const WebsiteConfigProvider: React.FC<WebsiteConfigProviderProps> = ({ children, subdomain }) => {
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/websites/configs/public/${subdomain}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: WebsiteConfigResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error al obtener configuración');
      }

      const transformedConfig = transformApiDataToTemplateConfig(data.data);
      setConfig(transformedConfig);

    } catch (err: any) {
      console.error('[WebsiteConfigContext] Error fetching website config:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      if (!subdomain || !isMounted) return;

      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/websites/configs/public/${subdomain}/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: WebsiteConfigResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Error al obtener configuración');
        }

        if (isMounted) {
          const transformedConfig = transformApiDataToTemplateConfig(data.data);
          setConfig(transformedConfig);
        }

      } catch (err: any) {
        console.error('[WebsiteConfigContext] Error fetching website config:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, [subdomain]); // Solo depende de subdomain, NO de refetch

  const value: WebsiteConfigContextType = {
    config,
    loading,
    error,
    refetch
  };

  return (
    <WebsiteConfigContext.Provider value={value}>
      {children}
    </WebsiteConfigContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useWebsiteConfigContext = (): WebsiteConfigContextType => {
  const context = useContext(WebsiteConfigContext);
  if (context === undefined) {
    throw new Error('useWebsiteConfigContext must be used within a WebsiteConfigProvider');
  }
  return context;
};

export default WebsiteConfigContext;
