'use client';

import React from 'react';

interface SkeletonBaseProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  backgroundColor?: string;
}

export const SkeletonBase: React.FC<SkeletonBaseProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = 'md',
  backgroundColor = '#e5e7eb'
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }[rounded];

  return (
    <div
      className={`${width} ${height} ${roundedClass} animate-pulse ${className}`}
      style={{ backgroundColor }}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string; backgroundColor?: string }> = ({
  lines = 3,
  className = '',
  backgroundColor
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase
        key={i}
        width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        height="h-4"
        backgroundColor={backgroundColor}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ backgroundColor?: string; surfaceColor?: string }> = ({
  backgroundColor,
  surfaceColor
}) => (
  <div
    className="rounded-xl overflow-hidden shadow-lg"
    style={{ backgroundColor: surfaceColor }}
  >
    <SkeletonBase height="h-48" rounded="sm" backgroundColor={backgroundColor} />
    <div className="p-4 space-y-3">
      <SkeletonBase width="w-3/4" height="h-6" backgroundColor={backgroundColor} />
      <SkeletonText lines={2} backgroundColor={backgroundColor} />
      <SkeletonBase width="w-1/2" height="h-8" backgroundColor={backgroundColor} />
    </div>
  </div>
);
