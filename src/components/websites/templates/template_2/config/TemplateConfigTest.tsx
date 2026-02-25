import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  BuildingOffice2Icon, 
  TruckIcon 
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../types';

export const templateConfig: TemplateConfig = {
  colors: {
    primary: '#6366f1',           // Indigo moderno
    primaryDark: '#4f46e5',       // Indigo profundo
    primaryLight: '#8b5cf6',      // Violeta claro
    secondary: '#06b6d4',         // Cyan moderno
    accent: '#4f46e5',            // Amber vibrante
    background: '#ffffff',        // Blanco puro
    surface: '#f8fafc',           // Gris muy claro
    text: '#0f172a',              // Slate oscuro
    textLight: '#64748b',         // Slate medio
    success: '#10b981',           // Emerald
    warning: '#f59e0b',           // Amber
    error: '#ef4444'              // Red moderno
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
        icon: <HomeIcon className="h-12 w-12 mx-auto text-indigo-500" />
      },
      apartments: {
        enabled: true,
        title: "Urban Lofts",
        description: "Lofts urbanos con espacios abiertos, techos altos y amenidades de lujo en el corazón de la ciudad.",
        icon: <BuildingOfficeIcon className="h-12 w-12 mx-auto text-cyan-500" />
      },
      lands: {
        enabled: true,
        title: "Development Lots",
        description: "Terrenos estratégicos en zonas de crecimiento con infraestructura tecnológica y servicios premium.",
        icon: <GlobeAltIcon className="h-12 w-12 mx-auto text-amber-500" />
      },
      offices: {
        enabled: true,
        title: "Flex Offices",
        description: "Espacios de trabajo flexibles con tecnología avanzada y diseño inspirador para equipos modernos.",
        icon: <BuildingOffice2Icon className="h-12 w-12 mx-auto text-indigo-600" />
      },
      fields: {
        enabled: true,
        title: "Mixed-Use Developments",
        description: "Desarrollos de uso mixto que integran vivienda, comercio y oficinas en ecosistemas urbanos inteligentes.",
        icon: <TruckIcon className="h-12 w-12 mx-auto text-cyan-600" />
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
    },
    {
      id: 3,
      name: "Sarah Johnson",
      position: "Digital Experience Lead",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b377?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "UX/UI Designer enfocada en plataformas inmobiliarias digitales y experiencias de cliente omnicanal."
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
    },
    {
      id: 2,
      name: "Vertical Gardens",
      location: "EcoTech Valley",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Torres residenciales con jardines verticales, sistemas hidropónicos y tecnología de purificación de aire.",
      status: "Pre-venta digital",
      deliveryDate: "Q3 2025"
    },
    {
      id: 3,
      name: "Flex Campus",
      location: "Creative District",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Campus de uso mixto con espacios flexibles que se adaptan mediante IA a las necesidades de residentes y trabajadores.",
      status: "Modelo piloto activo",
      deliveryDate: "Operando desde 2023"
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
    },
    {
      id: 3,
      name: "ModularBuild Co",
      logo: {
        type: 'image',
        src: 'https://via.placeholder.com/120x60/f59e0b/ffffff?text=MODULAR+BUILD',
        alt: 'ModularBuild Logo',
        width: 120,
        height: 60
      },
      category: "construccion",
      description: "Construcción modular con impresión 3D y materiales sustentables avanzados.",
      website: "https://modularbuild.co"
    },
    {
      id: 4,
      name: "PropNet Global",
      logo: {
        type: 'image',
        src: 'https://via.placeholder.com/120x60/06b6d4/ffffff?text=PROPNET',
        alt: 'PropNet Logo',
        width: 120,
        height: 60
      },
      category: "inmobiliaria",
      description: "Marketplace inmobiliario global con tours VR y transacciones blockchain.",
      website: "https://propnet.global"
    },
    {
      id: 5,
      name: "LegalChain",
      logo: {
        type: 'image',
        src: 'https://via.placeholder.com/120x60/8b5cf6/ffffff?text=LEGALCHAIN',
        alt: 'LegalChain Logo',
        width: 120,
        height: 60
      },
      category: "legal",
      description: "Contratos inteligentes y gestión legal automatizada para bienes raíces.",
      website: "https://legalchain.tech",
      featured: true
    },
    {
      id: 6,
      name: "CryptoMortgage",
      logo: {
        type: 'image',
        src: 'https://via.placeholder.com/120x60/ef4444/ffffff?text=CRYPTO+MORTGAGE',
        alt: 'CryptoMortgage Logo',
        width: 120,
        height: 60
      },
      category: "financiero",
      description: "Hipotecas respaldadas por criptomonedas y DeFi lending protocols.",
      website: "https://cryptomortgage.finance"
    },
    {
      id: 7,
      name: "SmartMove Logistics",
      logo: "🚀",
      category: "servicios",
      description: "Mudanzas robotizadas con drones y logística predictiva basada en IA.",
      website: "https://smartmove.tech"
    },
    {
      id: 8,
      name: "AR Interior Design",
      logo: "🔮",
      category: "servicios",
      description: "Diseño de interiores con realidad aumentada y personalización por IA.",
      website: "https://arinterior.design"
    }
  ]
};
