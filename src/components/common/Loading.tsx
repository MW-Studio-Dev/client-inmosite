"use client";

import React from 'react';
import { Loader } from './Loader';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const GlobalLoader = ({ isLoading, message = 'Cargando...' }: GlobalLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
        <div className="relative flex justify-center items-center p-4">
          <Loader scale={1.5} />
        </div>
        <p className="text-gray-700 dark:text-gray-200 font-medium text-lg animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

// Componente simple para páginas individuales
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative pt-4 pb-4 flex justify-center items-center">
          <Loader />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Cargando...</p>
      </div>
    </div>
  );
}

// Componente que integra el loader global con el context
export function GlobalLoaderWithHook() {
  const { isLoading, message } = useGlobalLoader();

  return <GlobalLoader isLoading={isLoading} message={message} />;
}