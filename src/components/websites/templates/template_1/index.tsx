'use client';

import React from 'react';
import { TemplateConfig } from './types';
import { useDynamicStyles } from './hooks/useDynamicStyles';

// Importar todos los componentes

import { RentSaleSection,
         CallToAction,
         ProjectsSection,
         TeamSection,
         HeroSection,
         WhatsAppButton,
         FeaturedProperties,
         AboutUsSection,
         PartnersSection,
         Contact 
        } from './sections/landing';  
import { Navbar,TopHeader,Footer } from './sections/layout'
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
  console.log('secccion de partners',templateConfig.sections.showPartners)
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: templateConfig.colors.background }}>


      
      {/* Sección hero principal con fondo de imagen */}
      <HeroSection config={templateConfig} adaptiveColors={adaptiveColors} />
      
      {/* Propiedades destacadas */}
      <FeaturedProperties 
        config={templateConfig} 
        subdomain={subdomain}
        adaptiveColors={adaptiveColors} 
      />
      
      {/* Sobre nosotros */}
      <AboutUsSection config={templateConfig} />
      
      {/* Equipo (condicional) */}
      {templateConfig.sections.showTeam && (
        <TeamSection config={templateConfig} />
      )}
      
      {/* Sección de tipos de propiedades (condicional) */}
      {templateConfig.sections.showRentSale && (
        <RentSaleSection config={templateConfig} adaptiveColors={adaptiveColors} />
      )}
      
      {/* Llamada a la acción */}
      <CallToAction config={templateConfig} adaptiveColors={adaptiveColors} />
      
      {/* Emprendimientos/Proyectos (condicional) */}
      {templateConfig.sections.showProjects && (
        <ProjectsSection config={templateConfig} adaptiveColors={adaptiveColors} />
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