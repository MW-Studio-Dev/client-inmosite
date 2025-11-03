'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  StarIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('Navbar');

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
  debug.render({ pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR' }, 'Header.tsx', 59);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // MOUNT/UNMOUNT tracking
  useEffect(() => {
    debug.mount('Header.tsx', 65);
    return () => {
      debug.unmount('Header.tsx', 67);
    };
  }, []);

  // Cerrar menú cuando cambia la ruta (navegación)
  useEffect(() => {
    debug.effect('pathname-change', { pathname, prevOpen: isMenuOpen }, 'Header.tsx', 73);
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [pathname]);

  // Cleanup: cerrar menú cuando el componente se desmonte
  useEffect(() => {
    debug.effect('cleanup-setup', undefined, 'Header.tsx', 80);
    return () => {
      debug.track('cleanup-execute', undefined, 'Header.tsx', 82);
      setIsMenuOpen(false);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    debug.effect('resize-listener-setup', undefined, 'Header.tsx', 89);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        debug.track('resize-close-menu', { width: window.innerWidth }, 'Header.tsx', 92);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      debug.track('resize-listener-cleanup', undefined, 'Header.tsx', 99);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    debug.effect('menu-overflow', { isMenuOpen }, 'Header.tsx', 105);
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      debug.track('overflow-cleanup', undefined, 'Header.tsx', 114);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const logoSizes = useMemo(() => {
    const logo = config.company.logo;

    if (typeof logo === 'string') {
      return {
        desktop: { width: 56, height: 56, maxHeight: 72 },
        mobile: { width: 48, height: 48, maxHeight: 64 },
        navbarPadding: 'py-4'
      };
    }

    if (typeof logo === 'object' && logo.type === 'image') {
      const originalWidth = logo.width || 48;
      const originalHeight = logo.height || 48;

      const aspectRatio = originalWidth / originalHeight;

      const desktopHeight = 50;
      const desktopWidth = desktopHeight * aspectRatio;

      const mobileHeight = 44;
      const mobileWidth = mobileHeight * aspectRatio;

      const navbarPadding = 'py-4';

      return {
        desktop: { width: desktopWidth, height: desktopHeight, maxHeight: 50 },
        mobile: { width: mobileWidth, height: mobileHeight, maxHeight: 44 },
        navbarPadding
      };
    }

    return {
      desktop: { width: 56, height: 56, maxHeight: 72 },
      mobile: { width: 48, height: 48, maxHeight: 64 },
      navbarPadding: 'py-4'
    };
  }, [config.company.logo]);

  const renderLogo = (size: 'desktop' | 'mobile' = 'desktop') => {
    const logo = config.company.logo;
    const sizes = logoSizes[size];

    if (typeof logo === 'string') {
      return (
        <span
          className="flex items-center justify-center font-bold"
          style={{
            fontSize: size === 'desktop' ? '1.875rem' : '1.5rem',
            lineHeight: 1
          }}
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

      return (
        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${sizes.width}px`,
            height: `${sizes.height}px`,
            maxHeight: `${sizes.maxHeight}px`,
          }}
        >
          <Image
            src={logoUrl}
            alt={logo.alt || config.company.name}
            width={sizes.width}
            height={sizes.height}
            className="object-contain w-full h-full"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              imageRendering: 'crisp-edges',
              backgroundColor: 'transparent'
            }}
            priority
            quality={100}
            unoptimized={logo.src.endsWith('.png') || logo.src.endsWith('.svg')}
            sizes={size === 'desktop' ? '(max-width: 1024px) 120px, 180px' : '120px'}
          />
        </div>
      );
    }

    return <span className="text-2xl">🏢</span>;
  };

  const baseMenuItems: MenuItemConfig[] = [
    {
      href: "/",
      label: "Inicio",
      icon: HomeIcon,
      enabled: menuConfig.showHome || false
    },
    {
      href: "/properties",
      label: "Propiedades",
      icon: BuildingOfficeIcon,
      enabled: menuConfig.showProperties || false
    },
    {
      href: "/developments",
      label: "Emprendimientos",
      icon: RocketLaunchIcon,
      enabled: (menuConfig.showProjects || false) && (config.sections.showProjects || false)
    },
    {
      href: "/#nosotros",
      label: "Nosotros",
      icon: UserGroupIcon,
      enabled: menuConfig.showAbout || false
    },
    {
      href: "/#equipo",
      label: "Equipo",
      icon: StarIcon,
      enabled: (menuConfig.showTeam || false) && (config.sections.showTeam || false)
    },
    {
      href: "/#contacto",
      label: "Contacto",
      icon: PhoneIcon,
      enabled: menuConfig.showContact || false
    }
  ];

  const menuItems = baseMenuItems.filter(item => item.enabled);

  const handleContactClick = () => {
    setIsMenuOpen(false);
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMenuItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    debug.track('handleMenuItemClick', { href, isMenuOpen }, 'Header.tsx', 270);

    // Cerrar menú inmediatamente
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
    debug.track('menu-closed', { href }, 'Header.tsx', 275);

    // Si el href contiene un hash, manejar el scroll manualmente
    if (href.includes('#')) {
      debug.track('hash-navigation', { href }, 'Header.tsx', 279);
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
        className={`navbar-animate sticky top-0 z-50 border-b border-gray-200 ${logoSizes.navbarPadding}`}
        style={{
          backgroundColor: hexToRgba(config.colors.background, 0.95),
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center min-h-[64px]">
            {/* Logo */}
            <div className="flex items-center min-w-0 flex-shrink-0 transition-transform duration-200 hover:scale-105">
              {renderLogo('desktop')}
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover-underline relative transition-colors duration-200 text-sm xl:text-base py-2"
                  style={{
                    color: config.colors.textLight,
                    fontWeight: config.typography.fontWeight.normal
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

              {(menuConfig.showContactButton && !menuConfig.showContact) && (
                <button
                  onClick={handleContactClick}
                  className="px-5 xl:px-7 py-2.5 rounded-lg text-sm xl:text-base whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: config.colors.primary,
                    color: adaptiveColors.primaryText,
                    fontWeight: config.typography.fontWeight.semibold
                  }}
                >
                  Contactar
                </button>
              )}
            </div>

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
              {renderLogo('mobile')}
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
            {menuItems.map((item, index) => {
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

            {(menuConfig.showContactButton && !menuConfig.showContact) && (
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
                  <span>Contactar</span>
                </button>
              </div>
            )}
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
