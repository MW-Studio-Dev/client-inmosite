'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TemplateConfig } from '@/components/websites/templates/template_1/types';
import RealEstateTemplate from '@/components/websites/templates/template_1';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  BuildingOffice2Icon, 
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

// Tu configuración inicial corregida con todas las propiedades requeridas
const initialConfig: TemplateConfig = {
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#4f46e5',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textLight: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  typography: {
    fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
  },
  company: {
    name: "ModernSpace Realty",
    logo: {
      type: 'image',
      src: '/logo-modern.png',
      alt: 'ModernSpace Realty Logo',
      width: 120,
      height: 40
    },
    phone: "+1 (555) 123-4567",
    email: "hello@modernspace.com",
    address: "456 Innovation District, Tech City",
    whatsapp: "5551234567"
  },
  hero: {
    title: "El futuro de vivir comienza aquí",
    subtitle: "Descubre espacios inteligentes y modernos diseñados para el estilo de vida contemporáneo. Tecnología, sostenibilidad y diseño se encuentran en cada propiedad.",
    backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    ctaText: "Explorar propiedades",
    showSearchBar: true 
  },
  sections: {
    showRentSale: true,
    showTeam: false,
    showProjects: true,
    showContact: true,
    showPartners: true,
    featuredCount: 3,
    aboutUs: {
      title: "Redefiniendo el concepto de hogar moderno",
      description: "Somos pioneros en desarrollo inmobiliario inteligente. Creamos espacios que combinan tecnología de vanguardia, diseño sostenible y funcionalidad moderna para el estilo de vida del siglo XXI."
    },
    propertyTypes: {
      houses: {
        enabled: true,
        title: "Smart Homes",
        description: "Viviendas inteligentes con domótica integrada, eficiencia energética y diseño minimalista contemporáneo.",
        icon: "HomeIcon"
      },
      apartments: {
        enabled: true,
        title: "Urban Lofts",
        description: "Lofts urbanos con espacios abiertos, techos altos y amenidades de lujo en el corazón de la ciudad.",
        icon: "BuildingOfficeIcon"
      },
      lands: {
        enabled: true,
        title: "Development Lots",
        description: "Terrenos estratégicos en zonas de crecimiento con infraestructura tecnológica y servicios premium.",
        icon: "GlobeAltIcon"
      },
      offices: {
        enabled: true,
        title: "Flex Offices",
        description: "Espacios de trabajo flexibles con tecnología avanzada y diseño inspirador para equipos modernos.",
        icon: "BuildingOffice2Icon"
      },
      fields: {
        enabled: true,
        title: "Mixed-Use Developments",
        description: "Desarrollos de uso mixto que integran vivienda, comercio y oficinas en ecosistemas urbanos inteligentes.",
        icon: "TruckIcon"
      }
    },
    contact: {
      title: "¿Listo para el futuro inmobiliario?",
      subtitle: "Conecta con nuestro equipo de expertos en PropTech y descubre cómo la tecnología está transformando la forma de vivir y trabajar.",
      
      info: {
        title: "Canales de Comunicación",
        methods: {
          phone: {
            title: "Llamada Directa",
            action: "Llamar ahora"
          },
          email: {
            title: "Email Digital", 
            action: "Enviar mensaje"
          },
          whatsapp: {
            title: "WhatsApp Business",
            value: "Chat en tiempo real",
            action: "Iniciar conversación",
            message: "¡Hola! Me interesa conocer más sobre sus propiedades inteligentes y tecnológicas. ¿Pueden ayudarme?"
          },
          office: {
            title: "Showroom Digital",
            action: "Agendar visita"
          }
        },
        
        schedule: {
          title: "Horarios de Atención",
          hours: [
            {
              days: "Lunes - Viernes",
              hours: "8:00 AM - 7:00 PM"
            },
            {
              days: "Sábado", 
              hours: "9:00 AM - 5:00 PM"
            },
            {
              days: "Domingo",
              hours: "Tours virtuales 24/7"
            }
          ]
        }
      },
      
      form: {
        title: "Conecta con Nosotros",
        fields: {
          name: {
            label: "Nombre Completo *",
            placeholder: "Tu nombre"
          },
          email: {
            label: "Email *", 
            placeholder: "tu@email.com"
          },
          phone: {
            label: "Teléfono",
            placeholder: "Tu número"
          },
          propertyType: {
            label: "Tipo de interés",
            placeholder: "Selecciona una opción",
            options: [
              { value: "smart-home", label: "Smart Home" },
              { value: "urban-loft", label: "Urban Loft" },
              { value: "flex-office", label: "Flex Office" },
              { value: "investment", label: "Inversión" }
            ]
          },
          message: {
            label: "Mensaje *",
            placeholder: "Cuéntanos sobre tu proyecto ideal..."
          }
        },
        submitButton: "Enviar Consulta"
      }
    },
    partners: {
      enabled: true,
      title: "Ecosistema de Partners Tecnológicos",
      subtitle: "Colaboramos con las empresas más innovadoras para ofrecerte una experiencia inmobiliaria completamente digital y moderna.",
      categories: {
        inmobiliaria: {
          title: "PropTech Partners",
          description: "Plataformas inmobiliarias digitales de vanguardia"
        },
        financiero: {
          title: "FinTech Solutions",
          description: "Soluciones financieras digitales y criptomonedas"
        },
        seguro: {
          title: "InsurTech Coverage",
          description: "Seguros digitales con IA y cobertura inteligente"
        },
        construccion: {
          title: "Smart Construction",
          description: "Construcción modular y tecnologías sustentables"
        },
        legal: {
          title: "LegalTech Services",
          description: "Servicios legales digitalizados y contratos inteligentes"
        }
      },
      carousel: {
        autoplay: true,
        autoplayDelay: 4000,
        showDots: true,
        showArrows: true
      }
    }
  },
  team: [
    {
      id: 1,
      name: "Alexandra Chen",
      position: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Ingeniera en sistemas especializada en PropTech, IoT residencial y experiencias digitales inmobiliarias."
    },
    {
      id: 2,
      name: "David Kim",
      position: "Head of Smart Development",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Arquitecto y urbanista especializado en ciudades inteligentes, edificios sustentables y tecnología integrada."
    }
  ],
  projects: [
    {
      id: 1,
      name: "Neo District",
      location: "Innovation Quarter",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Distrito tecnológico con edificios inteligentes, infraestructura 5G y sistemas de energía renovable integrados.",
      status: "Smart living disponible",
      deliveryDate: "Conectado desde 2024"
    }
  ],
  partners: [
    {
      id: 1,
      name: "TechBank Digital",
      logo: {
        type: 'image',
        src: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=TECHBANK',
        alt: 'TechBank Logo',
        width: 120,
        height: 60
      },
      category: "financiero",
      description: "Hipotecas digitales con IA, cripto-payments y procesos 100% online.",
      website: "https://techbank.digital",
      featured: true
    },
    {
      id: 2,
      name: "SafeGuard AI",
      logo: {
        type: 'image',
        src: 'https://via.placeholder.com/120x60/10b981/ffffff?text=SAFEGUARD+AI',
        alt: 'SafeGuard AI Logo',
        width: 120,
        height: 60
      },
      category: "seguro",
      description: "Seguros inteligentes con sensores IoT y ajuste automático de primas.",
      website: "https://safeguard-ai.com",
      featured: true
    }
  ]
};

