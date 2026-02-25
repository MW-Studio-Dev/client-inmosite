'use client';

import React from 'react';
import { TemplateConfig } from './types';
import { useDynamicStyles } from './hooks/useDynamicStyles';


import {
  RentSaleSection,
  CallToAction,
  ProjectsSection,
  TeamSection,
  HeroSection,
  FeaturedProperties,
  AboutUsSection,
  PartnersSection,
  Contact
} from './sections/landing';
import HowItWorksSection from './sections/landing/HowItWorks';
import FAQSection from './sections/landing/FAQ';
import WhyInvestSection from './sections/landing/WhyInvest';
// Interface para las props del componente
interface RealEstateTemplateProps {
  templateConfig: TemplateConfig;
  subdomain: string;
}

const RealEstateTemplate: React.FC<RealEstateTemplateProps> = ({
  templateConfig,
  subdomain
}) => {
  // Usar el hook personalizado para estilos dinámicos con el config recibido por props
  const { adaptiveColors } = useDynamicStyles(templateConfig);
  console.log('secccion de partners', templateConfig.sections.showPartners)
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: templateConfig.colors.background }}>



      {/* Sección hero principal con fondo de imagen */}
      <HeroSection config={templateConfig} adaptiveColors={adaptiveColors} />

      {/* Emprendimientos/Proyectos (condicional) */}
      {templateConfig.sections.showProjects && (
        <ProjectsSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}

      {/* Propiedades destacadas */}
      <FeaturedProperties
        config={templateConfig}
        subdomain={subdomain}
        adaptiveColors={adaptiveColors}
      />

      {/* Equipo (condicional) */}
      {templateConfig.sections.showTeam && (
        <TeamSection config={templateConfig} />
      )}

      {/* Sección de tipos de propiedades (condicional) */}
      {templateConfig.sections.showRentSale && (
        <RentSaleSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}

      {templateConfig.sections.whyInvest?.enabled && (
        <WhyInvestSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}

      {/* Llamada a la acción */}
      <CallToAction config={templateConfig} adaptiveColors={adaptiveColors} />

      {templateConfig.sections.howItWorks?.enabled && (
        <HowItWorksSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}

      {/* Sobre nosotros */}
      <AboutUsSection config={templateConfig} />

      {templateConfig.sections.faq?.enabled && (
        <FAQSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}

      {/* Partners (condicional) */}
      {templateConfig.sections.showPartners && (
        <PartnersSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}

      {/* Contacto (condicional) */}
      {templateConfig.sections.showContact && (
        <Contact config={templateConfig} adaptiveColors={adaptiveColors} />
      )}




    </div>
  );
};

export default RealEstateTemplate;
