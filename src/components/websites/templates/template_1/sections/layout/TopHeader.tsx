'use client';

import React from 'react';
import { PhoneIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";
import { TemplateConfig } from '../types';

interface TopHeaderProps {
  config: TemplateConfig;
}

const TopHeader: React.FC<TopHeaderProps> = ({ config }) => {
  return (
    <div 
      className="text-white py-2"
      style={{ backgroundColor: config.colors.accent }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <PhoneIcon className="h-4 w-4" />
              <span>{config.company.phone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <EnvelopeIcon className="h-4 w-4" />
              <span>{config.company.email}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>Lun - Vie: 9:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;