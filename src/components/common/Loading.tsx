'use client';

import React from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function GlobalLoader({ isLoading, message = "Cargando..." }: GlobalLoaderProps) {
  // Usamos un ref para prevenir race conditions en el cleanup
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Verificar que estamos en el cliente y el componente está montado
    if (typeof window !== 'undefined' && document && document.body && isMountedRef.current) {
      try {
        if (isLoading) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
      } catch (error) {
        console.warn('Error al modificar overflow del body:', error);
      }
    }

    return () => {
      // Limpiar el efecto solo si estamos en el cliente y el componente está montado
      if (typeof window !== 'undefined' && document && document.body && isMountedRef.current) {
        try {
          document.body.style.overflow = 'unset';
        } catch (error) {
          console.warn('Error al restaurar overflow del body:', error);
        }
      }
    };
  }, [isLoading]);

  // Prevenir renderizado si el componente no está montado
  if (!isMountedRef.current) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
            layoutId="loader-content"
          >
            {/* Loader animado simplificado */}
            <div className="relative mb-4">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
            </div>

            {/* Mensaje estático (sin motion para evitar recursión) */}
            <p className="text-gray-700 dark:text-gray-300 font-medium text-center text-sm">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Componente simple para páginas individuales
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

// Componente que integra el loader global con el context
export function GlobalLoaderWithHook() {
  const { isLoading, message } = useGlobalLoader();

  return <GlobalLoader isLoading={isLoading} message={message} />;
}