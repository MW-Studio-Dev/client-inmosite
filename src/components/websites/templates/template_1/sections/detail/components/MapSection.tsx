'use client';

import React from 'react';
import { MapPinIcon, MapIcon } from "@heroicons/react/24/outline";
import { getGoogleMapsEmbedUrl } from '../utils';

interface MapSectionProps {
  property: any;
  templateConfig: any;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  property,
  templateConfig,
  showMap,
  setShowMap
}) => {
  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'school': return '🏫';
      case 'shopping': return '🛒';
      case 'hospital': return '🏥';
      case 'park': return '🌳';
      case 'transport': return '🚇';
      default: return '📍';
    }
  };

  return (
    <div style={{ backgroundColor: templateConfig.colors.surface }} className="rounded-xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3
          style={{ color: templateConfig.colors.text }}
          className="text-xl font-bold"
        >
          Ubicación
        </h3>
        <button
          onClick={() => setShowMap(!showMap)}
          style={{
            color: templateConfig.colors.primary,
            borderColor: templateConfig.colors.primary
          }}
          className="flex items-center space-x-2 px-3 py-2 border rounded-lg hover:bg-opacity-10 transition-colors text-sm"
        >
          <MapIcon className="h-4 w-4" />
          <span>{showMap ? 'Ocultar Mapa' : 'Ver en Mapa'}</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-start space-x-3">
          <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: templateConfig.colors.primary }} />
          <div>
            <p style={{ color: templateConfig.colors.text }} className="font-semibold">
              {property.location.address}
            </p>
            <p style={{ color: templateConfig.colors.textLight }} className="text-sm">
              {property.location.neighborhood}, {property.location.city}
            </p>
            <p style={{ color: templateConfig.colors.textLight }} className="text-sm">
              {property.location.state}, {property.location.country}
            </p>
          </div>
        </div>
      </div>

      {showMap && (
        <div className="mt-6">
          <div className="relative h-64 lg:h-80 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={getGoogleMapsEmbedUrl(
                property.location.coordinates.lat,
                property.location.coordinates.lng,
                property.location.address
              )}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de ${property.location.address}`}
              className="rounded-lg"
            />

            <div className="absolute top-3 right-3 flex space-x-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${property.location.coordinates.lat},${property.location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-lg transition-all"
                title="Abrir en Google Maps"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </a>

              <button
                onClick={() => {
                  const address = `${property.location.address}, ${property.location.neighborhood}, ${property.location.city}`;
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                  window.open(url, '_blank');
                }}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-lg transition-all"
                title="Cómo llegar"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
            <div className="mt-4">
              <h4 style={{ color: templateConfig.colors.text }} className="font-semibold mb-3">
                Lugares de Interés Cercanos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.nearbyPlaces.slice(0, 6).map((place: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getPlaceIcon(place.type)}</span>
                      <span style={{ color: templateConfig.colors.text }} className="text-sm">
                        {place.name}
                      </span>
                    </div>
                    <span style={{ color: templateConfig.colors.textLight }} className="text-xs font-semibold">
                      {place.distance}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-center">
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/servicios+near+${property.location.coordinates.lat},${property.location.coordinates.lng}`;
                    window.open(url, '_blank');
                  }}
                  style={{ color: templateConfig.colors.primary }}
                  className="text-sm hover:underline"
                >
                  Ver más lugares cercanos en Google Maps
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSection;