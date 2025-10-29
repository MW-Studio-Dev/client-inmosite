import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  name: string;
  options: string[] | SelectOption[];
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  required = false,
  placeholder = 'Seleccionar...',
  className = ''
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  // Normalize options to SelectOption format
  const normalizedOptions: SelectOption[] = options.map(option =>
    typeof option === 'string'
      ? { value: option, label: option.charAt(0).toUpperCase() + option.slice(1) }
      : option
  );

  return (
    <div className={className}>
      <label htmlFor={name} className={`block text-xs font-medium mb-1.5 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label} {required && <span className={isDark ? 'text-red-400' : 'text-red-600'}>*</span>}
      </label>
      <select
        {...field}
        id={name}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-colors ${
          hasError
            ? isDark
              ? 'border-red-700 bg-red-900/20 text-white'
              : 'border-red-500 bg-red-50 text-gray-900'
            : isDark
            ? 'border-slate-600 bg-slate-900 text-white focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-red-500 focus:border-red-500'
        }`}
      >
        <option value="" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}>{placeholder}</option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>
          <HiExclamationCircle className="h-3 w-3" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
