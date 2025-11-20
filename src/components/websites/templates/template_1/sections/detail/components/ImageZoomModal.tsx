'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon
} from "@heroicons/react/24/outline";

interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ImageZoomModalProps {
  isOpen: boolean;
  images: PropertyImage[];
  currentIndex: number;
  onClose: () => void;
  onChangeImage: (index: number) => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onChangeImage
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between items-center z-10">
        <div className="text-white text-lg font-semibold">
          {currentIndex + 1} / {images.length} - {images[currentIndex].alt}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50"
          >
            <MagnifyingGlassMinusIcon className="h-6 w-6" />
          </button>
          <span className="text-white min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50"
          >
            <MagnifyingGlassPlusIcon className="h-6 w-6" />
          </button>
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onChangeImage(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full z-10"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          <button
            onClick={() => onChangeImage(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full z-10"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            maxWidth: '90vw',
            maxHeight: '80vh'
          }}
        >
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            width={1200}
            height={800}
            className="object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onChangeImage(index)}
              className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageZoomModal;