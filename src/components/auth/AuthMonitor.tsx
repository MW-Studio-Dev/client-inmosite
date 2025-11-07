"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Componente simplificado que solo verifica la autenticación al montar.
 * Eliminado el monitoreo de tokens para prevenir ciclos.
 */
export const AuthMonitor = () => {
  const { checkAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    // Solo verificar auth al montar para evitar ciclos
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Este componente no renderiza nada
  return null;
};
