"use client";

import React from 'react';
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import Image from 'next/image';

const Footer: React.FC = () => {
  // const [email, setEmail] = useState('');



  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-800/50">
      {/* Main Footer */}
      <div className="py-12 relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="relative w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 lg:w-48 lg:h-24 mx-auto mb-4">
              <Image
                src='/logo.png'
                alt="Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

            {/* Description */}
            <p className="text-gray-400 max-w-md mx-auto mb-8 font-light">
              La plataforma líder para inmobiliarias modernas.
            </p>

            {/* Social Media */}
            <div className="flex justify-center gap-4 mb-8">
              {[
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaLinkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-400/50 transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              {[
                { text: "Términos y Condiciones", href: "#" },
                { text: "Política de Privacidad", href: "#" },
                { text: "Contacto", href: "#" },
                { text: "Ayuda", href: "#" }
              ].map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300 font-light"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800/50 pt-8 text-center">
            <p className="text-gray-500 text-sm font-light">
              © 2025 InmoSite by{" "}
              <span className="text-red-400 font-normal">MW Studio Digital</span>.{" "}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;