"use client";

import React from 'react';
import { Button } from "@heroui/react";
import { HiCheck } from "react-icons/hi2";
import { Plan } from '@/types/landing';

const Pricing: React.FC = () => {
  const plans: Plan[] = [
    {
      name: "Básico",
      price: "$15.000",
      period: "/mes",
      description: "Perfecto para inmobiliarias pequeñas o agentes independientes",
      features: [
        "Hasta 50 propiedades",
        "Sitio web personalizado",
        "Galería de fotos",
        "Formulario de contacto",
        "SEO básico"
      ],
      popular: false,
      cta: "Prueba Gratis"
    },
    {
      name: "Profesional",
      price: "$30.000",
      period: "/mes",
      description: "Ideal para inmobiliarias en crecimiento",
      features: [
        "Hasta 200 propiedades",
        "Dominio personalizado",
        "Analytics avanzados",
        "CRM integrado",
        "Soporte prioritario",
        "Múltiples usuarios"
      ],
      popular: true,
      cta: "🚀 Empezar Ahora"
    },
    {
      name: "Enterprise",
      price: "$50.000",
      period: "/mes",
      description: "Para grandes inmobiliarias",
      features: [
        "Propiedades ilimitadas",
        "API personalizada",
        "Integración MLS",
        "Branding completo",
        "Soporte 24/7",
        "Manager dedicado"
      ],
      popular: false,
      cta: "Prueba Gratis"
    }
  ];

  return (
    <section id="precios" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
            <span className="text-gray-100">
              Precios que se adaptan a{" "}
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
              tu crecimiento
            </span>
          </h2>
          <p className="text-lg text-gray-300 font-light">
            <span className="text-red-400 font-normal">Sin costos ocultos.</span>{" "}
            Cancela cuando quieras.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative group transition-all duration-500 hover:scale-105 ${
                plan.popular 
                  ? 'scale-105 z-10' 
                  : 'hover:z-20'
              }`}
            >
              {/* Background glow for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-700/10 rounded-3xl blur-xl transform scale-110" />
              )}
              
              <div className={`relative bg-gray-900/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                plan.popular 
                  ? 'border-red-500/60 ring-1 ring-red-500/30 shadow-red-500/20' 
                  : 'border-gray-700/50 hover:border-red-500/40 hover:shadow-red-500/10'
              }`}>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-red-500/20 to-transparent opacity-60' 
                    : 'bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100'
                }`} />

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg border border-red-400/30">
                      🔥 Más Popular
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-6 relative z-10">
                  <h3 className="text-2xl font-medium text-gray-100 mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-light group-hover:text-gray-300 transition-colors duration-300">
                    {plan.description}
                  </p>
                </div>
                
                {/* Price */}
                <div className="text-center mb-6 relative z-10">
                  <span className={`text-4xl font-light transition-colors duration-300 ${
                    plan.popular 
                      ? 'text-red-400' 
                      : 'text-gray-100 group-hover:text-red-400'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-lg font-light">
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 relative z-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 group/item">
                      <div className="p-1 bg-red-500/20 rounded-full border border-red-500/30 group-hover/item:bg-red-500/30 transition-colors duration-300">
                        <HiCheck className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300 font-light text-sm group-hover/item:text-gray-200 transition-colors duration-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="relative z-10">
                  <Button 
                    className={`w-full py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-red-500/40 border border-red-400/30' 
                        : 'bg-transparent border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-red-500/30'
                    }`}
                  >
                    {/* Button glow effect */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-red-400/30 to-red-600/30 opacity-100' 
                        : 'bg-gradient-to-r from-red-500/20 to-red-700/20 opacity-0 hover:opacity-100'
                    }`} />
                    <span className="relative z-10">{plan.cta}</span>
                  </Button>
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-red-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-red-500/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm font-light">
            Todos los planes incluyen{" "}
            <span className="text-red-400 font-normal">14 días de prueba gratuita</span>{" "}
            • Sin compromiso de permanencia
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;