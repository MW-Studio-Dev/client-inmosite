'use client';

import React from 'react';
import Image from 'next/image';
import { MapPinIcon } from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';

interface ProjectsSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ config, adaptiveColors }) => {
  if (!config.sections.showProjects || !config.projects) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Finalizado':
        return {
          backgroundColor: config.colors.success + '20',
          color: config.colors.success
        };
      case 'En construcción':
        return {
          backgroundColor: config.colors.warning + '20',
          color: config.colors.warning
        };
      default:
        return {
          backgroundColor: config.colors.primary + '20',
          color: config.colors.primary
        };
    }
  };

  return (
    <section id="emprendimientos" className="py-20" style={{ backgroundColor: config.colors.background }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl mb-4"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold
            }}
          >
            Nuestros Emprendimientos
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: config.colors.textLight }}
          >
            Proyectos innovadores que transforman la vida urbana con diseño de vanguardia y tecnología.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.projects.map((project:any) => (
            <div 
              key={project.id} 
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: config.colors.surface }}
            >
              <div className="relative h-64">
                <Image 
                  src={project.image} 
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4">
                  <span 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      fontWeight: config.typography.fontWeight.semibold,
                      ...getStatusStyle(project.status)
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 
                  className="text-xl mb-2"
                  style={{ 
                    color: config.colors.text,
                    fontWeight: config.typography.fontWeight.bold
                  }}
                >
                  {project.name}
                </h3>
                <div className="flex items-center mb-3" style={{ color: config.colors.textLight }}>
                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{project.location}</span>
                </div>
                <p 
                  className="mb-4 leading-relaxed"
                  style={{ 
                    color: config.colors.textLight,
                    fontWeight: config.typography.fontWeight.normal
                  }}
                >
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: config.colors.textLight }}>
                    <span>Entrega: {project.deliveryDate}</span>
                  </div>
                  <button 
                    className="px-6 py-2 rounded-lg transition-colors duration-200"
                    style={{ 
                      backgroundColor: config.colors.primary,
                      color: adaptiveColors.primaryText,
                      fontWeight: config.typography.fontWeight.semibold
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primaryDark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
                  >
                    Ver Más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
