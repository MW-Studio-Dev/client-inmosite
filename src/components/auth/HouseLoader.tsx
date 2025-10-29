'use client';

import React from 'react';

interface HouseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const HouseLoader: React.FC<HouseLoaderProps> = ({
  size = 'md',
  message = 'Cargando...'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Casa animada */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
          >
            {/* Roof */}
            <path
              d="M50 10 L90 45 L10 45 Z"
              fill="currentColor"
              className="text-red-500 animate-pulse"
              style={{ animationDuration: '2s' }}
            />

            {/* House body */}
            <rect
              x="20"
              y="45"
              width="60"
              height="45"
              fill="currentColor"
              className="text-red-600"
            />

            {/* Door */}
            <rect
              x="42"
              y="65"
              width="16"
              height="25"
              fill="currentColor"
              className="text-red-800 animate-pulse"
              style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}
            />

            {/* Windows */}
            <rect
              x="28"
              y="52"
              width="12"
              height="10"
              fill="currentColor"
              className="text-yellow-300 animate-pulse"
              style={{ animationDuration: '1.5s', animationDelay: '0.1s' }}
            />
            <rect
              x="60"
              y="52"
              width="12"
              height="10"
              fill="currentColor"
              className="text-yellow-300 animate-pulse"
              style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}
            />

            {/* Chimney */}
            <rect
              x="65"
              y="20"
              width="8"
              height="15"
              fill="currentColor"
              className="text-red-700"
            />

            {/* Smoke from chimney */}
            <circle
              cx="69"
              cy="15"
              r="2"
              fill="currentColor"
              className="text-gray-400 opacity-50"
            >
              <animate
                attributeName="cy"
                values="15;5;15"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="67"
              cy="12"
              r="2"
              fill="currentColor"
              className="text-gray-400 opacity-50"
            >
              <animate
                attributeName="cy"
                values="12;2;12"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="71"
              cy="12"
              r="2"
              fill="currentColor"
              className="text-gray-400 opacity-50"
            >
              <animate
                attributeName="cy"
                values="12;2;12"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Círculo giratorio alrededor */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <p className="text-gray-300 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}

      {/* Dots animados */}
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

// Componente para pantalla completa
export const HouseLoaderFullScreen: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
      <HouseLoader size="lg" message={message} />
    </div>
  );
};
