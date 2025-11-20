'use client';

import React from 'react';
import { MapPinIcon } from "@heroicons/react/24/outline";

interface PropertyInfoProps {
  property: any;
  templateConfig: any;
  formatPrice: (currency: 'USD' | 'ARS') => string;
  showUSD: boolean;
  setShowUSD: (show: boolean) => void;
  getFeatureIcon: (featureName: string) => JSX.Element;
  apiProperty?: any;
}

const CurrencyToggle: React.FC<{
  showUSD: boolean;
  setShowUSD: (show: boolean) => void;
  templateConfig: any;
}> = ({ showUSD, setShowUSD, templateConfig }) => (
  <div className="flex items-center space-x-3 mb-4">
    <span style={{ color: templateConfig.colors.textLight }} className="text-sm font-medium">
      Mostrar precio en:
    </span>
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setShowUSD(true)}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
          showUSD
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        USD
      </button>
      <button
        onClick={() => setShowUSD(false)}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
          !showUSD
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        ARS
      </button>
    </div>
  </div>
);

const PropertyInfo: React.FC<PropertyInfoProps> = ({
  property,
  templateConfig,
  formatPrice,
  showUSD,
  setShowUSD,
  getFeatureIcon,
  apiProperty
}) => {
  return (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
        <div className="flex-1">
          <h1
            style={{ color: templateConfig.colors.text }}
            className="text-2xl lg:text-3xl font-bold mb-3"
          >
            {property.title}
          </h1>
          <div className="flex items-center mb-4" style={{ color: templateConfig.colors.textLight }}>
            <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-lg">
              {property.location.address}, {property.location.neighborhood}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 mt-4 lg:mt-0">
          <CurrencyToggle
            showUSD={showUSD}
            setShowUSD={setShowUSD}
            templateConfig={templateConfig}
          />
          <div
            style={{ color: templateConfig.colors.primary }}
            className="text-3xl lg:text-4xl font-bold"
          >
            {formatPrice(showUSD ? 'USD' : 'ARS')}
            {property.status === 'rent' && (
              <span className="text-lg text-gray-500">/mes</span>
            )}
          </div>
          <div
            style={{ color: templateConfig.colors.textLight }}
            className="text-sm mt-1"
          >
            {formatPrice(showUSD ? 'ARS' : 'USD')}
          </div>
          {apiProperty && (
            <div className="text-sm text-gray-500 mt-2">
              <p>Código: {apiProperty.internal_code}</p>
              <p className="font-medium text-gray-700">{apiProperty.main_features}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {property.features.slice(0, 6).map((feature: any) => (
          <div key={feature.id} className="text-center">
            <div
              style={{ color: templateConfig.colors.primary }}
              className="flex justify-center mb-2"
            >
              {getFeatureIcon(feature.name)}
            </div>
            <div
              style={{ color: templateConfig.colors.text }}
              className="font-semibold text-lg"
            >
              {feature.value}
            </div>
            <div
              style={{ color: templateConfig.colors.textLight }}
              className="text-sm"
            >
              {feature.name}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6" style={{ borderColor: templateConfig.colors.textLight + '20' }}>
        <h3
          style={{ color: templateConfig.colors.text }}
          className="text-xl font-bold mb-4"
        >
          Descripción
        </h3>
        <p
          style={{ color: templateConfig.colors.textLight }}
          className="text-lg leading-relaxed"
        >
          {property.description}
        </p>
      </div>
    </div>
  );
};

export default PropertyInfo;