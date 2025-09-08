"use client";

import React, { useState, useEffect } from 'react';
import { HiBars3, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeaderProps {
  logoSrc?: string; // Prop opcional para la imagen del logo
}

const Header: React.FC<HeaderProps> = ({ logoSrc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const navItems = ['Características', 'Precios', 'Testimonios', 'Contacto'];

  // Detectar scroll para cambiar la transparencia
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (item: string) => {
    setIsMenuOpen(false);
    // Aquí puedes agregar lógica de navegación si es necesario
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calcular la opacidad basada en el scroll
  const headerOpacity = Math.min(scrollY / 100, 0.95);
  const backdropBlur = Math.min(scrollY / 50, 1);

  return (
    <>
      {/* Header fijo */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: `rgba(31, 41, 55, ${headerOpacity * 0.9})`, // gray-800 con transparencia
          backdropFilter: `blur(${backdropBlur * 12}px)`,
          borderBottom: `1px solid rgba(107, 114, 128, ${headerOpacity * 0.3})`, // gray-500 sutil
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Responsive */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {logoSrc ? (
                // Logo personalizado (imagen PNG) - Responsive
                <div className="relative w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 lg:w-48 lg:h-24">
                  <Image 
                    src={logoSrc} 
                    alt="Logo" 
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              ) : (
                // Logo por defecto si no hay logoSrc - Responsive
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-sm bg-white" />
                  </div>
                  <span className="ml-2 text-lg sm:text-xl md:text-2xl font-semibold text-white font-inter">
                    Inmo<span className="text-red-400">Web</span>
                  </span>
                </div>
              )}
            </motion.div>
            
            {/* Navegación Desktop - Hidden en mobile */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className="text-gray-200 hover:text-red-400 font-medium transition-colors duration-200 font-inter"
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.button>
              ))}
            </nav>

            {/* Botones Desktop - Hidden en mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.a
                href='/login'
                className="text-gray-200 hover:text-white font-medium px-4 py-2 rounded-lg border border-gray-500/50 hover:bg-gray-700/50 hover:border-gray-400/70 transition-all duration-200 font-poppins"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Iniciar Sesión
              </motion.a>
              
              <motion.a
                href='/register'
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 font-poppins border border-red-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Prueba Gratis
              </motion.a>
            </div>
            
            {/* Botón de menú - Solo visible en mobile/tablet */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-700/50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <HiXMark className="w-6 h-6" />
                ) : (
                  <HiBars3 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menú Fullscreen Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-gray-900/95 backdrop-blur-md lg:hidden"
          >
            {/* Contenido del menú */}
            <div className="flex-1 flex flex-col justify-center items-center px-6">
              {/* Navegación principal */}
              <nav className="flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleNavClick(item)}
                    className="text-2xl sm:text-3xl md:text-4xl font-light transition-colors duration-200 hover:text-red-400 text-gray-100 font-inter"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </nav>
              
              {/* Botones de autenticación */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.a
                  href='/login'
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full sm:w-auto text-center text-base sm:text-lg font-medium px-6 py-3 rounded-lg border transition-all duration-200 text-gray-200 border-gray-500/50 hover:bg-gray-700/50 hover:text-white font-poppins"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Iniciar Sesión
                </motion.a>
                
                <motion.a
                  href='/register'
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg font-medium px-6 py-3 rounded-lg transition-all duration-200 font-poppins border border-red-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Prueba Gratis
                </motion.a>
              </motion.div>
            </div>
            
            {/* Footer */}
            <motion.footer 
              className="p-4 sm:p-6 border-t border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="text-center">
                <a
                  href="https://mwstudiodigital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:text-red-400 text-gray-400 font-poppins"
                >
                  InmoSite by{' '}
                  <span className="font-semibold">MW Studio Digital</span>
                </a>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;