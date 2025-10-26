"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Components
import  Header from '@/components/layout/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton'; // Importar el nuevo componente

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen transition-all duration-500">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
      
        <Header logoSrc='/logo.png'/>

        <main>
          {/* Hero section with its own background */}
          <Hero />
          
          {/* Unified dark/red background for all other sections */}
          <div className="relative bg-gradient-to-br from-black via-gray-900 to-red-950 overflow-hidden">
            {/* Global background patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(239,68,68,0.05),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(239,68,68,0.05),transparent_50%)]" />
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(239,68,68,0.03),transparent)]" />
            
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent opacity-50" />
            
            {/* Section dividers */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            
            {/* Stats Section (commented out) */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Stats />
            </motion.div> */}

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Features />
             
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <HowItWorks />
            
            </motion.div>

            {/* Pricing Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Pricing />
              
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Testimonials />
             
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <CTA />
             
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Contact />
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Footer />
            </motion.div>
          </div>
        </main>
      </div>

      {/* WhatsApp Button - Flotante y siempre visible */}
      <WhatsAppButton 
        phoneNumber="5491123456789" // Reemplaza con tu número real
        message="¡Hola! Quiero más información sobre Inmosite 🏠✨"
      />
    </div>
  );
};

export default LandingPage;