// Router simulado
interface NavigationState {
  currentPage: string;
  params?: { [key: string]: string };
  history: string[];
  historyIndex: number;
}

const useSimulatedRouter = () => {
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPage: '/',
    params: {},
    history: ['/'],
    historyIndex: 0
  });

  const navigate = useCallback((path: string, params?: { [key: string]: string }) => {
    setNavigation(prev => {
      const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), path];
      return {
        currentPage: path,
        params: params || {},
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setNavigation(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          currentPage: prev.history[newIndex],
          historyIndex: newIndex,
          params: {}
        };
      }
      return prev;
    });
  }, []);

  const goForward = useCallback(() => {
    setNavigation(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          currentPage: prev.history[newIndex],
          historyIndex: newIndex,
          params: {}
        };
      }
      return prev;
    });
  }, []);

  const refresh = useCallback(() => {
    setNavigation(prev => ({ ...prev }));
  }, []);

  return {
    navigation,
    navigate,
    goBack,
    goForward,
    refresh,
    canGoBack: navigation.historyIndex > 0,
    canGoForward: navigation.historyIndex < navigation.history.length - 1
  };
};

// Componente que intercepta navegación
const NavigationInterceptor: React.FC<{
  children: React.ReactNode;
  onNavigate: (path: string, params?: any) => void;
  currentPage: string;
}> = ({ children, onNavigate, currentPage }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        // Solo interceptar enlaces internos (que no empiecen con http)
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          e.preventDefault();
          e.stopPropagation();
          
          // Parsear parámetros de la URL si es necesario
          const [path, search] = href.split('?');
          const params: { [key: string]: string } = {};
          
          if (search) {
            new URLSearchParams(search).forEach((value, key) => {
              params[key] = value;
            });
          }
          
          onNavigate(path, params);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick, true);
      return () => container.removeEventListener('click', handleClick, true);
    }
  }, [onNavigate]);

  // Scroll al top cuando cambia la página
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [currentPage]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto">
      {children}
    </div>
  );
};

