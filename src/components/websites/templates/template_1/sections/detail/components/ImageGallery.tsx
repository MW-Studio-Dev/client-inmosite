'use client';

import React from 'react';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  HeartIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ImageGalleryProps {
  images: PropertyImage[];
  currentImageIndex: number;
  onImageChange: (direction: 'prev' | 'next') => void;
  onImageSelect: (index: number) => void;
  onZoomOpen: () => void;
  property: any;
  templateConfig: any;
  apiProperty?: any;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentImageIndex,
  onImageChange,
  onImageSelect,
  onZoomOpen,
  property,
  templateConfig,
  apiProperty
}) => {
  return (
    <div className="space-y-4">
      <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden group cursor-pointer" onClick={onZoomOpen}>
        {images[currentImageIndex]?.url ? (
          <Image
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <HomeIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Imagen no disponible</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-800" />
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onImageChange('prev'); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onImageChange('next'); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute top-4 left-4 flex space-x-2">
          <span
            style={{
              backgroundColor: property.status === 'sale' ? templateConfig.colors.primary : templateConfig.colors.success,
              color: 'white'
            }}
            className="px-3 py-1 rounded-full text-sm font-semibold"
          >
            {property.status === 'sale' ? 'En Venta' : 'En Alquiler'}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            style={{ backgroundColor: templateConfig.colors.surface }}
            className="p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ShareIcon className="h-5 w-5" style={{ color: templateConfig.colors.text }} />
          </button>
          <button
            style={{ backgroundColor: templateConfig.colors.surface }}
            className="p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <HeartIcon className="h-5 w-5" style={{ color: templateConfig.colors.text }} />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>

        {apiProperty && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            {apiProperty.views_count} vistas
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onImageSelect(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <HomeIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;