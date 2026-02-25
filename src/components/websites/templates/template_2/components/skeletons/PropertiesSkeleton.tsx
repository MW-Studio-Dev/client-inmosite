'use client';

import React from 'react';
import { SkeletonBase, SkeletonCard } from './SkeletonBase';

interface PropertiesSkeletonProps {
  count?: number;
  backgroundColor?: string;
  surfaceColor?: string;
}

export const PropertiesSkeleton: React.FC<PropertiesSkeletonProps> = ({
  count = 6,
  backgroundColor = '#e5e7eb',
  surfaceColor = '#ffffff'
}) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SkeletonBase width="w-64 mx-auto" height="h-10" backgroundColor={backgroundColor} />
          <div className="mt-4">
            <SkeletonBase width="w-96 mx-auto" height="h-6" backgroundColor={backgroundColor} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard
              key={i}
              backgroundColor={backgroundColor}
              surfaceColor={surfaceColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
