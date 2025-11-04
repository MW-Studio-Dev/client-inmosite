"use client";

import { useEffect } from 'react';
import { useTokenMonitor } from '@/hooks/useTokenMonitor';
import { useAuth } from '@/hooks/useAuth';

/**
 * Componente que monitorea el estado de autenticación del usuario.
 * - Verifica tokens periódicamente
 * - Renueva automáticamente cuando están próximos a expirar
 * - Cierra sesión cuando los tokens son inválidos o expirados
 *
 * Este componente debe ser incluido en el layout principal de la aplicación.
 */
export const AuthMonitor = () => {
  const { checkAuth, isAuthenticated } = useAuth();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Monitorear tokens si el usuario está autenticado
  useTokenMonitor({
    checkInterval: 60000, // Verificar cada 1 minuto
    autoRefreshThreshold: 300000, // Renovar si faltan menos de 5 minutos (300000 ms)
    enabled: isAuthenticated,
  });

  // Este componente no renderiza nada
  return null;
};
