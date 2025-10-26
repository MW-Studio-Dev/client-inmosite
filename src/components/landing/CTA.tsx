"use client";

import React from 'react';
import { Button } from "@heroui/react";
import { HiArrowRight, HiPhone } from "react-icons/hi2";


const CTA: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-3xl p-16 text-center overflow-hidden shadow-2xl border border-red-500/20">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] [background-size:30px_30px] opacity-30"></div>
          
          {/* Background glow effects */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-300/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extralight mb-6 text-white tracking-tight">
              ¿Listo para{" "}
              <span className="font-light underline decoration-white/30 decoration-2">transformar</span>{" "}
              tu inmobiliaria?
            </h2>
            
            <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Únete a más de{" "}
              <span className="font-normal text-white">1,500 inmobiliarias</span>{" "}
              que ya están vendiendo más con nuestra plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white/90 text-red-700 hover:bg-white hover:text-red-800 hover:scale-105 text-lg px-10 py-7 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-white/50 hover:border-white"
                endContent={<HiArrowRight className="w-5 h-5" />}
              >
                Comenzar Gratis
              </Button>
              
              <Button 
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white/20 hover:border-white hover:scale-105 text-lg px-10 py-7 font-medium rounded-xl transition-all duration-300"
                startContent={<HiPhone className="w-5 h-5" />}
              >
                Contáctanos
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-red-100/80 text-sm font-light">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>30 días de prueba gratuita</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Sin compromiso de permanencia</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Soporte en español</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;