'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Input, Select } from '@/components/ui';
import { SectionProps, PropertyType, PropertyStatus } from '@/types/theme';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface PropertySearchForm {
  type: PropertyType | '';
  status: PropertyStatus | '';
  location: string;
  priceMin: string;
  priceMax: string;
}

export function HeroSection({ className }: SectionProps) {
  const { config } = useTheme();
  const [searchForm, setSearchForm] = useState<PropertySearchForm>({
    type: '',
    status: '',
    location: '',
    priceMin: '',
    priceMax: '',
  });

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'office', label: 'Office' },
  ];

  const propertyStatus = [
    { value: 'for_sale', label: 'For Sale' },
    { value: 'for_rent', label: 'For Rent' },
  ];

  const handleFormChange = (field: keyof PropertySearchForm, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values
    const filters = Object.entries(searchForm).reduce((acc, [key, value]) => {
      if (value.trim() !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    console.log('Search filters:', filters);
    
    // Scroll to properties section
    const propertiesSection = document.querySelector('#properties');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const baseClasses = [
    'relative min-h-screen flex items-center justify-center',
    'bg-background overflow-hidden',
  ];

  const sectionClasses = cn(baseClasses, className);

  return (
    <section id="home" className={sectionClasses}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {config.hero.backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={config.hero.backgroundVideo} type="video/mp4" />
          </video>
        ) : config.hero.backgroundImage ? (
          <Image
            src={config.hero.backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-700"></div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{ opacity: config.hero.overlayOpacity }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            {config.hero.title}
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {config.hero.subtitle}
          </p>

          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-6 lg:p-8 mb-8 animate-fade-in-up animation-delay-400">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Form Title */}
              <h2 className="text-2xl font-semibold text-text-primary text-center mb-6">
                Find Your Dream Property
              </h2>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Property Type */}
                <div className="lg:col-span-1">
                  <Select
                    options={[{ value: '', label: 'Property Type' }, ...propertyTypes]}
                    value={searchForm.type}
                    onChange={(value) => handleFormChange('type', value)}
                    placeholder="Property Type"
                    fullWidth
                  />
                </div>

                {/* Status */}
                <div className="lg:col-span-1">
                  <Select
                    options={[{ value: '', label: 'Buy or Rent' }, ...propertyStatus]}
                    value={searchForm.status}
                    onChange={(value) => handleFormChange('status', value)}
                    placeholder="Buy or Rent"
                    fullWidth
                  />
                </div>

                {/* Location */}
                <div className="lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Location"
                    value={searchForm.location}
                    onChange={(value) => handleFormChange('location', value)}
                    fullWidth
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  />
                </div>

                {/* Price Range */}
                <div className="lg:col-span-1 flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={searchForm.priceMin}
                    onChange={(value) => handleFormChange('priceMin', value)}
                    fullWidth
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={searchForm.priceMax}
                    onChange={(value) => handleFormChange('priceMax', value)}
                    fullWidth
                  />
                </div>

                {/* Search Button */}
                <div className="lg:col-span-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="h-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-surface-border">
                <span className="text-sm text-text-secondary mr-2">Popular searches:</span>
                {['Luxury Homes', 'Apartments Downtown', 'Beachfront Properties', 'Investment Properties'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors duration-200"
                    onClick={() => {
                      setSearchForm(prev => ({ ...prev, location: filter }));
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* CTA Button */}
          <Button
            href={config.hero.ctaLink}
            variant="accent"
            size="xl"
            className="animate-fade-in-up animation-delay-600"
          >
            {config.hero.ctaText}
          </Button>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg 
              className="w-6 h-6 text-white cursor-pointer"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              onClick={() => {
                const nextSection = document.querySelector('#featured-properties');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
