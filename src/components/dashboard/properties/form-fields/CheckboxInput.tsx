import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext'; // 1. Importar el hook

interface CheckboxInputProps {
  label: string;
  name: string;
  className?: string;
  description?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  name,
  className = '',
  description
}) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const hasError = meta.touched && meta.error;
  
  // 2. Usar el hook para obtener el tema
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  return (
    <div className={className}>
      <div className="flex items-start"> 
        <input
          {...field}
          id={name}
          type="checkbox"
          className={`w-4 h-4 mt-0.5 text-red-600 focus:ring-red-500 border rounded transition-colors ${
            isDark
              ? 'border-slate-600 bg-slate-900'
              : 'border-gray-300 bg-white'
          }`}
        />
        <label htmlFor={name} className={`ml-2 text-sm cursor-pointer ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      </div>
      {description && (
        <p className={`ml-6 text-xs mt-0.5 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>{description}</p>
      )}
      {hasError && (
        <p className={`text-xs mt-1 flex items-center gap-1 ml-6 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>
          <HiExclamationCircle className="h-3 w-3" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
