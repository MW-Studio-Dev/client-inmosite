'use client';

import React from 'react';
import { HiHome } from 'react-icons/hi';

export default function PropertiesRentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <HiHome className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Propiedades en Alquiler</h1>
          <p className="text-gray-600 mb-4">Gestiona el catálogo de propiedades en alquiler</p>
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md">
            <span className="text-sm font-medium">Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
