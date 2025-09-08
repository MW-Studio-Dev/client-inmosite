"use client";

import React from 'react';
import { Image } from "@heroui/react";
import { Step } from '@/types/landing';

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      step: "1",
      title: "Regístrate y elige tu plan",
      description: "Crea tu cuenta en menos de 2 minutos y selecciona el plan que mejor se adapte a tu inmobiliaria."
    },
    {
      step: "2", 
      title: "Personaliza tu sitio web",
      description: "Sube tu logo, elige colores y personaliza el diseño. Nuestro editor visual hace todo súper fácil."
    },
    {
      step: "3",
      title: "Publica tus propiedades", 
      description: "Agrega fotos, descripciones y detalles. ¡Tu sitio estará listo para recibir clientes!"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
            <span className="text-gray-100">Así de{" "}</span>
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
              fácil
            </span>
          </h2>
          <p className="text-lg text-gray-300 font-light">
            En solo{" "}
            <span className="text-red-400 font-medium">3 pasos</span>{" "}
            tendrás tu inmobiliaria online
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((item, index) => (
              <div key={index} className="flex gap-6 group relative">
                {/* Connecting line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-16 left-6 w-px h-16 bg-gradient-to-b from-red-500/50 to-gray-700/30" />
                )}
                
                {/* Step number */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl flex items-center justify-center font-medium text-lg group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-red-500/30 relative z-10">
                  <span className="relative z-10">{item.step}</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-medium text-gray-100 group-hover:text-red-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mx-4 -my-2" />
              </div>
            ))}
          </div>

          {/* Process Image */}
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl blur-xl transform scale-110" />
            
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/20 transition-all duration-500">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent opacity-60" />
              
              <div className="aspect-video bg-black/50 rounded-xl overflow-hidden relative border border-gray-800/50">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
                  alt="Proceso de setup"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-red-900/10" />
                
                {/* Play button overlay effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-red-500/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-400/50">
                    <div className="w-0 h-0 border-l-6 border-l-white border-t-3 border-t-transparent border-b-3 border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500/30 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500/30 rounded-bl-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;