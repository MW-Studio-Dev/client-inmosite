'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';

interface FooterProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const Footer: React.FC<FooterProps> = ({ config, adaptiveColors }) => {
  // Función para renderizar el logo
  const renderLogo = () => {
    const logo = config.company.logo;
    
    // Si es string, es un emoji
    if (typeof logo === 'string') {
      return (
        <span className="text-6xl mr-4">
          {logo}
        </span>
      );
    }
    
    // Si es objeto, es configuración de imagen
    if (typeof logo === 'object' && logo.type === 'image') {
      // Validar que logo.src no esté vacío - NO renderizar Image si está vacío
      if (!logo.src || logo.src.trim() === '' || logo.src === '/') {
        // Retornar fallback sin logging en producción para evitar spam en consola
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Footer: Logo src está vacío, usando fallback emoji');
        }
        return <span className="text-6xl mr-4">🏢</span>;
      }

      const logoUrl = `${process.env.NEXT_PUBLIC_API_MEDIA}${logo.src}`;

      return (
        <div className="relative h-20 w-600 mr-4">
          <Image
            src={logoUrl}
            alt={config.company.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      );
    }
    
    // Fallback
    return <span className="text-6xl mr-4">🏢</span>;
  }

  const navigationLinks = [
    { href: "#home", label: "Inicio" },
    { href: "/#properties", label: "Propiedades" },
    ...(config.sections.showProjects ? [{ href: "/developments", label: "Emprendimientos" }] : []),
    { href: "/#nosotros", label: "Nosotros" },
    ...(config.sections.showTeam ? [{ href: "/#equipo", label: "Equipo" }] : []),
    { href: "/#contacto", label: "Contacto" }
  ];

  const serviceLinks = [
    { href: "/properties?operationType=sale", label: "Venta de Propiedades" },
    { href: "/properties?operationType=#", label: "Alquiler de Propiedades" },
    { href: "/warranty", label: "Garantías" }
  ];

  return (
    <footer className="py-8 sm:py-12 md:py-16" style={{ backgroundColor: config.colors.accent }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Información de la empresa */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              {renderLogo()}
            </div>
            <p
              className="mb-4 leading-relaxed text-sm sm:text-base"
              style={{
                color: adaptiveColors.accentText + 'CC',
                fontWeight: config.typography.fontWeight.normal
              }}
            >
             {config.sections.aboutUs.description}
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4
              className="text-base sm:text-lg mb-3 sm:mb-4"
              style={{
                color: adaptiveColors.accentText,
                fontWeight: config.typography.fontWeight.semibold
              }}
            >
              Navegación
            </h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:opacity-100"
                    style={{ color: adaptiveColors.accentText + 'CC' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = adaptiveColors.accentText}
                    onMouseLeave={(e) => e.currentTarget.style.color = adaptiveColors.accentText + 'CC'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4
              className="text-base sm:text-lg mb-3 sm:mb-4"
              style={{
                color: adaptiveColors.accentText,
                fontWeight: config.typography.fontWeight.semibold
              }}
            >
              Servicios
            </h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:opacity-100"
                    style={{ color: adaptiveColors.accentText + 'CC' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = adaptiveColors.accentText}
                    onMouseLeave={(e) => e.currentTarget.style.color = adaptiveColors.accentText + 'CC'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4
              className="text-base sm:text-lg mb-3 sm:mb-4"
              style={{
                color: adaptiveColors.accentText,
                fontWeight: config.typography.fontWeight.semibold
              }}
            >
              Contacto
            </h4>
            <div className="space-y-3">
              <div 
                className="flex items-center"
                style={{ color: adaptiveColors.accentText + 'CC' }}
              >
                <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <a 
                  href={`tel:${config.company.phone}`}
                  className="hover:opacity-100 transition-opacity"
                  style={{ color: 'inherit' }}
                >
                  {config.company.phone}
                </a>
              </div>
              <div 
                className="flex items-center"
                style={{ color: adaptiveColors.accentText + 'CC' }}
              >
                <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <a 
                  href={`mailto:${config.company.email}`}
                  className="hover:opacity-100 transition-opacity"
                  style={{ color: 'inherit' }}
                >
                  {config.company.email}
                </a>
              </div>
              <div 
                className="flex items-start"
                style={{ color: adaptiveColors.accentText + 'CC' }}
              >
                <MapPinIcon className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(config.company.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 transition-opacity"
                  style={{ color: 'inherit' }}
                >
                  {config.company.address}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright y Powered by */}
        <div 
          className="border-t mt-8 pt-8"
          style={{ borderColor: adaptiveColors.accentText + '30' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              style={{ 
                color: adaptiveColors.accentText + '80',
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              © 2025 {config.company.name}. Todos los derechos reservados.
            </p>
            <p 
              className="text-sm"
              style={{ 
                color: adaptiveColors.accentText + '60',
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              Powered by{' '}
              <a 
                href="https://inmosite.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity"
                style={{ 
                  color: adaptiveColors.accentText,
                  fontWeight: config.typography.fontWeight.semibold
                }}
              >
                iNMOSITE
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;