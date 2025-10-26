'use client';

import React from 'react';
import { SkeletonBase, SkeletonText } from './SkeletonBase';

interface AboutSkeletonProps {
  backgroundColor?: string;
}

export const AboutSkeleton: React.FC<AboutSkeletonProps> = ({ backgroundColor = '#e5e7eb' }) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SkeletonBase width="w-3/4" height="h-10" className="mb-6" backgroundColor={backgroundColor} />
            <SkeletonText lines={4} className="mb-8" backgroundColor={backgroundColor} />

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 rounded-lg">
                <SkeletonBase width="w-24 mx-auto" height="h-12" className="mb-2" backgroundColor={backgroundColor} />
                <SkeletonBase width="w-32 mx-auto" height="h-4" backgroundColor={backgroundColor} />
              </div>
              <div className="text-center p-6 rounded-lg">
                <SkeletonBase width="w-24 mx-auto" height="h-12" className="mb-2" backgroundColor={backgroundColor} />
                <SkeletonBase width="w-32 mx-auto" height="h-4" backgroundColor={backgroundColor} />
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <SkeletonBase width="w-6" height="h-6" rounded="full" backgroundColor={backgroundColor} />
                  <SkeletonBase width="w-full" height="h-6" backgroundColor={backgroundColor} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-96 lg:h-[500px]">
            <SkeletonBase height="h-full" rounded="xl" backgroundColor={backgroundColor} />
          </div>
        </div>
      </div>
    </section>
  );
};
