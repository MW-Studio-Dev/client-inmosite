import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';

interface TextInputProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  required = false,
  placeholder = '',
  className = ''
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        {...field}
        id={name}
        type="text"
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      />
      {hasError && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <HiExclamationCircle className="h-3 w-3" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
