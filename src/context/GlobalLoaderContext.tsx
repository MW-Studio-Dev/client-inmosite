'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  setLoadingWithTimeout: (message?: string, timeout?: number) => void;
}

const GlobalLoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Cargando...');

  const showLoader = useCallback((msg?: string) => {
    setMessage(msg || 'Cargando...');
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingWithTimeout = useCallback((msg?: string, timeout: number = 3000) => {
    setMessage(msg || 'Cargando...');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, timeout);
  }, []);

  return (
    <GlobalLoaderContext.Provider value={{
      isLoading,
      message,
      showLoader,
      hideLoader,
      setLoadingWithTimeout
    }}>
      {children}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = useContext(GlobalLoaderContext);
  if (context === undefined) {
    throw new Error('useGlobalLoader must be used within a GlobalLoaderProvider');
  }
  return context;
}
