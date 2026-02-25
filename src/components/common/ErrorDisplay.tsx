'use client';

import React from 'react';
import { HiExclamationTriangle, HiX } from 'react-icons/hi2';

interface ErrorField {
  field: string;
  message: string;
  section?: string;
}

interface ErrorDisplayProps {
  errors: ErrorField[];
  onDismiss?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errors,
  onDismiss,
  className = ''
}) => {
  if (errors.length === 0) return null;

  // Agrupar errores por sección si está disponible
  const errorsBySection: Record<string, ErrorField[]> = {};
  const generalErrors: ErrorField[] = [];

  errors.forEach(error => {
    if (error.section) {
      if (!errorsBySection[error.section]) {
        errorsBySection[error.section] = [];
      }
      errorsBySection[error.section].push(error);
    } else {
      generalErrors.push(error);
    }
  });

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <HiExclamationTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <h3 className="text-red-800 font-medium">
            {errors.length === 1 ? 'Error encontrado' : 'Se encontraron varios errores'}
          </h3>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <HiX className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Errores generales */}
        {generalErrors.map((error, index) => (
          <div key={`general-${index}`} className="text-red-700 text-sm">
            <span className="font-medium">{error.field}:</span> {error.message}
          </div>
        ))}

        {/* Errores agrupados por sección */}
        {Object.entries(errorsBySection).map(([section, sectionErrors]) => (
          <div key={section} className="border-t border-red-200 pt-3">
            <h4 className="text-red-800 font-medium text-sm mb-2 capitalize">
              {section}:
            </h4>
            <div className="space-y-1 ml-4">
              {sectionErrors.map((error, index) => (
                <div key={`${section}-${index}`} className="text-red-700 text-sm">
                  <span className="font-medium">{error.field}:</span> {error.message}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen rápido */}
      <div className="mt-4 pt-3 border-t border-red-200">
        <p className="text-red-600 text-xs">
          Por favor, corrige los errores marcados en rojo para poder continuar.
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
