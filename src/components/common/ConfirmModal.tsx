// components/common/ConfirmModal.tsx
'use client';

import React, { useEffect } from 'react';
import { HiExclamationCircle, HiX } from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: React.ReactNode; // Cambiado de string a React.ReactNode
  message?: string; // Hacemos message opcional
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger',
  disabled = false,
  children
}) => {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: isDark ? 'bg-red-900/20' : 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBg: isDark
            ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            : 'bg-red-600 hover:bg-red-700 active:bg-red-800',
          confirmText: 'text-white',
          border: isDark ? 'border-red-800' : 'border-red-200'
        };
      case 'warning':
        return {
          iconBg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBg: isDark
            ? 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800'
            : 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800',
          confirmText: 'text-white',
          border: isDark ? 'border-yellow-800' : 'border-yellow-200'
        };
      case 'info':
      default:
        return {
          iconBg: isDark ? 'bg-blue-900/20' : 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBg: isDark
            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
          confirmText: 'text-white',
          border: isDark ? 'border-blue-800' : 'border-blue-200'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-xl shadow-2xl transform transition-all ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${
          isDark
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <HiX className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <HiExclamationCircle className={`h-8 w-8 ${styles.iconColor}`} />
          </div>

          {/* Title - Modificado para aceptar React.ReactNode */}
          <div className={`text-xl font-bold text-center mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </div>

          {/* Message or Children */}
          {children ? (
            <div className="mb-6">
              {children}
            </div>
          ) : message ? (
            <>
              <p className={`text-center mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {message}
              </p>

              {/* Warning box */}
              <div className={`rounded-lg p-3 mb-6 border ${styles.border} ${
                isDark
                  ? type === 'danger'
                    ? 'bg-red-900/10'
                    : type === 'warning'
                    ? 'bg-yellow-900/10'
                    : 'bg-blue-900/10'
                  : type === 'danger'
                  ? 'bg-red-50'
                  : type === 'warning'
                  ? 'bg-yellow-50'
                  : 'bg-blue-50'
              }`}>
                <p className={`text-sm text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
            </>
          ) : null}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={disabled}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${styles.confirmBg} ${styles.confirmText} shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
