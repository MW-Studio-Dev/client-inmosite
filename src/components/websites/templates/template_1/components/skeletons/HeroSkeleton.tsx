'use client';

import React from 'react';
import { SkeletonBase, SkeletonText } from './SkeletonBase';

interface HeroSkeletonProps {
  backgroundColor?: string;
}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = ({ backgroundColor = '#e5e7eb' }) => {
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <SkeletonBase height="h-full" rounded="sm" backgroundColor={backgroundColor} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center space-y-6">
          <SkeletonBase width="w-3/4 mx-auto" height="h-12" backgroundColor={backgroundColor} />
          <SkeletonBase width="w-1/2 mx-auto" height="h-8" backgroundColor={backgroundColor} />
          <div className="flex justify-center gap-4 mt-8">
            <SkeletonBase width="w-32" height="h-12" rounded="lg" backgroundColor={backgroundColor} />
            <SkeletonBase width="w-32" height="h-12" rounded="lg" backgroundColor={backgroundColor} />
          </div>
        </div>
      </div>
    </div>
  );
};
