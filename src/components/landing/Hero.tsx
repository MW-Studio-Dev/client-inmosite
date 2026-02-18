"use client";

import React from 'react';
import Image from "next/image";
import { HiArrowRight, HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950">

      {/* Background image — right side, no overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Fade bottom to blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-16 lg:pt-0 lg:pb-0">

          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
                <HiSparkles className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-200 text-sm font-medium font-poppins">
                  Integración con Mercado Libre
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-6"
            >
              <h1 className="font-inter font-light text-white leading-snug text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                ¡Creá el sitio web de tu inmobiliaria{' '}
                <span className="text-red-500">en minutos!</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-lg text-gray-300 font-light font-poppins leading-relaxed">
                Publicá tus propiedades, gestioná clientes y crecé online.
                <br className="hidden sm:block" />
                Sin conocimientos técnicos.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 rounded-xl text-base font-poppins border-0 transition-all duration-200 hover:scale-105"
                endContent={<HiArrowRight className="w-5 h-5" />}
                onPress={() => {
                  document.getElementById('whitelist')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Acceso anticipado
              </Button>

              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/20 font-medium px-8 py-6 rounded-xl text-base font-poppins transition-all duration-200"
                onPress={() => {
                  document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver planes
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-gray-400 font-poppins"
            >
              30 días de prueba gratis · Sin tarjeta de crédito
            </motion.p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;