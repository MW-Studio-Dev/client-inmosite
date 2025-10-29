// components/Toast.tsx
'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

interface ToastContextType {
  toasts: (ToastProps & { id: string })[];
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '❌'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-md 
      ${styles.bg} ${styles.border} ${styles.text}
      border rounded-lg shadow-lg p-4
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{styles.icon}</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="text-lg leading-none hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Provider para el contexto de Toast
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Date.now().toString();
    const newToast = {
      ...props,
      id,
      onClose: () => removeToast(id)
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string) => showToast({ message, type: 'success' });
  const showError = (message: string) => showToast({ message, type: 'error' });
  const showWarning = (message: string) => showToast({ message, type: 'warning' });
  const showInfo = (message: string) => showToast({ message, type: 'info' });

  return (
    <ToastContext.Provider value={{ toasts, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

// Hook para manejar múltiples toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback para cuando no hay provider
    console.warn('useToast debe usarse dentro de ToastProvider');
    return {
      toasts: [],
      showSuccess: () => {},
      showError: () => {},
      showWarning: () => {},
      showInfo: () => {}
    };
  }
  return context;
};

// Componente contenedor para mostrar múltiples toasts
export const ToastContainer: React.FC<{ toasts?: (ToastProps & { id: string })[] }> = ({ toasts: propToasts }) => {
  const context = useContext(ToastContext);
  const toasts = propToasts || context?.toasts || [];

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};