'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateConfig } from '../../types';

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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
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
      
      // Altura aumentada para mejor visibilidad
      const desktopHeight = 50; // Aumentado de 40 a 50
      const desktopWidth = desktopHeight * aspectRatio;
      
      const mobileHeight = 44; // Aumentado de 36 a 44
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
            src={`${process.env.NEXT_PUBLIC_API_MEDIA}${logo.src}`}
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

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
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
      {/* Navbar con transparencia sutil */}
      <motion.nav 
        className={`sticky top-0 z-50 border-b border-gray-200 ${logoSizes.navbarPadding}`}
        style={{ 
          backgroundColor: hexToRgba(config.colors.background, 0.95),
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center min-h-[64px]">
            {/* Logo */}
            <motion.div 
              className="flex items-center min-w-0 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {renderLogo('desktop')}
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link 
                    href={item.href} 
                    className="relative transition-colors duration-200 text-sm xl:text-base py-2"
                    style={{ 
                      color: config.colors.textLight,
                      fontWeight: config.typography.fontWeight.normal
                    }}
                  >
                    <motion.span
                      whileHover={{ 
                        color: config.colors.primary,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {item.label}
                    </motion.span>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5"
                      style={{ backgroundColor: config.colors.primary }}
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
              
              {(menuConfig.showContactButton && !menuConfig.showContact) && (
                <motion.button 
                  onClick={handleContactClick}
                  className="px-5 xl:px-7 py-2.5 rounded-lg text-sm xl:text-base whitespace-nowrap shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{ 
                    backgroundColor: config.colors.primary,
                    color: adaptiveColors.primaryText,
                    fontWeight: config.typography.fontWeight.semibold
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: config.colors.primaryDark,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  Contactar
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 relative z-50 flex-shrink-0 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="h-7 w-7" style={{ color: config.colors.text }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon className="h-7 w-7" style={{ color: config.colors.text }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Fullscreen */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden flex flex-col"
            style={{ backgroundColor: config.colors.background }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link 
                      href={item.href} 
                      className="flex items-center space-x-4 py-4 px-4 rounded-xl transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
                      onClick={handleMenuItemClick}
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
                  </motion.div>
                );
              })}
              
              {(menuConfig.showContactButton && !menuConfig.showContact) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05, duration: 0.2 }}
                  className="pt-6"
                >
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
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 text-center border-t border-gray-100">
              <p 
                className="text-sm opacity-60"
                style={{ color: config.colors.textLight }}
              >
                Powered by Inmosite
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;