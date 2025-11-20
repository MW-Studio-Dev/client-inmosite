'use client';

import React from 'react';

interface AmenitiesSectionProps {
  amenities: string[];
  templateConfig: any;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  amenities,
  templateConfig
}) => {
  return (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <h3
        style={{ color: templateConfig.colors.text }}
        className="text-xl font-bold mb-6"
      >
        Características y Amenidades
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              style={{ backgroundColor: templateConfig.colors.primary + '20' }}
              className="w-2 h-2 rounded-full flex-shrink-0"
            />
            <span
              style={{ color: templateConfig.colors.text }}
              className="text-base"
            >
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSection;