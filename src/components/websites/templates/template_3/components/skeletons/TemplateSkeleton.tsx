'use client';

import React from 'react';
import { HeroSkeleton } from './HeroSkeleton';
import { PropertiesSkeleton } from './PropertiesSkeleton';
import { AboutSkeleton } from './AboutSkeleton';
import { GenericSectionSkeleton } from './GenericSectionSkeleton';

export const TemplateSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Skeleton */}
      <div className="h-10 bg-gray-200 animate-pulse" />

      {/* Navbar Skeleton */}
      <div className="h-20 bg-white shadow-sm animate-pulse" />

      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Featured Properties Skeleton */}
      <PropertiesSkeleton count={6} />

      {/* About Skeleton */}
      <AboutSkeleton />

      {/* Generic Sections Skeleton */}
      <GenericSectionSkeleton />
      <GenericSectionSkeleton showImage={false} />

      {/* Footer Skeleton */}
      <div className="bg-gray-800 h-64 animate-pulse" />
    </div>
  );
};
