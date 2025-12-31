'use client';

import React from 'react';
import { Loader } from '../common/Loader';

interface HouseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const HouseLoader: React.FC<HouseLoaderProps> = ({
  size = 'md',
  message = 'Cargando...'
}) => {
  const scaleMap = {
    sm: 0.8,
    md: 1,
    lg: 1.5
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="relative flex items-center justify-center p-4">
        <Loader scale={scaleMap[size]} />
      </div>

      {/* Mensaje */}
      {message && (
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Componente para pantalla completa
export const HouseLoaderFullScreen: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <HouseLoader size="lg" message={message} />
    </div>
  );
};
