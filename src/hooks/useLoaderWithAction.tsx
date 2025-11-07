'use client';

import { useCallback } from 'react';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

/**
 * Hook para ejecutar acciones asíncronas con un loader
 * Útil para operaciones de API, procesos largos, etc.
 */
export function useLoaderWithAction() {
  const { showLoader, hideLoader, setLoadingWithTimeout } = useGlobalLoader();

  const executeWithLoader = useCallback(async <T,>(
    action: () => Promise<T>,
    loadingMessage: string = 'Procesando...',
    timeout?: number
  ): Promise<T> => {
    showLoader(loadingMessage);

    try {
      const result = await action();
      hideLoader();
      return result;
    } catch (error) {
      hideLoader();
      throw error;
    }
  }, [showLoader, hideLoader]);

  return {
    executeWithLoader,
    showLoader,
    hideLoader,
    setLoadingWithTimeout
  };
}