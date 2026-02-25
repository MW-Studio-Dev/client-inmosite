'use client';

import React from 'react';
import { SkeletonBase, SkeletonText } from './SkeletonBase';

interface GenericSectionSkeletonProps {
  backgroundColor?: string;
  showImage?: boolean;
}

export const GenericSectionSkeleton: React.FC<GenericSectionSkeletonProps> = ({
  backgroundColor = '#e5e7eb',
  showImage = true
}) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SkeletonBase width="w-64 mx-auto" height="h-10" className="mb-4" backgroundColor={backgroundColor} />
          <SkeletonBase width="w-96 mx-auto" height="h-6" backgroundColor={backgroundColor} />
        </div>

        {showImage && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <SkeletonBase height="h-48" rounded="xl" backgroundColor={backgroundColor} />
                <SkeletonBase width="w-3/4" height="h-6" backgroundColor={backgroundColor} />
                <SkeletonText lines={2} backgroundColor={backgroundColor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
