"use client";

import React from 'react';
import { Button } from "@heroui/react";
import Image from "next/image";
import { HiArrowRight, HiCheck, HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";


const Hero: React.FC = () => {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background con overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Imagen de fondo para móvil */}
        <Image 
          src="/hero_mobile.webp" 
          alt="Hero Background Mobile" 
          fill 
          className="object-cover block sm:hidden" 
          priority
        />
        
        {/* Imagen de fondo para desktop */}
        <Image 
          src="/hero.png" 
          alt="Hero Background Desktop" 
          fill 
          className="object-cover hidden sm:block" 
          priority
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12 lg:pt-16 lg:pb-0">
          
          {/* Contenido centrado en móvil, izquierda en desktop */}
          <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
            
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start mb-6 lg:mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-3 py-2 sm:px-4 backdrop-blur-sm">
                <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                <span className="text-red-200 text-xs sm:text-sm font-medium font-poppins">
                  <span className="font-semibold">Nuevo:</span> Integración con Meli
                </span>
              </div>
            </motion.div>
            
            {/* Título principal - Responsive mejorado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 sm:mb-6 lg:mb-8"
            >
              <h1 className="font-inter font-light tracking-tight text-white leading-[0.85] sm:leading-[0.8]">
                {/* Mobile: texto mucho más grande para mejor jerarquía */}
                <span className="block text-6xl xs:text-7xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl">
                  Tu inmobiliaria
                </span>
                <span className="text-red-500 font-medium text-6xl xs:text-7xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl">
                  online
                </span>
              </h1>
            </motion.div>
            
            {/* Subtítulo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 sm:mb-8 lg:mb-10"
            >
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-poppins">
                Crea un <span className="text-white font-medium">sitio web</span> para tu inmobiliaria
              </p>
            </motion.div>
            
            {/* Botón CTA */}
            <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6 }}
  className="mb-8 sm:mb-8 lg:mb-10"
>
  <motion.div
    whileHover={{ 
      scale: 1.05,
      // Shadow mejorado en hover
      filter: "drop-shadow(0 25px 25px rgb(239 68 68 / 0.4)) drop-shadow(0 0 0 rgb(239 68 68 / 0.1))"
    }}
    whileTap={{ scale: 0.98 }}
    animate={{ 
      y: [0, -2, 0],
    }}
    transition={{ 
      y: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      },
      // Transición suave para el hover
      scale: { duration: 0.2 },
      filter: { duration: 0.3 }
    }}
    // Shadow base mejorado
    style={{
      filter: "drop-shadow(0 10px 15px rgb(0 0 0 / 0.3)) drop-shadow(0 4px 6px rgb(239 68 68 / 0.2))"
    }}
  >
    <Button 
      size="md" 
      // Clases simplificadas sin shadow-2xl que conflictúa
      className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-7 font-bold rounded-xl transition-colors duration-300 font-poppins w-auto border-0"
      endContent={
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
        </motion.div>
      }
    >
      Comenzar gratis
    </Button>
  </motion.div>
</motion.div>
            
            {/* Features rápidas - Responsive stack */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6"
            >
              {["Prueba gratis", "Setup rápido", "Soporte 24/7"].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-1 bg-green-500/20 rounded-full">
                    <HiCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-slate-400 text-base font-poppins">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent" />
    </section>
  );
};

export default Hero;