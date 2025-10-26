'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BaseComponentProps } from '@/types/theme';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends BaseComponentProps {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  label,
  required = false,
  fullWidth = false,
  size = 'md',
  className,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

  const baseClasses = [
    'relative border border-surface-border rounded-md transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-hover',
    fullWidth ? 'w-full' : '',
  ];

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const buttonSizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-2.5',
    lg: 'px-5 py-3',
  };

  const errorClasses = error
    ? 'border-error focus-within:ring-error focus-within:border-error'
    : 'border-surface-border';

  const selectClasses = cn(
    baseClasses,
    sizeClasses[size],
    errorClasses,
    className
  );

  return (
    <div className={cn('relative', fullWidth ? 'w-full' : '')}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div ref={selectRef} className={selectClasses} {...props}>
        <button
          type="button"
          className={cn(
            'w-full flex items-center justify-between bg-transparent',
            buttonSizeClasses[size],
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            selectedValue ? 'text-text-primary' : 'text-text-muted'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn(
              'w-5 h-5 text-text-muted transition-transform duration-200',
              isOpen ? 'transform rotate-180' : ''
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface border border-surface-border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors duration-150',
                  'hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
                  option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                  selectedValue === option.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-text-primary'
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}