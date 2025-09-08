"use client";

import React from 'react';
import {
  HiHome,
  HiChartBar,
  HiShieldCheck,
  HiDevicePhoneMobile,
  HiGlobeAlt,
  HiBolt
} from "react-icons/hi2";
import { Feature } from '@/types/landing';

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <HiHome className="w-6 h-6" />,
      title: "Gestión de Propiedades",
      description: "Administra todas tus propiedades desde un panel intuitivo con galerías profesionales."
    },
    {
      icon: <HiGlobeAlt className="w-6 h-6" />,
      title: "Sitio Web Personalizado",
      description: "Crea tu sitio web único con tu branding, sin necesidad de conocimientos técnicos."
    },
    {
      icon: <HiChartBar className="w-6 h-6" />,
      title: "Analytics Detallados",
      description: "Conoce el rendimiento de tus propiedades con estadísticas en tiempo real."
    },
    {
      icon: <HiDevicePhoneMobile className="w-6 h-6" />,
      title: "100% Responsive",
      description: "Tu sitio se verá perfecto en cualquier dispositivo, móvil, tablet o desktop."
    },
    {
      icon: <HiShieldCheck className="w-6 h-6" />,
      title: "Seguridad Garantizada",
      description: "Protección de datos con certificados SSL y backups automáticos diarios."
    },
    {
      icon: <HiBolt className="w-6 h-6" />,
      title: "Velocidad Optimizada",
      description: "Sitios ultra rápidos que mejoran tu posicionamiento en Google."
    }
  ];

  return (
    <section id="características" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
            <span className="text-gray-100">
              Todo lo que necesitas para{" "}
            </span>
            <br />
            <span className="text-red-500 font-semibold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              hacer crecer tu negocio
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            Herramientas{" "}
            <span className="text-red-400 font-normal">profesionales</span>{" "}
            diseñadas específicamente para inmobiliarias
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-red-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-red-500/20 hover:shadow-2xl"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-medium text-gray-100 mb-3 group-hover:text-red-400 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed font-light text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>
              
              {/* Bottom border accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;