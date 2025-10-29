import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface NumberInputProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  name,
  required = false,
  placeholder = '',
  className = '',
  min,
  max,
  step
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || !isNaN(Number(value))) {
      helpers.setValue(value);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={name} className={`block text-xs font-medium mb-1.5 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label} {required && <span className={isDark ? 'text-red-400' : 'text-red-600'}>*</span>}
      </label>
      <input
        {...field}
        id={name}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-colors ${
          hasError
            ? isDark
              ? 'border-red-700 bg-red-900/20 text-white'
              : 'border-red-500 bg-red-50 text-gray-900'
            : isDark
            ? 'border-slate-600 bg-slate-900 text-white focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-400'
        }`}
      />
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
