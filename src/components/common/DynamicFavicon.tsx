'use client';

import { useEffect } from 'react';

export default function DynamicFavicon() {
  const removeFavicon = () => {
    // Remover todos los favicons existentes (incluyendo el principal)
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
  };

  const updateFavicon = (basePath: string) => {
    // Agregar timestamp para evitar cache
    const timestamp = Date.now();

    // Remover favicons existentes
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());

    // Usar el favicon.ico
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = `${basePath}?v=${timestamp}`;
    document.head.appendChild(link);

    // También agregar como shortcut para compatibilidad
    const shortcut = document.createElement('link');
    shortcut.rel = 'shortcut icon';
    shortcut.type = 'image/x-icon';
    shortcut.href = `${basePath}?v=${timestamp}`;
    document.head.appendChild(shortcut);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;

    // Detectar si es un subdominio
    // Un subdominio tiene al menos un punto antes del dominio raíz
    // Ejemplo: subdomain.example.com (subdominio) vs example.com (dominio principal)
    const parts = hostname.split('.');
    
    // Casos especiales para desarrollo local
    const isLocalDevelopment = hostname === 'localhost' || 
                               hostname === '127.0.0.1' ||
                               (hostname.includes('localhost') && !hostname.includes('.'));

    // Determinar si es dominio principal
    // En producción: si tiene más de 2 partes (subdominio.dominio.com) es subdominio
    // En localhost: si tiene un punto (subdomain.localhost) es subdominio
    let isSubdomain = false;
    
    if (isLocalDevelopment) {
      // En localhost, si tiene un punto es subdominio (ej: empresa.localhost)
      isSubdomain = hostname.includes('.') && hostname !== 'localhost';
    } else {
      // En producción, si tiene más de 2 partes es subdominio (ej: empresa.example.com tiene 3 partes)
      // Dominios principales tienen max 2 partes (ej: example.com, www.example.com)
      // www es tratado como dominio principal
      isSubdomain = parts.length > 2 && parts[0] !== 'www';
    }

    if (isSubdomain) {
      // Es un subdominio - remover el favicon principal
      removeFavicon();
    } else {
      // Es el dominio principal - usar el favicon.ico
      updateFavicon('/favicon.ico');
    }
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
