'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, HomeIcon, BuildingOfficeIcon, CubeIcon } from "@heroicons/react/24/outline";
import { RelatedProperty } from '../types';
import { getStatusText } from '../utils';

interface RelatedPropertiesProps {
  relatedProperties: RelatedProperty[];
  templateConfig: any;
  getStatusColor: (status: 'sale' | 'rent') => string;
}

const RelatedProperties: React.FC<RelatedPropertiesProps> = ({
  relatedProperties,
  templateConfig,
  getStatusColor
}) => {
  return (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <h3
        style={{ color: templateConfig.colors.text }}
        className="text-2xl font-bold mb-6 text-center"
      >
        Otras propiedades que podrían gustarte
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProperties.map((relatedProperty) => (
          <div
            key={relatedProperty.id}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: templateConfig.colors.background }}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={relatedProperty.image}
                alt={relatedProperty.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />

              <div className="absolute top-3 left-3">
                <span
                  style={{
                    backgroundColor: getStatusColor(relatedProperty.status),
                    color: 'white'
                  }}
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {getStatusText(relatedProperty.status)}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <button className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all">
                  <HeartIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h4
                style={{ color: templateConfig.colors.text }}
                className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
              >
                {relatedProperty.title}
              </h4>

              <div
                style={{ color: templateConfig.colors.primary }}
                className="text-xl font-bold mb-1"
              >
                US$ {relatedProperty.price.usd.toLocaleString()}
              </div>

              <div
                style={{ color: templateConfig.colors.textLight }}
                className="text-sm mb-3"
              >
                $ {relatedProperty.price.ars.toLocaleString()}
              </div>

              <div className="flex justify-between text-sm" style={{ color: templateConfig.colors.textLight }}>
                <span className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-1" />
                  {relatedProperty.bedrooms} hab
                </span>
                <span className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {relatedProperty.bathrooms} baños
                </span>
                <span className="flex items-center">
                  <CubeIcon className="h-4 w-4 mr-1" />
                  {relatedProperty.area}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/properties">
          <button
            style={{
              backgroundColor: 'transparent',
              color: templateConfig.colors.primary,
              borderColor: templateConfig.colors.primary
            }}
            className="px-8 py-3 border-2 rounded-lg font-semibold hover:bg-opacity-10 transition-colors duration-200"
          >
            Ver Todas las Propiedades
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RelatedProperties;