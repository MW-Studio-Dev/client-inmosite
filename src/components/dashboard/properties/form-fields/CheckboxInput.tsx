import React from 'react';
import { useField } from 'formik';
import { HiExclamationCircle } from 'react-icons/hi';

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

  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          {...field}
          id={name}
          type="checkbox"
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={name} className="ml-2 text-sm text-gray-900">
          {label}
        </label>
      </div>
      {description && (
        <p className="ml-6 text-xs text-gray-500 mt-0.5">{description}</p>
      )}
      {hasError && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1 ml-6">
          <HiExclamationCircle className="h-3 w-3" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
