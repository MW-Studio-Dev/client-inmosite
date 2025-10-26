import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';

interface TextAreaInputProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  name,
  required = false,
  placeholder = '',
  className = '',
  rows = 4,
  maxLength,
  showCounter = false
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const currentLength = field.value?.length || 0;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        {...field}
        id={name}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      />
      {showCounter && maxLength && (
        <p className="text-xs text-gray-500 mt-1">
          {currentLength}/{maxLength} caracteres
        </p>
      )}
      {hasError && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <HiExclamationCircle className="h-3 w-3" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
