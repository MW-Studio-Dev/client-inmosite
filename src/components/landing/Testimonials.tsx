"use client";

import React from 'react';
import { Avatar } from "@heroui/react";
import { HiStar } from "react-icons/hi2";
import { Testimonial } from '@/types/landing';

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "María González",
      company: "Inmobiliaria Premium",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Increíble plataforma. Desde que la usamos, nuestras ventas aumentaron un 40%. El sitio web es hermoso y fácil de usar."
    },
    {
      name: "Carlos Rodríguez",
      company: "PropiedadesCR",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "El mejor sistema que he usado. Muy intuitivo y el soporte al cliente es excepcional. Lo recomiendo totalmente."
    },
    {
      name: "Ana Martínez",
      company: "Hogar & Cia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Perfecto para mi inmobiliaria. Ahora mis clientes pueden ver las propiedades 24/7 desde cualquier lugar."
    }
  ];

  return (
    <section id="testimonios" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
            <span className="text-gray-100">
              Lo que dicen nuestros{" "}
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
              clientes
            </span>
          </h2>
          <p className="text-lg text-gray-300 font-light">
            Más de{" "}
            <span className="text-red-400 font-medium">1,500 inmobiliarias</span>{" "}
            confían en nosotros
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-red-500/60 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-red-500/20 hover:shadow-xl"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 text-6xl text-red-500/10 font-serif leading-none select-none">
                &quot;
              </div>
              
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="relative">
                  {/* Avatar glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/10 blur-md group-hover:blur-lg transition-all duration-300" />
                  <Avatar 
                    src={testimonial.avatar} 
                    size="md" 
                    className="relative ring-2 ring-red-500/30 ring-opacity-50 group-hover:ring-red-400/60 transition-all duration-300" 
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-100 text-base group-hover:text-red-400 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 font-light text-sm group-hover:text-gray-300 transition-colors duration-300">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex gap-0.5 mb-4 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HiStar 
                    key={i} 
                    className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm group-hover:text-yellow-300 transition-colors duration-300" 
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 italic leading-relaxed font-light text-sm group-hover:text-gray-200 transition-colors duration-300 relative z-10">
              &quot;{testimonial.text}&quot;
              </p>
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-red-500/20 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-red-500/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150" />
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-300 text-sm font-light">4.9/5</span>
            </div>
            <div className="w-px h-6 bg-gray-700/50" />
            <span className="text-gray-300 text-sm font-light">
              Calificación promedio de nuestros clientes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
