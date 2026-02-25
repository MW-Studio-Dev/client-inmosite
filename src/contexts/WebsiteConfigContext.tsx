'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TemplateConfig } from '@/components/websites/templates/template_1/types';

interface WebsiteConfigResponse {
  success: boolean;
  message: string;
  data: {
    templateId?: string;
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

  const safeData = apiData || {} as any;

  return {
    templateId: safeData.templateId || 'template_1',
    colors: {
      primary: safeData.colors?.primary || '',
      primaryDark: safeData.colors?.primaryDark || '',
      primaryLight: safeData.colors?.primaryLight || '',
      secondary: safeData.colors?.secondary || '',
      accent: safeData.colors?.accent || '',
      background: safeData.colors?.background || '',
      surface: safeData.colors?.surface || '',
      text: safeData.colors?.text || '',
      textLight: safeData.colors?.textLight || '',
      success: safeData.colors?.success || '',
      warning: safeData.colors?.warning || '',
      error: safeData.colors?.error || '',
    },
    typography: {
      fontFamily: safeData.typography?.fontFamily || '',
      fontWeight: safeData.typography?.fontWeight || {},
      fontSize: safeData.typography?.fontSize || {},
    },
    company: {
      name: safeData.company?.name || '',
      logo: {
        type: 'image' as const,
        src: safeData.company?.logo?.src || '',
        alt: safeData.company?.logo?.alt || '',
        width: safeData.company?.logo?.width || 0,
        height: safeData.company?.logo?.height || 0,
      },
      phone: safeData.company?.phone || '',
      email: safeData.company?.email || '',
      address: safeData.company?.address || '',
      whatsapp: safeData.company?.whatsapp || '',
    },
    hero: {
      title: safeData.hero?.title || '',
      subtitle: safeData.hero?.subtitle || '',
      backgroundImage: safeData.hero?.backgroundImage || '',
      ctaText: safeData.hero?.ctaText || '',
      showSearchBar: safeData.hero?.showSearchBar || false,
      backgroundVideoUrl: safeData.hero?.backgroundVideoUrl || '',
    },
    sections: {
      showRentSale: safeData.sections?.showRentSale || false,
      showTeam: safeData.sections?.showTeam || false,
      showProjects: safeData.sections?.showProjects || false,
      showContact: safeData.sections?.showContact || false,
      showPartners: safeData.sections?.showPartners || false,
      featuredCount: safeData.sections?.featuredCount || 6,
      aboutUs: {
        title: safeData.sections?.aboutUs?.title || '',
        description: safeData.sections?.aboutUs?.description || '',
        yearsExperience: safeData.sections?.aboutUs?.yearsExperience || 0,
        propertiesSold: safeData.sections?.aboutUs?.propertiesSold || 0,
        phrases: safeData.sections?.aboutUs?.phrases || [],
        image: safeData.sections?.aboutUs?.image || null,
      },
      propertyTypes: {
        houses: {
          enabled: safeData.sections?.propertyTypes?.houses?.enabled || false,
          title: safeData.sections?.propertyTypes?.houses?.title || '',
          description: safeData.sections?.propertyTypes?.houses?.description || '',
          icon: getPropertyTypeIcon('houses'),
        },
        apartments: {
          enabled: safeData.sections?.propertyTypes?.apartments?.enabled || false,
          title: safeData.sections?.propertyTypes?.apartments?.title || '',
          description: safeData.sections?.propertyTypes?.apartments?.description || '',
          icon: getPropertyTypeIcon('apartments'),
        },
        lands: {
          enabled: safeData.sections?.propertyTypes?.lands?.enabled || false,
          title: safeData.sections?.propertyTypes?.lands?.title || '',
          description: safeData.sections?.propertyTypes?.lands?.description || '',
          icon: getPropertyTypeIcon('lands'),
        },
        offices: {
          enabled: safeData.sections?.propertyTypes?.offices?.enabled || false,
          title: safeData.sections?.propertyTypes?.offices?.title || '',
          description: safeData.sections?.propertyTypes?.offices?.description || '',
          icon: getPropertyTypeIcon('offices'),
        },
        fields: {
          enabled: safeData.sections?.propertyTypes?.fields?.enabled || false,
          title: safeData.sections?.propertyTypes?.fields?.title || '',
          description: safeData.sections?.propertyTypes?.fields?.description || '',
          icon: getPropertyTypeIcon('fields'),
        },
      },
      contact: {
        title: safeData.sections?.contact?.title || '',
        subtitle: safeData.sections?.contact?.subtitle || '',
        info: {
          title: safeData.sections?.contact?.info?.title || '',
          methods: {
            phone: {
              title: safeData.sections?.contact?.info?.methods?.phone?.title || '',
              action: safeData.sections?.contact?.info?.methods?.phone?.action || '',
            },
            email: {
              title: safeData.sections?.contact?.info?.methods?.email?.title || '',
              action: safeData.sections?.contact?.info?.methods?.email?.action || '',
            },
            whatsapp: {
              title: safeData.sections?.contact?.info?.methods?.whatsapp?.title || '',
              value: safeData.sections?.contact?.info?.methods?.whatsapp?.value || '',
              action: safeData.sections?.contact?.info?.methods?.whatsapp?.action || '',
              message: safeData.sections?.contact?.info?.methods?.whatsapp?.message || '',
            },
            office: {
              title: safeData.sections?.contact?.info?.methods?.office?.title || '',
              action: safeData.sections?.contact?.info?.methods?.office?.action || '',
            },
          },
          schedule: {
            title: safeData.sections?.contact?.info?.schedule?.title || '',
            hours: safeData.sections?.contact?.info?.schedule?.hours || '',
          },
        },
        form: {
          title: safeData.sections?.contact?.form?.title || '',
          fields: {
            name: {
              label: safeData.sections?.contact?.form?.fields?.name?.label || '',
              placeholder: safeData.sections?.contact?.form?.fields?.name?.placeholder || '',
            },
            email: {
              label: safeData.sections?.contact?.form?.fields?.email?.label || '',
              placeholder: safeData.sections?.contact?.form?.fields?.email?.placeholder || '',
            },
            phone: {
              label: safeData.sections?.contact?.form?.fields?.phone?.label || '',
              placeholder: safeData.sections?.contact?.form?.fields?.phone?.placeholder || '',
            },
            propertyType: {
              label: safeData.sections?.contact?.form?.fields?.propertyType?.label || '',
              placeholder: safeData.sections?.contact?.form?.fields?.propertyType?.placeholder || '',
              options: safeData.sections?.contact?.form?.fields?.propertyType?.options || [],
            },
            message: {
              label: safeData.sections?.contact?.form?.fields?.message?.label || '',
              placeholder: safeData.sections?.contact?.form?.fields?.message?.placeholder || '',
            },
          },
          submitButton: safeData.sections?.contact?.form?.submitButton || '',
        },
      },
      partners: {
        enabled: safeData.sections?.partners?.enabled || false,
        title: safeData.sections?.partners?.title || '',
        subtitle: safeData.sections?.partners?.subtitle || '',
        categories: safeData.sections?.partners?.categories || [],
        carousel: safeData.sections?.partners?.carousel || false,
      },
      faq: safeData.sections?.faq || {
        enabled: false,
        title: '',
        subtitle: '',
        questions: [],
      },
      howItWorks: safeData.sections?.howItWorks || {
        enabled: false,
        title: '',
        subtitle: '',
        description: '',
        image: '',
      },
      whyInvest: safeData.sections?.whyInvest || {
        enabled: false,
        title: '',
        subtitle: '',
        description: '',
        image: '',
      },
    },
    team: safeData.team || [],
    projects: safeData.projects || [],
    partners: safeData.partners || [],
    seo: safeData.seo || {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      favicon: '',
    },
    social: safeData.social || {
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

      const response = await fetch(`${apiUrl}/websites/public/${subdomain}/`, {
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

        const response = await fetch(`${apiUrl}/websites/public/${subdomain}/`, {
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
