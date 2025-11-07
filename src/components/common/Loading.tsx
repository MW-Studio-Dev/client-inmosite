'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function GlobalLoader({ isLoading, message = "Cargando..." }: GlobalLoaderProps) {
  useEffect(() => {
    // Verificar que estamos en el cliente antes de acceder a document
    if (typeof window !== 'undefined' && document.body) {
      if (isLoading) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      // Limpiar el efecto solo si estamos en el cliente
      if (typeof window !== 'undefined' && document.body) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Loader animado */}
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>

              {/* Puntos animados */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>

            {/* Mensaje */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 dark:text-gray-300 font-medium text-center"
            >
              {message}
            </motion.p>

            {/* Barra de progreso indefinida */}
            <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
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