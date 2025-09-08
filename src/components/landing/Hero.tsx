"use client";

import React from 'react';
import { Button } from "@heroui/react";
import Image from "next/image";
import { HiArrowRight, HiCheck, HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section className="h-screen relative overflow-hidden">
      {/* Background con overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Imagen de fondo opcional - puedes cambiar por tu imagen */}
        <div className="absolute inset-0 bg-black/40" />
        <Image src="/hero.png" alt="Hero Background" fill className="object-cover" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-screen flex items-center pt-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* Contenido de texto - Lado izquierdo */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <HiSparkles className="w-4 h-4 text-red-400" />
                <span className="text-red-200 text-sm font-medium font-poppins">
                  <span className="font-semibold">Nuevo:</span> Integración con Meli
                </span>
              </div>
            </motion.div>
            
            {/* Título principal - Más compacto */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-1" // Reducido el espacio entre líneas
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-inter font-light leading-[0.9] tracking-tight text-white">
                <span className="block">Tu inmobiliaria</span>
                <span className="block text-red-500 font-medium">online</span>
                <span className="block">en minutos</span>
              </h1>
            </motion.div>
            
            {/* Subtítulo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-lg lg:text-xl xl:text-2xl text-slate-300 leading-relaxed max-w-xl font-poppins">
                Crea un <span className="text-white font-medium">sitio web</span> para tu inmobiliaria
              </p>
            </motion.div>
            
            {/* Botón CTA */}
            <motion.div 
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-10 py-7 font-bold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 font-poppins"
                endContent={<HiArrowRight className="w-5 h-5 ml-2" />}
              >
                Comenzar gratis
              </Button>
            </motion.div>
            
            {/* Features rápidas */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {["Prueba gratis", "Setup rapido", "Soporte 24/7"].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-1 bg-green-500/20 rounded-full">
                    <HiCheck className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-slate-400 text-sm font-poppins">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
          
        
        </div>
      </div>
      
      {/* Gradiente inferior - Reducido */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent" />
    </section>
  );
};

export default Hero;