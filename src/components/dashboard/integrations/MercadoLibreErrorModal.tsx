'use client';

import React from 'react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { HiExclamationTriangle, HiExternalLink, HiX } from 'react-icons/hi';

interface MercadoLibreErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: {
    success: false;
    message: string;
    error_code: string;
    errors: {
      action: string;
    };
  };
  onReconnect?: () => void;
}

const MercadoLibreErrorModal: React.FC<MercadoLibreErrorModalProps> = ({
  isOpen,
  onClose,
  error,
  onReconnect
}) => {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const isTokenExpired = error?.error_code === 'MELI_TOKEN_EXPIRED';
  const actionUrl = error?.errors?.action;

  const handleReconnect = async () => {
    if (onReconnect) {
      onReconnect();
    } else if (actionUrl) {
      // Si no hay callback personalizado, redirigir directamente
      try {
        const response = await fetch(`/api/v1${actionUrl}`);
        const data = await response.json();
        if (data.data?.oauth_url) {
          window.location.href = data.data.oauth_url;
        }
      } catch (error) {
        console.error('Error getting reconnect URL:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`
        relative z-10 w-full max-w-md mx-4 rounded-xl shadow-xl
        transform transition-all duration-300 scale-100
        ${isDark
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
        }
      `}>
        {/* Header */}
        <div className={`
          px-6 py-4 border-b rounded-t-xl
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-full
                ${isTokenExpired
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
                }
              `}>
                <HiExclamationTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`
                  text-lg font-semibold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  {isTokenExpired ? 'Conexión Expirada' : 'Error de Conexión'}
                </h3>
                <p className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  MercadoLibre Integration
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`
                p-1 rounded-lg transition-colors
                ${isDark
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className={`
            p-4 rounded-lg mb-4
            ${isTokenExpired
              ? isDark
                ? 'bg-yellow-900/20 border border-yellow-700/30 text-yellow-300'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              : isDark
                ? 'bg-red-900/20 border border-red-700/30 text-red-300'
                : 'bg-red-50 border border-red-200 text-red-800'
            }
          `}>
            <p className="text-sm font-medium mb-1">
              {isTokenExpired ? 'Token Expirado' : 'Error de Autenticación'}
            </p>
            <p className="text-sm opacity-90">
              {error?.message || 'Ha ocurrido un error con la conexión a MercadoLibre.'}
            </p>
          </div>

          {isTokenExpired && (
            <div className={`
              p-4 rounded-lg
              ${isDark
                ? 'bg-blue-900/20 border border-blue-700/30 text-blue-300'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
              }
            `}>
              <h4 className="font-medium mb-2 text-sm">¿Qué necesita hacer?</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Su sesión de MercadoLibre ha expirado</li>
                <li>• Necesita autorizar nuevamente el acceso</li>
                <li>• Será redirigido a MercadoLibre para reconectar</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`
          px-6 py-4 border-b rounded-b-xl
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${isDark
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              Cancelar
            </button>
            <button
              onClick={handleReconnect}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                ${isTokenExpired
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
                }
              `}
            >
              <HiExternalLink className="w-4 h-4" />
              Reconectar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoLibreErrorModal;