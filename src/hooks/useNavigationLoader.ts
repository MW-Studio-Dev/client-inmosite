'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

export function useNavigationLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const { showLoader, hideLoader } = useGlobalLoader();

  // Función de navegación con loader
  const navigateWithLoader = useCallback((href: string, message?: string) => {
    showLoader(message || 'Navegando...');

    // Pequeño delay para asegurar que el loader se muestre antes del cambio de ruta
    setTimeout(() => {
      router.push(href);

      // Ocultar el loader después de un tiempo máximo por si la página tarda en cargar
      setTimeout(() => {
        hideLoader();
      }, 2000);
    }, 100);
  }, [router, showLoader, hideLoader]);

  // Detectar cambios de ruta para mostrar/ocultar el loader automáticamente
  useEffect(() => {
    // Ocultar el loader cuando la ruta ha cambiado
    hideLoader();
  }, [pathname, hideLoader]);

  return {
    navigateWithLoader,
    showLoader,
    hideLoader
  };
}