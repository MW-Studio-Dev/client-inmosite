"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string; // Número de teléfono en formato internacional (ej: "5491123456789")
  message?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "¡Hola! Quiero más información sobre Inmosite 🏠",
  className = ""
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, _] = useState(true);

  // Mostrar notificación después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Ocultar notificación después de 5 segundos
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setShowNotification(false);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Botón principal flotante */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Animación de pulso de fondo */}
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Botón principal */}
        <motion.button
          onClick={handleWhatsAppClick}
          className="relative bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-pulse" />
        </motion.button>
      </motion.div>

      {/* Notificación emergente */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 max-w-sm"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 relative">
              {/* Botón cerrar */}
              <button
                onClick={handleCloseNotification}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Contenido de la notificación */}
              <div className="flex items-start space-x-3 pr-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    ¡Hablemos por WhatsApp! 💬
                  </h4>
                  <p className="text-gray-600 text-xs mt-1">
                    ¿Tienes dudas sobre nuestros servicios? Estamos aquí para ayudarte.
                  </p>
                  <motion.button
                    onClick={handleWhatsAppClick}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Escribir ahora
                  </motion.button>
                </div>
              </div>

              {/* Flecha apuntando al botón */}
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppButton;