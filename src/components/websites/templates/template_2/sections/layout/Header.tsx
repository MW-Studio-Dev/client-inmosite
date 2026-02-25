'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  RocketLaunchIcon,
  PhoneIcon,
  NewspaperIcon,
  HomeIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';
import { getCurrentDomainClient } from '@/lib/getCurrentDomainClient';



interface MenuItemConfig {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  condition?: keyof TemplateConfig['sections'];
}

interface NavbarProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
  subdomain?: string;
  menuConfig?: {
    showHome?: boolean;
    showProperties?: boolean;
    showProjects?: boolean;
    showAbout?: boolean;
    showTeam?: boolean;
    showContact?: boolean;
    showContactButton?: boolean;
  };
}

const Navbar: React.FC<NavbarProps> = ({
  config,
  adaptiveColors,
  subdomain,
  menuConfig = {
    showHome: true,
    showProperties: true,
    showProjects: true,
    showAbout: true,
    showTeam: true,
    showContact: true,
    showContactButton: true
  }
}) => {
 
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Manejar el overflow del body cuando el menú móvil está abierto
  useEffect(() => {
    if (typeof window !== 'undefined' && document && document.body) {
      try {
        if (isMenuOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
      } catch (error) {
        console.warn('Error al modificar overflow del body:', error);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && document && document.body) {
        try {
          document.body.style.overflow = 'unset';
        } catch (error) {
          console.warn('Error al restaurar overflow del body:', error);
        }
      }
    };
  }, [isMenuOpen]);


  const logoSizes = useMemo(() => {
    const logo = config.company.logo;

    if (typeof logo === 'string') {
      return {
        desktop: { width: 64, height: 64, maxHeight: 72 },
        tablet: { width: 56, height: 56, maxHeight: 64 },
        mobile: { width: 48, height: 48, maxHeight: 56 },
        navbarPadding: 'py-2 sm:py-2.5 lg:py-3'
      };
    }

    if (typeof logo === 'object' && logo.type === 'image') {
      const originalWidth = logo.width || 48;
      const originalHeight = logo.height || 48;

      const aspectRatio = originalWidth / originalHeight;

      // Desktop (lg y superior)
      const desktopHeight = 100;
      const desktopWidth = desktopHeight * aspectRatio;

      // Tablet (md)
      const tabletHeight = 75;
      const tabletWidth = tabletHeight * aspectRatio;

      // Mobile (sm y inferior)
      const mobileHeight = 60;
      const mobileWidth = mobileHeight * aspectRatio;

      const navbarPadding = 'py-1.5 sm:py-2 lg:py-2.5';

      return {
        desktop: { width: desktopWidth, height: desktopHeight, maxHeight: 100 },
        tablet: { width: tabletWidth, height: tabletHeight, maxHeight: 75 },
        mobile: { width: mobileWidth, height: mobileHeight, maxHeight: 60 },
        navbarPadding
      };
    }

    return {
      desktop: { width: 64, height: 64, maxHeight: 72 },
      tablet: { width: 56, height: 56, maxHeight: 64 },
      mobile: { width: 48, height: 48, maxHeight: 56 },
      navbarPadding: 'py-2 sm:py-2.5 lg:py-3'
    };
  }, [config.company.logo]);

  const renderLogo = (context: 'navbar' | 'mobile-menu' = 'navbar') => {
    const logo = config.company.logo;

    if (typeof logo === 'string') {
      return (
        <span
          className={`flex items-center justify-center font-bold ${
            context === 'navbar'
              ? 'text-2xl sm:text-3xl lg:text-4xl'
              : 'text-xl sm:text-2xl'
          }`}
          style={{ lineHeight: 1 }}
        >
          {logo}
        </span>
      );
    }

    if (typeof logo === 'object' && logo.type === 'image') {
      if (!logo.src || logo.src.trim() === '' || logo.src === '/') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Logo src está vacío o inválido, usando fallback emoji');
        }
        return <span className="text-2xl">🏢</span>;
      }

      const logoUrl = `${process.env.NEXT_PUBLIC_API_MEDIA}${logo.src}`;

      // Usar diferentes tamaños según el contexto
      if (context === 'navbar') {
        return (
          <div className="relative flex items-center justify-center h-[60px] sm:h-[75px] lg:h-[100px] w-auto">
            <Image
              src={logoUrl}
              alt={logo.alt || config.company.name}
              width={logoSizes.desktop.width}
              height={logoSizes.desktop.height}
              className="object-contain w-auto h-full"
              style={{
                maxHeight: '100%',
                imageRendering: 'crisp-edges',
                backgroundColor: 'transparent'
              }}
              priority
              quality={100}
              unoptimized={logo.src.endsWith('.png') || logo.src.endsWith('.svg')}
              sizes="(max-width: 640px) 60px, (max-width: 1024px) 75px, 100px"
            />
          </div>
        );
      } else {
        // Mobile menu logo
        return (
          <div className="relative flex items-center justify-center h-[50px] sm:h-[60px] w-auto">
            <Image
              src={logoUrl}
              alt={logo.alt || config.company.name}
              width={logoSizes.mobile.width}
              height={logoSizes.mobile.height}
              className="object-contain w-auto h-full"
              style={{
                maxHeight: '100%',
                imageRendering: 'crisp-edges',
                backgroundColor: 'transparent'
              }}
              priority
              quality={100}
              unoptimized={logo.src.endsWith('.png') || logo.src.endsWith('.svg')}
              sizes="(max-width: 640px) 50px, 60px"
            />
          </div>
        );
      }
    }

    return <span className="text-2xl">🏢</span>;
  };

  // Construir la base URL con el dominio actual (obtenido del cliente)
  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    const domain = getCurrentDomainClient();
    setBaseUrl(domain);
  }, []);

  // Helper para construir URLs, usando URLs relativas si baseUrl aún no está disponible
  const buildUrl = (path: string) => {
    if (!baseUrl) return path;
    return `${baseUrl}${path}`;
  };

  // Menu items para desktop (solo páginas principales)
  const desktopMenuItems: MenuItemConfig[] = [
    {
      href: buildUrl('/properties'),
      label: "Propiedades",
      icon: BuildingOfficeIcon,
      enabled: menuConfig.showProperties || false
    },
    {
      href: buildUrl('/developments'),
      label: "Emprendimientos",
      icon: RocketLaunchIcon,
      enabled: (menuConfig.showProjects || false) && (config.sections.showProjects || false)
    },
    {
      href: "/blogs",
      label: "Blogs",
      icon: NewspaperIcon,
      enabled: false
    }
  ];

  // Menu items para mobile (incluye todas las opciones)
  const mobileMenuItems: MenuItemConfig[] = [
    {
      href: baseUrl || "/",
      label: "Inicio",
      icon: HomeIcon,
      enabled: menuConfig.showHome !== false
    },
    {
      href: buildUrl('/properties'),
      label: "Propiedades",
      icon: BuildingOfficeIcon,
      enabled: menuConfig.showProperties || false
    },
    {
      href: buildUrl('/developments'),
      label: "Emprendimientos",
      icon: RocketLaunchIcon,
      enabled: (menuConfig.showProjects || false) && (config.sections.showProjects || false)
    },
    {
      href: baseUrl ? `${baseUrl}#nosotros` : '#nosotros',
      label: "Nosotros",
      icon: UserGroupIcon,
      enabled: menuConfig.showAbout !== false
    }
  ];

  const filteredDesktopMenuItems = desktopMenuItems.filter(item => item.enabled);
  const filteredMobileMenuItems = mobileMenuItems.filter(item => item.enabled);

  const handleContactClick = () => {
    setIsMenuOpen(false);
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMenuItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    console.log('CLICK en menú:', href);

    // Cerrar menú
    setIsMenuOpen(false);

    // Restaurar scroll de forma segura
    if (typeof window !== 'undefined' && document.body) {
      document.body.style.overflow = 'unset';
    }

    // Si tiene hash, manejar scroll
    if (href.includes('#')) {
      console.log('Es navegación con hash');
      e.preventDefault();
      const hash = href.split('#')[1];
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState({}, '', href);
      }
    }
  };

  // Función para convertir hex a rgba con transparencia sutil
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .navbar-animate {
          animation: slideDown 0.5s ease-out;
        }

        .mobile-menu-enter {
          animation: fadeIn 0.2s ease-out;
        }

        .mobile-menu-item {
          animation: slideInFromRight 0.3s ease-out;
        }

        .hover-underline {
          position: relative;
        }

        .hover-underline::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          transition: width 0.2s ease-out;
        }

        .hover-underline:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Navbar con transparencia sutil */}
      <nav
        className={`navbar-animate sticky top-0 z-50 ${logoSizes.navbarPadding}`}
        style={{
          backgroundColor: hexToRgba(config.colors.background, 0.95),
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex lg:grid lg:grid-cols-3 justify-between items-center min-h-[70px] sm:min-h-[85px] lg:min-h-[110px]">
            {/* Logo - Izquierda */}
            <div className="flex items-center min-w-0 flex-shrink-0 transition-transform duration-200 hover:scale-105">
              {renderLogo('navbar')}
            </div>

            {/* Desktop Menu - Centro */}
            <div className="hidden lg:flex items-center justify-center space-x-8 xl:space-x-10">
              {filteredDesktopMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover-underline relative transition-colors duration-200 text-sm xl:text-base py-2"
                  style={{
                    color: config.colors.textLight,
                    fontWeight: config.typography.fontWeight.medium
                  }}
                  onClick={(e) => handleMenuItemClick(e, item.href)}
                >
                  <span className="hover:opacity-80 transition-opacity duration-200">
                    {item.label}
                  </span>
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-200 hover:w-full"
                    style={{ backgroundColor: config.colors.primary }}
                  />
                </Link>
              ))}
            </div>

            {/* Botón de contacto - Derecha (Desktop) / Mobile Menu Button */}
            <div className="flex items-center justify-end">
              {/* Botón de contacto - Solo Desktop */}
              <button
                onClick={handleContactClick}
                className="hidden lg:block px-6 xl:px-8 py-2.5 rounded-lg text-sm xl:text-base whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText,
                  fontWeight: config.typography.fontWeight.semibold
                }}
              >
                Contacto
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 relative z-50 flex-shrink-0 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-7 w-7 transition-transform duration-200" style={{ color: config.colors.text }} />
                ) : (
                  <Bars3Icon className="h-7 w-7 transition-transform duration-200" style={{ color: config.colors.text }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen */}
      {isMenuOpen && (
        <div
          className="mobile-menu-enter fixed inset-0 z-40 lg:hidden flex flex-col"
          style={{ backgroundColor: config.colors.background }}
        >
          {/* Header del menú móvil */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 min-h-[80px]">
            <div className="flex items-center">
              {renderLogo('mobile-menu')}
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2.5 rounded-full transition-colors duration-200 hover:bg-gray-100"
              style={{ backgroundColor: config.colors.surface }}
            >
              <XMarkIcon className="h-7 w-7" style={{ color: config.colors.text }} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
            {filteredMobileMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.href}
                  className="mobile-menu-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-4 py-4 px-4 rounded-xl transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
                    onClick={(e) => handleMenuItemClick(e, item.href)}
                  >
                    <IconComponent
                      className="h-6 w-6 flex-shrink-0"
                      style={{ color: config.colors.primary }}
                    />
                    <span
                      className="text-lg"
                      style={{
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.medium
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              );
            })}

            {/* Botón de contacto - Siempre visible en mobile */}
            <div className="pt-6">
              <button
                onClick={handleContactClick}
                className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-lg shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200"
                style={{
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText,
                  fontWeight: config.typography.fontWeight.semibold
                }}
              >
                <PhoneIcon className="h-5 w-5" />
                <span>Contacto</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 text-center border-t border-gray-100">
            <p
              className="text-sm opacity-60"
              style={{ color: config.colors.textLight }}
            >
              Powered by iNMOSITE
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