const NavigablePreviewEditor: React.FC = () => {
  const [config, setConfig] = useState<TemplateConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<string>('colors');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const router = useSimulatedRouter();

  const updateConfig = (path: string, value: any): void => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const getViewportStyles = (): React.CSSProperties => {
    switch (viewportSize) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          margin: '20px auto',
          border: '8px solid #1f2937',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '1024px',
          margin: '20px auto',
          border: '6px solid #374151',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        };
      case 'desktop':
      default:
        return {
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        };
    }
  };

  const getViewportClass = (): string => {
    switch (viewportSize) {
      case 'mobile':
        return 'responsive-mobile';
      case 'tablet':
        return 'responsive-tablet';
      case 'desktop':
      default:
        return 'responsive-desktop';
    }
  };

  const getCurrentUrl = () => {
    const baseUrl = `${config.company.name.toLowerCase().replace(/\s+/g, '-')}.localhost:3000`;
    return `https://${baseUrl}${router.navigation.currentPage}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel de Formulario con Resize */}
      <div 
        className={`bg-white shadow-lg overflow-auto transition-all duration-300 ${
          sidebarExpanded ? 'w-80' : 'w-16'
        }`}
      >
        {/* Header con botón de resize */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          {sidebarExpanded && <h2 className="text-xl font-bold">Editor templateConfig</h2>}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
            title={sidebarExpanded ? "Contraer panel" : "Expandir panel"}
          >
            {sidebarExpanded ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Contenido del panel - solo visible cuando está expandido */}
        {sidebarExpanded && (
          <div className="p-6">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {['colors', 'typography', 'company', 'hero', 'sections'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm rounded capitalize ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Formularios por tab */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Colores</h3>
                {Object.entries(config.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <label className="w-20 text-sm capitalize">{key}</label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateConfig(`colors.${key}`, e.target.value)}
                      className="w-10 h-8 rounded"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateConfig(`colors.${key}`, e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Tipografía</h3>
                <div>
                  <label className="block text-sm mb-1">Font Family</label>
                  <select
                    value={config.typography.fontFamily}
                    onChange={(e) => updateConfig('typography.fontFamily', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option>Poppins, -apple-system, BlinkMacSystemFont, sans-serif</option>
                    <option>Inter, -apple-system, BlinkMacSystemFont, sans-serif</option>
                    <option>Roboto, -apple-system, BlinkMacSystemFont, sans-serif</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Empresa</h3>
                <div>
                  <label className="block text-sm mb-1">Nombre</label>
                  <input
                    type="text"
                    value={config.company.name}
                    onChange={(e) => updateConfig('company.name', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={config.company.phone}
                    onChange={(e) => updateConfig('company.phone', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={config.company.email}
                    onChange={(e) => updateConfig('company.email', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Dirección</label>
                  <input
                    type="text"
                    value={config.company.address}
                    onChange={(e) => updateConfig('company.address', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Hero</h3>
                <div>
                  <label className="block text-sm mb-1">Título</label>
                  <input
                    type="text"
                    value={config.hero.title}
                    onChange={(e) => updateConfig('hero.title', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Subtítulo</label>
                  <textarea
                    value={config.hero.subtitle}
                    onChange={(e) => updateConfig('hero.subtitle', e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={config.hero.ctaText}
                    onChange={(e) => updateConfig('hero.ctaText', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.hero.showSearchBar}
                    onChange={(e) => updateConfig('hero.showSearchBar', e.target.checked)}
                  />
                  <label className="text-sm">Mostrar barra de búsqueda</label>
                </div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Secciones</h3>
                {Object.entries(config.sections).filter(([key]) => key.startsWith('show')).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) => updateConfig(`sections.${key}`, e.target.checked)}
                    />
                    <label className="text-sm capitalize">{key.replace('show', 'Mostrar ')}</label>
                  </div>
                ))}
                <div>
                  <label className="block text-sm mb-1">Featured Count</label>
                  <input
                    type="number"
                    value={config.sections.featuredCount}
                    onChange={(e) => updateConfig('sections.featuredCount', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            {/* Exportar */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  console.log('templateConfig:', JSON.stringify(config, null, 2));
                  navigator.clipboard?.writeText(JSON.stringify(config, null, 2));
                  alert('templateConfig copiado al portapapeles');
                }}
                className="w-full px-4 py-3 bg-green-500 text-white rounded font-semibold hover:bg-green-600"
              >
                Exportar templateConfig
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel Preview */}
      <div className="flex-1 flex flex-col">
        {/* Header del Preview con controles de navegador */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Browser Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={router.goBack}
                disabled={!router.canGoBack}
                className={`p-2 rounded ${router.canGoBack ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                title="Atrás"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={router.goForward}
                disabled={!router.canGoForward}
                className={`p-2 rounded ${router.canGoForward ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                title="Adelante"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={router.refresh}
                className="p-2 rounded hover:bg-gray-700"
                title="Actualizar"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </div>

            {/* URL Bar */}
            <div className="flex-1 bg-white text-black px-4 py-2 rounded-lg text-sm max-w-md">
              {getCurrentUrl()}
            </div>
          </div>
          
          {/* Controles de Vista */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 mr-3">Vista:</span>
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-2 rounded-lg transition-colors ${
                viewportSize === 'mobile'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Vista Móvil (375px)"
            >
              <DevicePhoneMobileIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-2 rounded-lg transition-colors ${
                viewportSize === 'tablet'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Vista Tablet (768px)"
            >
              <DeviceTabletIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-2 rounded-lg transition-colors ${
                viewportSize === 'desktop'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Vista Desktop (100%)"
            >
              <ComputerDesktopIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenedor del Preview */}
        <div className="flex-1 bg-gray-100 overflow-auto">          
          <div style={getViewportStyles()} className={getViewportClass()}>
            <NavigationInterceptor 
              onNavigate={router.navigate}
              currentPage={router.navigation.currentPage}
            >
              <div className="w-full">
                {/* Aplicar estilos responsive condicionalmente */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    ${viewportSize === 'mobile' ? `
                      .responsive-mobile .hidden { display: none !important; }
                      .responsive-mobile .md\\:flex,
                      .responsive-mobile .lg\\:flex,
                      .responsive-mobile .xl\\:flex { display: none !important; }
                      .responsive-mobile .md\\:hidden,
                      .responsive-mobile .lg\\:hidden,
                      .responsive-mobile .xl\\:hidden { display: block !important; }
                      .responsive-mobile .md\\:grid,
                      .responsive-mobile .lg\\:grid { display: block !important; }
                      .responsive-mobile .grid-cols-2,
                      .responsive-mobile .grid-cols-3,
                      .responsive-mobile .grid-cols-4 { 
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important; 
                      }
                      .responsive-mobile .md\\:text-4xl,
                      .responsive-mobile .md\\:text-5xl,
                      .responsive-mobile .lg\\:text-4xl,
                      .responsive-mobile .lg\\:text-5xl { 
                        font-size: 2.25rem !important; 
                        line-height: 2.5rem !important; 
                      }
                      .responsive-mobile .md\\:text-xl,
                      .responsive-mobile .lg\\:text-xl { 
                        font-size: 1.125rem !important; 
                        line-height: 1.75rem !important; 
                      }
                      .responsive-mobile .md\\:px-8,
                      .responsive-mobile .lg\\:px-8 { 
                        padding-left: 1rem !important; 
                        padding-right: 1rem !important; 
                      }
                      .responsive-mobile .md\\:py-20,
                      .responsive-mobile .lg\\:py-20 { 
                        padding-top: 3rem !important; 
                        padding-bottom: 3rem !important; 
                      }
                      .responsive-mobile .max-w-6xl,
                      .responsive-mobile .max-w-4xl { 
                        max-width: 100% !important; 
                        padding-left: 1rem !important; 
                        padding-right: 1rem !important; 
                      }
                    ` : ''}
                    
                    ${viewportSize === 'tablet' ? `
                      .responsive-tablet .md\\:flex { display: flex !important; }
                      .responsive-tablet .md\\:hidden { display: none !important; }
                      .responsive-tablet .md\\:grid { display: grid !important; }
                      .responsive-tablet .md\\:text-4xl,
                      .responsive-tablet .md\\:text-5xl { 
                        font-size: 3rem !important; 
                        line-height: 1 !important; 
                      }
                      .responsive-tablet .lg\\:flex { display: none !important; }
                      .responsive-tablet .lg\\:hidden { display: block !important; }
                      .responsive-tablet .grid-cols-3 { 
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important; 
                      }
                    ` : ''}
                  `
                }} />
                <RealEstateTemplate templateConfig={config} />
              </div>
            </NavigationInterceptor>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigablePreviewEditor;