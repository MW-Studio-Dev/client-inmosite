import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';

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

  // Normalize options to SelectOption format
  const normalizedOptions: SelectOption[] = options.map(option =>
    typeof option === 'string'
      ? { value: option, label: option.charAt(0).toUpperCase() + option.slice(1) }
      : option
  );

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        {...field}
        id={name}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <HiExclamationCircle className="h-3 w-3" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
